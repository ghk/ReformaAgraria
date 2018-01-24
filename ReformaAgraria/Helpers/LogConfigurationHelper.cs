using ReformaAgraria.Controllers;
using Serilog;
using Serilog.Core;
using Serilog.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Helpers
{
    public static class LogConfigurationHelper
    {
        public static Logger GetConfiguration()
        {
            var logger = new LoggerConfiguration();
            logger = GetConsoleConfiguration(logger);
            logger = GetRollingFileConfiguration(logger);
            logger = GetClassLoggerConfiguration<AccountController>(logger);
            return logger.CreateLogger();
        }

        public static LoggerConfiguration GetConsoleConfiguration(LoggerConfiguration logger)
        {
            return logger.WriteTo.Console();
        }

        public static LoggerConfiguration GetRollingFileConfiguration(LoggerConfiguration logger)
        {
            return logger
                .WriteTo.Logger(l => l
                    .MinimumLevel.Warning()                    
                    .WriteTo.RollingFile("./Logs/Warning-{Date}.txt"))
                .WriteTo.Logger(l => l
                    .MinimumLevel.Error()
                    .WriteTo.RollingFile("./Logs/Error-{Date}.txt"));
        }

        public static LoggerConfiguration GetClassLoggerConfiguration<T>(LoggerConfiguration logger)
        {
            return logger
                .WriteTo.Logger(l => l
                    .Filter.ByIncludingOnly(Matching.FromSource<T>())
                    .WriteTo.RollingFile("./Logs/" +  typeof(T).Name + "-{Date}.txt")
                );
        }
    }
}
