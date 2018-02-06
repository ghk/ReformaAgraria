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
using ReformaAgraria.Models.ViewModels;
using Microsoft.Extensions.Logging;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class ToraMapController : CrudController<ToraMap, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ILogger<ToraMapController> _logger;

        public ToraMapController(
            ReformaAgrariaDbContext dbContext, 
            IHostingEnvironment hostingEnvironment, 
            IHttpContextAccessor contextAccessor,
            ILogger<ToraMapController> logger
        ) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _contextAccessor = contextAccessor;
            _logger = logger;
        }

        [HttpPost("upload")]
        public async Task<ToraMap> Upload([FromForm]UploadToraMapViewModel model)
        {                       
            var toraMap = dbContext.Set<ToraMap>()
                .Where(tm => tm.FkToraObjectId == model.ToraObjectId)
                .FirstOrDefault();

            if (toraMap == null)
            {
                toraMap = new ToraMap { FkToraObjectId = model.ToraObjectId };
                dbContext.Entry(toraMap).State = EntityState.Added;
            }
            else
            {
                dbContext.Entry(toraMap).State = EntityState.Modified;
            }

            toraMap.FkRegionId = model.RegionId;
            toraMap.Name = model.ToraObjectName;

            var features = TopologyHelper.GetFeatureCollectionWgs84(model.File);
            toraMap.Geojson = TopologyHelper.GetGeojson(features);
            toraMap.Size = TopologyHelper.GetArea(features);

            await dbContext.SaveChangesAsync();

            var toraMapDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "tora", "map");
            var regionDirectoryPath = Path.Combine(toraMapDirectoryPath, model.RegionId);
            var destinationFilePath = Path.Combine(regionDirectoryPath, toraMap.Id + ".zip");
            IOHelper.StreamCopy(destinationFilePath, model.File);           

            return toraMap;
        }       

        [HttpGet("download/{id}/{by}")]
        public async Task<FileStreamResult> Download(string id, string by)
        {
            var toraMap = new ToraMap(); ;
            if (by.ToLower() == "regionid")
            {
                toraMap = await dbContext.Set<ToraMap>()
                .Where(tm => tm.FkRegionId == id)
                .FirstOrDefaultAsync();
            }
            else
            {
                toraMap = await dbContext.Set<ToraMap>()
                .Where(tm => tm.Id == Convert.ToInt32(id))
                .FirstOrDefaultAsync();
            }
                        
            var toraMapDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "tora", "map");
            var toraMapPath = Path.Combine(toraMapDirectoryPath, toraMap.FkRegionId, toraMap.Id + ".zip");
            var memory = new MemoryStream();
            using (var stream = new FileStream(toraMapPath, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, "application/zip", Path.GetFileName(toraMapPath));
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
                    query = query.Include(t => t.ToraObject.ToraSubjects);
                    query = query.Where(r => r.FkRegionId.Contains(regionId));
                }
            }

            return query;
        }       
    }
}
