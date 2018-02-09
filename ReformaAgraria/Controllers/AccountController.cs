﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using MicrovacWebCore.Exceptions;
using MicrovacWebCore.Helpers;
using ReformaAgraria.Helpers;
using ReformaAgraria.Models;
using ReformaAgraria.Models.ViewModels;
using ReformaAgraria.Security;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Mail;
using System.Security.Claims;
using System.Threading.Tasks;

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
        private readonly ILogger<MailController> _mailLogger;
        private readonly TokenAuthOption _tokenOptions;
        private readonly IConfiguration _iconfiguration;
        private readonly IAuthorizationService _authorizationService;

        public AccountController(
            ReformaAgrariaDbContext context,
            UserManager<ReformaAgrariaUser> userManager,
            SignInManager<ReformaAgrariaUser> signInManager,
            ILogger<AccountController> logger,
            ILogger<MailController> mailLogger,
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
            _mailLogger = mailLogger;
        }

        // [ValidateAntiForgeryToken]
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] LoginViewModel model)
        {
            var user = _signInManager.UserManager.Users.Where(u => u.Email == model.Email).FirstOrDefault();
            var result = await _signInManager.PasswordSignInAsync(user.UserName, model.Password, isPersistent: true, lockoutOnFailure: false);
            if (!result.Succeeded)
                throw new BadRequestException("Email atau Password salah");

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
                Data = new
                {
                    requestAt = requestAt,
                    expiresIn = TokenAuthOption.ExpiresSpan.TotalSeconds,
                    tokenType = TokenAuthOption.TokenType,
                    accessToken = token
                }
            });
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

                    var exception = new BadRequestException();
                    exception.Errors = result.Errors;
                    throw exception;
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
        [AllowAnonymous]
        public async Task<IActionResult> SendPasswordRecoveryLink([FromBody] LoginViewModel model)
        {
            var user = _userManager.FindByEmailAsync(model.Email).Result;
            var authorizeResult = await _authorizationService.AuthorizeAsync(User, user, new AccountEditRequirement());
            if (!authorizeResult.Succeeded)
                throw new UnauthorizedException();

            var token = _userManager.GeneratePasswordResetTokenAsync(user).Result;
            string resetLink = Request.Scheme + "://" + Request.Host + "/account/resetpassword?email=" + user.Email + "&id=" + user.Id + "&token=" + token;
            MailController mc = new MailController(_iconfiguration, _mailLogger);
            string body = "Klik tautan di bawah ini untuk mereset password anda. </br><a href='" + resetLink + "'>Reset Password</a>";
            mc.SendEmail("Reset Password", body, new MailAddress(user.Email, user.UserName));
            return Ok();
        }

        [HttpPost("password/reset/{id}/{token}")]
        public async Task<IActionResult> ResetPassword(string id, string token, [FromBody]Dictionary<string, string> data)
        {
            var user = _userManager.FindByIdAsync(id).Result;

            var authorizeResult = await _authorizationService.AuthorizeAsync(User, user, new AccountEditRequirement());
            if (!authorizeResult.Succeeded)
                return Forbid();

            IdentityResult result = _userManager.ResetPasswordAsync(user, token.Replace(" ", "+"), data["newPassword"]).Result;
            if (result.Succeeded)
                return Ok();
            return BadRequest(result.Errors);
        }

        [HttpPost("password/change/{id}")]
        public async Task<IActionResult> ChangePassword(string id, [FromBody]Dictionary<string, string> data)
        {
            var user = await _userManager.FindByIdAsync(id);

            var authorizeResult = await _authorizationService.AuthorizeAsync(User, user, new AccountEditRequirement());
            if (!authorizeResult.Succeeded)
                return Forbid();

            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            return await ResetPassword(id, token, data);
        }

        [HttpGet("user")]
        [Authorize(Policy = "Administrator")]
        public List<object> GetAllUser()
        {
            var users = _context.Users.ToList();
            var result = new List<object>();
            foreach (var user in users)
            {
                result.Add(new ReformaAgrariaUser
                {
                    Id = user.Id,
                    Email = user.Email,
                    FullName = user.FullName
                });
            }
            return result;
        }

        [HttpGet("user/{id}")]
        [Authorize(Policy = "Administrator")]
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