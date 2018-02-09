using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetService<ReformaAgrariaDbContext>();
            var userManager = serviceProvider.GetService<UserManager<ReformaAgrariaUser>>();

            context.Database.EnsureCreated();

            string user = "admin@admin.com";

            if (!context.Users.Any(r => r.UserName == user))
            {
                string fullName = "Administrator";
                string email = "admin@admin.com";
                string password = "admin";
                var result = await userManager.CreateAsync(new ReformaAgrariaUser { UserName = user, Email = email, FullName = fullName, EmailConfirmed = true }, password);
            }

            var adminUser = await userManager.FindByNameAsync(user);
            if (!context.UserClaims.Any(r => r.ClaimType == ClaimTypes.Role && r.ClaimValue == "Administrator"))
                await userManager.AddClaimAsync(adminUser, new Claim(ClaimTypes.Role, "Administrator"));
        }
    }
}