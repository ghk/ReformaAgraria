using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using System.Security.Claims;

namespace ReformaAgraria.Models
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetService<ReformaAgrariaDbContext>();
            var userManager = serviceProvider.GetService<UserManager<ReformaAgrariaUser>>();

            context.Database.EnsureCreated();

            if (context.Users.Any(r => r.UserName == "admin")) return;

            //Create the default Admin account and apply the Administrator role
            string user = "admin";
            string email = "admin@admin.com";
            string password = "admin";
            var result = await userManager.CreateAsync(new ReformaAgrariaUser { UserName = user, Email = email, EmailConfirmed = true }, password);

            var newUser = await userManager.FindByNameAsync(user);
            if (!context.UserClaims.Any(r => r.ClaimType == ClaimTypes.Role && r.ClaimValue == "Administrator"))
                await userManager.AddClaimAsync(newUser, new Claim(ClaimTypes.Role, "Administrator"));
        }
           
    }
}
