using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MicrovacWebCore;
using OfficeOpenXml;
using ReformaAgraria.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using System.Net.Http;
using System.Threading.Tasks;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(Policy = "Bearer")]
    public class PersilController : CrudControllerAsync<Persil, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ILogger<PersilController> _logger;

        public PersilController(ReformaAgrariaDbContext dbContext,
            IHostingEnvironment hostingEnvironment,
            ILogger<PersilController> logger) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _logger = logger;
        }


        protected override IQueryable<Persil> ApplyQuery(IQueryable<Persil> query)
        {
            var type = GetQueryString<string>("type");

            if (type == "getAllByRegion")
            {
                var regionId = GetQueryString<string>("regionId");
                query = query.Include(s => s.Scheme).Where(p => p.FkRegionId == regionId);
            }

            return query;
        }
    }
}