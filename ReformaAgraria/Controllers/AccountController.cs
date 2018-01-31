using System;
using System.Threading.Tasks;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ReformaAgraria.Models;
using ReformaAgraria.Models.ViewModels;
using ReformaAgraria.Security;
using System.Linq;
using System.Collections.Generic;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using MicrovacWebCore.Helpers;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(Policy = "Bearer")]
    [NotGenerated]
    public class AccountController : ControllerBase
    {
        private readonly ReformaAgrariaDbContext _context;
        private readonly UserManager<ReformaAgrariaUser> _userManager;
        private readonly SignInManager<ReformaAgrariaUser> _signInManager;
        private readonly ILogger<AccountController> _logger;
        private readonly TokenAuthOption _tokenOptions;
        private readonly IConfiguration _iconfiguration;
        private readonly IAuthorizationService _authorizationService;

        public AccountController(
            ReformaAgrariaDbContext context,
            UserManager<ReformaAgrariaUser> userManager,
            SignInManager<ReformaAgrariaUser> signInManager,
            ILogger<AccountController> logger,
            IOptions<TokenAuthOption> tokenOptions,
            IConfiguration iconfiguration,
            IAuthorizationService authorizationService
        )
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _tokenOptions = tokenOptions.Value;
            _iconfiguration = iconfiguration;
            _authorizationService = authorizationService;
        }

        // [ValidateAntiForgeryToken]
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            var user = _signInManager.UserManager.Users.Where(u => u.Email == model.Email).FirstOrDefault();
            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, isPersistent: true, lockoutOnFailure: false);
            if (result.Succeeded)
            {
                var claimsUser = await _userManager.FindByEmailAsync(model.Email);
                var claims = _userManager.GetClaimsAsync(claimsUser);
                var id = new ClaimsIdentity(claims.Result);

                id.AddClaim(new Claim(ClaimTypes.Email, claimsUser.Email));
                id.AddClaim(new Claim(ClaimTypes.NameIdentifier, claimsUser.Id));

                var requestAt = DateTime.Now;
                var expiresIn = requestAt + TokenAuthOption.ExpiresSpan;
                var token = GenerateToken(expiresIn, id);

                return Ok(new RequestResult
                {
                    State = RequestState.Success,
                    Data = new
                    {
                        requestAt = requestAt,
                        expiresIn = TokenAuthOption.ExpiresSpan.TotalSeconds,
                        tokenType = TokenAuthOption.TokenType,
                        accessToken = token                        
                    }
                });
            }
            else
            {
                return BadRequest(new RequestResult
                {
                    State = RequestState.Failed,
                    Message = "Email or password is invalid"
                });
            }
        }

        [HttpPost("register")]
        [Authorize(Policy = "Administrator")]
        public async Task<IActionResult> Register([FromBody] LoginViewModel model)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var user = new ReformaAgrariaUser { UserName = model.Email, Email = model.Email, FullName = model.FullName };
                    user.Claims.Add(new IdentityUserClaim<string>
                    {
                        ClaimType = "external",
                        ClaimValue = "true"
                    });
                    user.Claims.Add(new IdentityUserClaim<string>
                    {
                        ClaimType = ClaimTypes.Role,
                        ClaimValue = "User"
                    });

                    var result = await _userManager.CreateAsync(user, model.Password);
                    if (result.Succeeded)
                    {
                        transaction.Commit();
                        return Ok();
                    }
                    return BadRequest(result.Errors);
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex;
                }
            }

        }

        [HttpPost("logout")]
        [AllowAnonymous]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            return Ok();
        }        

        [HttpPost("password/recovery")]
        public async Task<IActionResult> SendPasswordRecoveryLink([FromBody] LoginViewModel model)
        {
            var user = _userManager.FindByEmailAsync(model.Email).Result;

            var authorizeResult = await _authorizationService.AuthorizeAsync(User, user, new AccountEditRequirement());
            if (!authorizeResult.Succeeded)
                return Forbid();

            var token = _userManager.GeneratePasswordResetTokenAsync(user).Result;
            string resetLink = Request.Scheme + "://" + Request.Host + "/account/resetpassword?id=" + user.Id + "&token=" + token;
            MailController mc = new MailController(_iconfiguration);
            string body = "Klik tautan di bawah ini untuk mereset password anda. </br><a href='" + resetLink + "'>Reset Password</a>";
            mc.SendEmail("Reset Password", body, new MailAddress(user.Email, user.UserName));
            return Ok();
        }

        [HttpPost("password/reset")]
        public async Task<IActionResult> ResetPassword(string id, string token, string password)
        {
            var user = _userManager.FindByIdAsync(id).Result;

            var authorizeResult = await _authorizationService.AuthorizeAsync(User, user, new AccountEditRequirement());
            if (!authorizeResult.Succeeded)
                return Forbid();

            IdentityResult result = _userManager.ResetPasswordAsync(user, token.Replace(" ", "+"), password).Result;
            if (result.Succeeded)
                return Ok();
            return BadRequest(result.Errors);
        }

        [HttpPost("password/change/{id}")]        
        public async Task<IActionResult> ChangePassword(string id, [FromBody]Dictionary<string, string> data)
        {
            var newPassword = data["newPassword"];
            var user = await _userManager.FindByIdAsync(id);

            var authorizeResult = await _authorizationService.AuthorizeAsync(User, user, new AccountEditRequirement());
            if (!authorizeResult.Succeeded)
                return Forbid();

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            return await ResetPassword(id, token, newPassword);
        }

        [HttpGet("user")]
        [Authorize(Policy = "Administrator")]
        public List<object> GetAllUser()
        {
            var users = _context.Users.ToList();
            var result = new List<object>();
            foreach (var user in users)
            {
                result.Add(new ReformaAgrariaUser {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName
                });
            }
            return result;
        }

        [HttpGet("user/{id}")]
        public ReformaAgrariaUser GetUserById(string id)
        {
            return _userManager.FindByIdAsync(id).Result;
        }

        [HttpDelete("user/{id}")]
        [Authorize(Policy = "Administrator")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var userDetail = _userManager.FindByIdAsync(id).Result;

            await _userManager.DeleteAsync(userDetail);

            return Ok();
        }

        [HttpPut("user/{id}")]
        [Authorize(Policy = "Administrator")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody]Dictionary<string, string> data)
        {
            var newEmail = data["email"];
            using (var transaction = _context.Database.BeginTransaction())
            {
                var userDetail = _userManager.FindByIdAsync(id).Result;

                userDetail.Email = newEmail;
                userDetail.NormalizedEmail = newEmail.ToUpper();
                userDetail.UserName = newEmail;
                userDetail.NormalizedUserName = newEmail.ToUpper();
                IdentityResult result = await _userManager.UpdateAsync(userDetail);
                transaction.Commit();
            }

            return Ok();
        }

        private string GenerateToken(DateTime expires, ClaimsIdentity claims)
        {
            var handler = new JwtSecurityTokenHandler();

            var securityToken = handler.CreateToken(new SecurityTokenDescriptor
            {
                Issuer = _tokenOptions.Issuer,
                Audience = _tokenOptions.Audience,
                SigningCredentials = _tokenOptions.SigningCredentials,
                Subject = claims,
                NotBefore = DateTime.Now,
                Expires = expires
            });

            return handler.WriteToken(securityToken);
        }
    }
}
