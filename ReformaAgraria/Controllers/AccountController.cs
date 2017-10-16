using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Principal;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using ReformaAgraria.Models;
using ReformaAgraria.Security;
using System.Transactions;

namespace ReformaAgraria.Controllers
{
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly ReformaAgrariaDbContext _context;
        private readonly UserManager<ReformaAgrariaUser> _userManager;
        private readonly RoleManager<IdentityRole> roleManager;
        private readonly SignInManager<ReformaAgrariaUser> _signInManager;
        private readonly ILogger _logger;
        private readonly TokenAuthOption _tokenOptions;

        public AccountController(
            ReformaAgrariaDbContext context,
            UserManager<ReformaAgrariaUser> userManager,
            SignInManager<ReformaAgrariaUser> signInManager,
            ILoggerFactory loggerFactory,
            IOptions<TokenAuthOption> tokenOptions)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _logger = loggerFactory.CreateLogger<AccountController>();
            _tokenOptions = tokenOptions.Value;
        }

        // POST: /Account/login
        // [ValidateAntiForgeryToken]
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] ReformaAgrariaUser model)
        {
            var result = await _signInManager.PasswordSignInAsync(model.UserName, model.PasswordHash, isPersistent: true, lockoutOnFailure: false);

            if (result.Succeeded)
            {
                var claimsUser = await _userManager.FindByNameAsync(model.UserName);
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
                        accessToken = token
                    }
                });
            }
            else
            {
                return BadRequest(new RequestResult
                {
                    State = RequestState.Failed,
                    Message = "Username or password is invalid"
                });
            }
        }


        // POST: /Account/register
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] ReformaAgrariaUser model)
        {
            using (var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var user = new ReformaAgrariaUser { UserName = model.UserName, Email = model.Email };
                    user.Claims.Add(new IdentityUserClaim<string>
                    {
                        ClaimType = "external",
                        ClaimValue = "true"
                    });

                    var result = await _userManager.CreateAsync(user, model.PasswordHash);
                    if (result.Succeeded)
                    {
                        var roleResult = await _userManager.AddToRoleAsync(user, "User");
                        if (roleResult.Succeeded)
                        {
                            transaction.Commit();
                            return Ok();
                        }

                        return BadRequest();
                    }
                    return BadRequest();
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex;
                }
            }
            
        }

        //
        // POST: /Account/LogOff
        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _signInManager.SignOutAsync();
            _logger.LogInformation(4, "User logged out.");
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
