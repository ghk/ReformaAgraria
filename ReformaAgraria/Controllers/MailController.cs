using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace ReformaAgraria.Controllers
{
    public class MailController
    {
        private readonly IConfiguration _iconfiguration;
        private readonly ILogger<MailController> _logger;

        public MailController(IConfiguration iconfiguration, ILogger<MailController> logger) {
            _iconfiguration = iconfiguration;
            _logger = logger;
        }

        public void SendEmail(string subject, string body, MailAddress toAddress)
        {
            var from = _iconfiguration.GetSection("Email").GetSection("EmailAddress").Value;
            var fromPassword = _iconfiguration.GetSection("Email").GetSection("Password").Value;
            var displayName = _iconfiguration.GetSection("Email").GetSection("DisplayName").Value;
            var fromAddress = new MailAddress(from, displayName);

            var smtp = new SmtpClient
            {
                Host = "smtp.gmail.com",
                Port = 587,
                EnableSsl = true,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = false,
                Credentials = new NetworkCredential(fromAddress.Address, fromPassword)
            };
            using (var message = new MailMessage(fromAddress, toAddress)
            {
                IsBodyHtml = true,
                Subject = subject,
                Body = body
            })
            {
                smtp.Send(message);
            }
        }
    }

}
