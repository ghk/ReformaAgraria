using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using ReformaAgraria.Helpers;
using ReformaAgraria.Models;
using Serilog;
using System;
using System.IO;

namespace ReformaAgraria
{
    public class Program
    {
        public static void Main(string[] args)
        {
            Log.Logger = LogConfigurationHelper.GetConfiguration();

            try
            {
                var host = BuildWebHost(args);
                var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
                var isDevelopment = environment == EnvironmentName.Development;
                if (isDevelopment)
                {
                    using (var scope = host.Services.CreateScope())
                    {
                        var services = scope.ServiceProvider;
                        DbInitializer.InitializeAsync(services).Wait();
                    }
                }
                host.Run();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly");
            }
            finally
            {
                Log.CloseAndFlush();
            }
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseKestrel()
                .UseContentRoot(Directory.GetCurrentDirectory())
                .UseIISIntegration()
                .UseStartup<Startup>()
                .UseSerilog()
                .Build();
    }
}