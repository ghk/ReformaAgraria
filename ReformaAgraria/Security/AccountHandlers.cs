using Microsoft.AspNetCore.Authorization;
using ReformaAgraria.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ReformaAgraria.Security
{
    public class AccountEditRequirement : IAuthorizationRequirement { }

    public class AccountEditHandler: AuthorizationHandler<AccountEditRequirement, ReformaAgrariaUser>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, AccountEditRequirement requirement, ReformaAgrariaUser resource)
        {
            var isAdmin = context.User.HasClaim(c => c.Type == ClaimTypes.Role && c.Value == "Administrator");
            var isNameValid = context.User.FindFirstValue(ClaimTypes.NameIdentifier) == resource.Id;
            
            if (isAdmin || isNameValid)
                context.Succeed(requirement);

            return Task.CompletedTask;
        }
    }
}
