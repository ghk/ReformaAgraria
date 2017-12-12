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

namespace ReformaAgraria.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly ReformaAgrariaDbContext _context;
        private readonly UserManager<ReformaAgrariaUser> _userManager;
        private readonly SignInManager<ReformaAgrariaUser> _signInManager;
        private readonly ILogger<AccountController> _logger;
        private readonly TokenAuthOption _tokenOptions;
        private readonly IConfiguration _iconfiguration;

        public AccountController(
            ReformaAgrariaDbContext context,
            UserManager<ReformaAgrariaUser> userManager,
            SignInManager<ReformaAgrariaUser> signInManager,
            ILogger<AccountController> logger,
            IConfiguration iconfiguration,
            IOptions<TokenAuthOption> tokenOptions)

        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = logger;
            _tokenOptions = tokenOptions.Value;
            _iconfiguration = iconfiguration;
        }

        // POST: /Account/login
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
                        accessToken = token,
                        userName = claimsUser.UserName
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


        // POST: /Account/register
        [HttpPost("register")]
        [AllowAnonymous]
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

        // POST: /Account/LogOff
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
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

        [HttpPost("sendpasswordrecoverylink")]
        [AllowAnonymous]
        public async Task<IActionResult> SendPasswordRecoveryLink([FromBody] LoginViewModel model)
        {
            var user =  _userManager.FindByEmailAsync(model.Email).Result;

            var token = _userManager.GeneratePasswordResetTokenAsync(user).Result;
            
            string resetLink = Request.Scheme + "://" + Request.Host + "/account/resetpassword?id=" + user.Id + "&token=" + token;

            MailController mc = new MailController(_iconfiguration);
            string body = "Klik tautan di bawah ini untuk mereset password anda. </br><a href='" + resetLink + "'>Reset Password</a>";
            mc.SendEmail("Reset Password", body, new MailAddress(user.Email, user.UserName));

            return Ok();
        }

        [HttpPost("resetpassword")]
        public async Task<IActionResult> ResetPassword(string id, string token, string password)
        {
            var user = _userManager.FindByIdAsync(id).Result;
            
            IdentityResult result = _userManager.ResetPasswordAsync(user, token.Replace(" ", "+"), password).Result;
            if (result.Succeeded)
            {
                return Ok();
            }
            return BadRequest(result.Errors);
        }

        [HttpPost("changepassword")]
        public async Task<IActionResult> ChangePassword(string id, string newPassword)
        {
            var user = _userManager.FindByIdAsync(id).Result;
            
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            return await ResetPassword(id, token, newPassword);
        }

        [HttpGet("user")]
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
        public async Task<IActionResult> DeleteUser(string id)
        {
            var userDetail = _userManager.FindByIdAsync(id).Result;

            await _userManager.DeleteAsync(userDetail);

            return Ok();
        }

        [HttpPut("user/{id}")]
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
    }
}
