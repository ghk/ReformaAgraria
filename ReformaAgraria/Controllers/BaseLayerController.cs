using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MicrovacWebCore;
using MicrovacWebCore.Helpers;
using ReformaAgraria.Helpers;
using ReformaAgraria.Models;
using ReformaAgraria.Models.ViewModels;
using System.Collections.Generic;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(Policy = "Bearer")]
    public class BaseLayerController : CrudControllerAsync<BaseLayer, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ILogger<BaseLayerController> _logger;

        public BaseLayerController(
            ReformaAgrariaDbContext dbContext,
            IHostingEnvironment hostingEnvironment,
            ILogger<BaseLayerController> logger) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _logger = logger;
        }

        [NotGenerated]
        [MiddlewareFilter(typeof(CompressPipeline))]
        public override Task<IList<BaseLayer>> GetAllAsync()
        {
            return base.GetAllAsync();
        }

        [HttpPost("upload")]
        public async Task<BaseLayer> Upload([FromForm]UploadBaseLayerViewModel model)
        {
            BaseLayer baseLayer = null;

            if (model.Id > 0)
                baseLayer = await dbContext.Set<BaseLayer>().FirstOrDefaultAsync(o => o.Id == model.Id);

            if (baseLayer == null)
            {
                baseLayer = new BaseLayer();
                dbContext.Entry(baseLayer).State = EntityState.Added;
            }
            else
            {
                dbContext.Entry(baseLayer).State = EntityState.Modified;
            }

            baseLayer.Label = model.Label;
            baseLayer.Color = model.Color;

            if (baseLayer.Id <= 0 || model.File != null)
            {
                var features = TopologyHelper.GetFeatureCollectionWgs84(model.File);
                baseLayer.Geojson = TopologyHelper.GetGeojson(features);
                await dbContext.SaveChangesAsync();

                var baseLayerDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "baseLayer");
                var destinationFilePath = Path.Combine(baseLayerDirectoryPath, baseLayer.Id + ".zip");
                await IOHelper.StreamCopyAsync(destinationFilePath, model.File);
            }
            else
            {
                await dbContext.SaveChangesAsync();
            }

            return baseLayer;
        }

        [HttpDelete("{id}")]
        public override async Task<int> DeleteAsync(int id)
        {
            var baseLayerDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "baseLayer");
            var destinationFilePath = Path.Combine(baseLayerDirectoryPath, id + ".zip");
            if (System.IO.File.Exists(destinationFilePath))
                System.IO.File.Delete(destinationFilePath);

            return await base.DeleteAsync(id);
        }

        protected override IQueryable<BaseLayer> ApplyQuery(IQueryable<BaseLayer> query)
        {
            return query;
        }
    }
}