using FluentValidation;
using GlobalExceptionHandler.WebApi;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using MicrovacWebCore.Exceptions;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ReformaAgraria.Helpers
{
    public static class ExceptionHelper
    {
        public static void UseGlobalException(this IApplicationBuilder app, IHostingEnvironment env)
        {
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
        }
    }
}