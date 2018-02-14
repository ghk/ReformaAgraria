using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MicrovacWebCore;
using MicrovacWebCore.Exceptions;
using ReformaAgraria.Helpers;
using ReformaAgraria.Models;
using ReformaAgraria.Models.ViewModels;
using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(Policy = "Bearer")]
    public class ToraMapController : CrudControllerAsync<ToraMap, int>
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
            var toraObject = await dbContext.Set<ToraObject>().FirstOrDefaultAsync(to => to.Id == model.ToraObjectId);
            if (toraObject == null)
                throw new NotFoundException();

            var toraMap = await dbContext.Set<ToraMap>().FirstOrDefaultAsync(tm => tm.FkToraObjectId == toraObject.Id);

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

            // Copy map file to disk
            var toraMapDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "tora", "map");
            var regionDirectoryPath = Path.Combine(toraMapDirectoryPath, model.RegionId);
            var destinationFilePath = Path.Combine(regionDirectoryPath, toraMap.Id + ".zip");
            await IOHelper.StreamCopyAsync(destinationFilePath, model.File);

            return toraMap;
        }

        [HttpGet("download/{id}")]
        public async Task<FileStreamResult> Download(int id)
        {
            var toraMap = await dbContext.Set<ToraMap>().FirstOrDefaultAsync(tm => tm.Id == id);
            if (toraMap == null)
                throw new NotFoundException();
            return await Download(toraMap);
        }

        [HttpGet("download/toraobject/{toraObjectId}")]
        public async Task<FileStreamResult> DownloadByToraObject(int toraObjectId)
        {
            var toraMap = await dbContext.Set<ToraMap>().FirstOrDefaultAsync(tm => tm.FkToraObjectId == toraObjectId);
            if (toraMap == null)
                throw new NotFoundException();
            return await Download(toraMap);
        }

        [HttpGet("download/region/{regionId}")]
        public async Task<FileStreamResult> DownloadByRegion(string regionId)
        {
            var toraMap = await dbContext.Set<ToraMap>().FirstOrDefaultAsync(tm => tm.FkRegionId == regionId);
            if (toraMap == null)
                throw new NotFoundException();
            return await Download(toraMap);
        }

        private async Task<FileStreamResult> Download(ToraMap toraMap)
        {
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