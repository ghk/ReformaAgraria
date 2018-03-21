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
using ReformaAgraria.Models.ViewModels;
using MicrovacWebCore.Exceptions;
using System;
using ReformaAgraria.Helpers;
using System.IO;

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

        [HttpPost("upload")]
        public async Task<Persil> Upload([FromForm]EditPersilViewModel model)
        {
            var persil = await dbContext.Set<Persil>().FirstOrDefaultAsync(p => p.Id == model.PersilId);
            if (persil == null)
                throw new NotFoundException();

            dbContext.Entry(persil).State = EntityState.Modified;

            persil.Status = model.PersilStatus;
            persil.TotalSize = model.PersilTotalSize;
            persil.TotalSubject = model.PersilTotalSubject;
            persil.DateModified = DateTime.Now;

            if (model.File != null)
            {
                var features = TopologyHelper.GetFeatureCollectionWgs84(model.File);
                persil.Geojson = TopologyHelper.GetGeojson(features);

                // Copy map file to disk
                var persilDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "persil");
                var regionDirectoryPath = Path.Combine(persilDirectoryPath, persil.FkRegionId);
                var destinationFilePath = Path.Combine(regionDirectoryPath, persil.Id + ".zip");
                await IOHelper.StreamCopyAsync(destinationFilePath, model.File);
            }
            
            await dbContext.SaveChangesAsync();

            return persil;
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