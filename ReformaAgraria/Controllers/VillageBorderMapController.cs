using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MicrovacWebCore;
using MicrovacWebCore.Exceptions;
using MicrovacWebCore.Helpers;
using OfficeOpenXml;
using ReformaAgraria.Helpers;
using ReformaAgraria.Models;
using ReformaAgraria.Models.Validators;
using ReformaAgraria.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(Policy = "Bearer")]
    public class VillageBorderMapController : CrudControllerAsync<VillageBorderMap, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ReformaAgrariaDbContext _context;

        public VillageBorderMapController(ReformaAgrariaDbContext dbContext,
            IHostingEnvironment hostingEnvironment) : base(dbContext)
        {
            _context = dbContext;
            _hostingEnvironment = hostingEnvironment;
        }

        [HttpPost]
        [NotGenerated]
        public override async Task<int> PostAsync([FromBody] VillageBorderMap model)
        {
            //var validator = new ToraObjectValidator();
            //validator.ValidateAndThrow(model);
            return await base.PostAsync(model);
        }

        [HttpPost("upload")]
        public async Task<VillageBorderMap> Upload([FromForm]UploadVillageBorderMapViewModel model)
        {
            var region = await dbContext.Set<Region>().FirstOrDefaultAsync(r => r.Id == model.RegionId);
            if (region == null)
                throw new NotFoundException();

            var villageBorderMap = await dbContext.Set<VillageBorderMap>().FirstOrDefaultAsync(vbm => vbm.FkRegionId == model.RegionId);

            if (villageBorderMap == null)
            {
                villageBorderMap = new VillageBorderMap { FkRegionId = model.RegionId };
                dbContext.Entry(villageBorderMap).State = EntityState.Added;
            }
            else
            {
                dbContext.Entry(villageBorderMap).State = EntityState.Modified;
            }

            villageBorderMap.Name = region.Name;

            var features = TopologyHelper.GetFeatureCollectionWgs84(model.File);
            villageBorderMap.Geojson = TopologyHelper.GetGeojson(features);
            villageBorderMap.Size = TopologyHelper.GetArea(features);

            await dbContext.SaveChangesAsync();

            // Copy map file to disk
            var villageBorderMapDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "villagebordermap");
            var regionDirectoryPath = Path.Combine(villageBorderMapDirectoryPath, region.Id);
            var destinationFilePath = Path.Combine(regionDirectoryPath, villageBorderMap.Id + ".zip");
            await IOHelper.StreamCopyAsync(destinationFilePath, model.File);

            return villageBorderMap;
        }

        [HttpGet("download/{id}")]
        public async Task<FileStreamResult> Download(int id)
        {
            var villageBorderMap = await dbContext.Set<VillageBorderMap>().FirstOrDefaultAsync(vbm => vbm.Id == id);
            if (villageBorderMap == null)
                throw new NotFoundException();
            return await Download(villageBorderMap);
        }

        private async Task<FileStreamResult> Download(VillageBorderMap villageBorderMap)
        {
            var villageBorderMapDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "villagebordermap");
            var villageBorderMapPath = Path.Combine(villageBorderMapDirectoryPath, villageBorderMap.FkRegionId, villageBorderMap.Id + ".zip");
            var memory = new MemoryStream();
            using (var stream = new FileStream(villageBorderMapPath, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, "application/zip", Path.GetFileName(villageBorderMapPath));
        }

        protected override IQueryable<VillageBorderMap> ApplyQuery(IQueryable<VillageBorderMap> query)
        {
            var type = GetQueryString<string>("type");

            if (type == "getAllByRegion")
            {
                var regionId = GetQueryString<string>("regionId");
                if (!string.IsNullOrWhiteSpace(regionId))
                    query = query.Where(to => to.FkRegionId == regionId);
            }

            return query;
        }
    }
}