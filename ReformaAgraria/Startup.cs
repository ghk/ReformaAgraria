using FluentValidation;
using GlobalExceptionHandler.WebApi;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SpaServices.Webpack;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using MicrovacWebCore.Exceptions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using ReformaAgraria.Helpers;
using ReformaAgraria.Models;
using ReformaAgraria.Security;
using System;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Buffering;

namespace ReformaAgraria
{
    public class Startup
    {
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
               .SetBasePath(env.ContentRootPath)
               .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
               .AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
               .AddEnvironmentVariables();
            Configuration = builder.Build();
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddOptions();            

            services.AddMvc().AddJsonOptions(options =>
            {
                options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
            });

            services.AddDbContext<ReformaAgrariaDbContext>(
                opts => opts.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<ReformaAgrariaUser, IdentityRole>()
                .AddEntityFrameworkStores<ReformaAgrariaDbContext>()
                .AddDefaultTokenProviders();

            services.Configure<IdentityOptions>(options =>
            {
                options.Password.RequireDigit = false;
                options.Password.RequiredLength = 5;
                options.Password.RequireNonAlphanumeric = false;
                options.Password.RequireLowercase = false;
                options.Password.RequireUppercase = false;
                options.User.AllowedUserNameCharacters =
                    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
                options.User.RequireUniqueEmail = true;
            });

            services.Configure<TokenAuthOption>(options =>
            {
                options.SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(
                        Encoding.ASCII.GetBytes(Configuration["Security:SecretKey"])),
                        SecurityAlgorithms.HmacSha256Signature);
            });

            services.AddAuthorization(options =>
            {
                options.AddPolicy("Bearer", policy =>
                {
                    policy.AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme);
                    policy.RequireClaim("external", "true");
                    policy.RequireAuthenticatedUser().Build();
                });

                options.AddPolicy("Administrator", policy => policy.RequireClaim(ClaimTypes.Role, "Administrator"));
            });

            services.AddSingleton<IAuthorizationHandler, AccountEditHandler>();

            var tokenValidationParameters = new TokenValidationParameters
            {
                //When this line commented, got invalid token audience error
                ValidAudience = "ReformaAgrariaAudience",
                ValidIssuer = "ReformaAgrariaIssuer",
                // When receiving a token, check that we've signed it.
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration["Security:SecretKey"])),
                // When receiving a token, check that it is still valid.
                RequireExpirationTime = true,
                ValidateLifetime = true,
                // This defines the maximum allowable clock skew - i.e. provides a tolerance on the token expiry time
                // when validating the lifetime. As we're creating the tokens locally and validating them on the same
                // machines which should have synchronised time, this can be set to zero. Where external tokens are
                // used, some leeway here could be useful.
                ClockSkew = TimeSpan.FromMinutes(0)
            };

            services.AddAuthentication()
                .AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = tokenValidationParameters;
                });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            app.UseResponseBuffering();

            if (env.IsDevelopment())
            {
                app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
                {
                    HotModuleReplacement = true
                });
            }

            var jsonSerializerSettings = new JsonSerializerSettings
            {
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                ReferenceLoopHandling = ReferenceLoopHandling.Ignore
            };

            app.UseExceptionHandler().WithConventions(x =>
            {
                x.ContentType = "application/json";

                if (env.IsDevelopment())
                {
                    x.MessageFormatter(s => JsonConvert.SerializeObject(new RequestResult()
                    {
                        Message = s.Message,
                        StackTrace = s.StackTrace
                    }, jsonSerializerSettings));
                }
                else
                {
                    x.MessageFormatter(s => JsonConvert.SerializeObject(new RequestResult()
                    {
                        Message = "An error occurred whilst processing your request",
                    }, jsonSerializerSettings));
                }

                x.ForException<NotFoundException>().ReturnStatusCode(StatusCodes.Status404NotFound)
                   .UsingMessageFormatter((ex, context) =>
                       JsonConvert.SerializeObject(new RequestResult()
                       {
                           Message = ex.Message
                       }, jsonSerializerSettings)
                   );

                x.ForException<UnauthorizedException>().ReturnStatusCode(StatusCodes.Status403Forbidden)
                   .UsingMessageFormatter((ex, context) =>
                       JsonConvert.SerializeObject(new RequestResult()
                       {
                           Message = ex.Message
                       }, jsonSerializerSettings)
                   );

                x.ForException<BadRequestException>().ReturnStatusCode(StatusCodes.Status400BadRequest)
                   .UsingMessageFormatter((ex, context) =>
                   {
                       var exception = (BadRequestException)ex;
                       return JsonConvert.SerializeObject(new RequestResult()
                       {
                           Message = exception.Message,
                           Data = exception.Errors
                       }, jsonSerializerSettings);
                   });

                x.ForException<ValidationException>().ReturnStatusCode(StatusCodes.Status400BadRequest)
                    .UsingMessageFormatter((ex, context) =>
                    {
                        var exception = (ValidationException)ex;
                        return JsonConvert.SerializeObject(new RequestResult()
                        {
                            Message = exception.Message,
                            Data = exception.Errors
                        }, jsonSerializerSettings);
                    });
            });

            app.UseStaticFiles();

            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });

            app.UseAuthentication();

            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");

                routes.MapSpaFallbackRoute(
                    name: "spa-fallback",
                    defaults: new { controller = "Home", action = "Index" });
            });
        }
    }
}