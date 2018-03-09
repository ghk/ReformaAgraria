using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MicrovacWebCore;
using OfficeOpenXml;
using ReformaAgraria.Models;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(Policy = "Bearer")]
    public class SchemeController : CrudControllerAsync<Scheme, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ILogger<SchemeController> _logger;

        public SchemeController(ReformaAgrariaDbContext dbContext,
            IHostingEnvironment hostingEnvironment,
            ILogger<SchemeController> logger) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _logger = logger;
        }
    }
}