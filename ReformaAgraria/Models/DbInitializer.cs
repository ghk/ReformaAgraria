using Microsoft.Extensions.DependencyInjection;
using System;
using System.Linq;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public static class DbInitializer
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            var context = serviceProvider.GetService<ReformaAgrariaDbContext>();
            var userManager = serviceProvider.GetService<UserManager<ReformaAgrariaUser>>();
            var roleManager = serviceProvider.GetService<RoleManager<IdentityRole>>();

            context.Database.EnsureCreated();

            string[] roles = new string[] { "Administrator", "User" };

            foreach(var role in roles)
            {
                if (!context.Roles.Any(r => r.Name == role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

            if (context.Users.Any(r => r.UserName == "admin")) return;

            //Create the default Admin account and apply the Administrator role
            string user = "admin";
            string email = "admin@admin.com";
            string password = "admin";
            var result = await userManager.CreateAsync(new ReformaAgrariaUser { UserName = user, Email = email, EmailConfirmed = true }, password);
            await userManager.AddToRoleAsync(await userManager.FindByNameAsync(user), "Administrator");
        }
           
    }
}
