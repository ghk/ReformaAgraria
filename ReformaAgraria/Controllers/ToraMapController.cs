using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using OfficeOpenXml;
using MicrovacWebCore;
using ReformaAgraria.Models;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO.Compression;
using Newtonsoft.Json;
using GeoJSON.Net.Geometry;
using GeoJSON.Net.Converters;
using ProjNet.CoordinateSystems.Transformations;
using ProjNet.CoordinateSystems;
using System.Net;
using ReformaAgraria.Security;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using NetTopologySuite.Features;
using System.Collections;
using GeoAPI.Geometries;
using ReformaAgraria.Helpers;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class ToraMapController : CrudController<ToraMap, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _contextAccessor;

        public ToraMapController(
            ReformaAgrariaDbContext dbContext, 
            IHostingEnvironment hostingEnvironment, 
            IHttpContextAccessor contextAccessor
        ) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _contextAccessor = contextAccessor;
        }

        [HttpPost("import")]
        public async Task<ToraMap> Import()
        {
            var results = await HttpContext.Request.ReadFormAsync();
            var toraObjectId = int.Parse(results["toraObjectId"]);
            var toraMap = dbContext.Set<ToraMap>().Where(tm => tm.FkToraObjectId == toraObjectId).FirstOrDefault();

            if (toraMap == null)
            {
                toraMap = new ToraMap { FkToraObjectId = toraObjectId };
                dbContext.Entry(toraMap).State = EntityState.Added;
            }
            else
            {
                dbContext.Entry(toraMap).State = EntityState.Modified;
            }

            toraMap.FkRegionId = results["regionId"];
            toraMap.Name = results["toraObjectName"];

            var file = results.Files[0];
            var features = TopologyHelper.GetFeatureCollectionWgs84(file);
            toraMap.Geojson = TopologyHelper.GetGeojson(features);
            toraMap.Size = TopologyHelper.GetArea(features);

            await dbContext.SaveChangesAsync();

            var rootDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "tora");
            var regionDirectoryPath = Path.Combine(rootDirectoryPath, results["regionId"].ToString().ToUpper());
            var destinationFilePath = Path.Combine(regionDirectoryPath, (toraMap.Id.ToString() + ".zip"));
            IOHelper.StreamCopy(destinationFilePath, file);           

            return toraMap;
        }       

        [HttpGet("download/{id}")]
        public async Task<IActionResult> Download(int id)
        {
            var toraMap = await dbContext.Set<ToraMap>()
                .Where(tm => tm.Id == id)
                .FirstOrDefaultAsync();

            if (toraMap == null)
                return NotFound(new RequestResult
                {
                    State = RequestState.Failed,
                    Message = "TORA map not found"
                });

            var toraPath = Path.Combine(_hostingEnvironment.WebRootPath, "tora");
            var filePath = Path.Combine(toraPath, toraMap.FkRegionId, toraMap.Id + ".zip");
            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, "application/zip", Path.GetFileName(filePath));
        }

        protected override IQueryable<ToraMap> ApplyQuery(IQueryable<ToraMap> query)
        {
            var type = GetQueryString<string>("type");

            if (type == "getAllByRegion")
            {
                var regionId = GetQueryString<string>("regionId");                    
                if (!string.IsNullOrWhiteSpace(regionId))
                    query = query.Where(r => r.FkRegionId.Contains(regionId));
            }

            if (type == "getAllByRegionComplete")
            {
                var regionId = GetQueryString<string>("regionId");
                if (!string.IsNullOrWhiteSpace(regionId))
                {
                    query = query.Include("Region.Parent.Parent");
                    query = query.Include(t => t.ToraObject);
                    query = query.Where(r => r.FkRegionId.Contains(regionId));
                }
            }

            return query;
        }       
    }
}
