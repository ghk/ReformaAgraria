using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MicrovacWebCore;
using ReformaAgraria.Helpers;
using ReformaAgraria.Models;
using ReformaAgraria.Models.ViewModels;
using System.IO;
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

        public BaseLayerController(ReformaAgrariaDbContext dbContext,
            IHostingEnvironment hostingEnvironment,
            ILogger<BaseLayerController> logger) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _logger = logger;
        }        

        [HttpPost("upload")]
        public async Task<BaseLayer> Upload([FromForm]UploadBaseLayerViewModel model)
        {
            BaseLayer baseLayer = null;

            if (model.Id > 0)
                baseLayer = dbContext.Set<BaseLayer>().Where(o => o.Id == model.Id).FirstOrDefault();

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
            baseLayer.Geojson = GetGeoJson(model.File);

            await dbContext.SaveChangesAsync();

            var baseLayerDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "baseLayer");
            var destinationFilePath = Path.Combine(baseLayerDirectoryPath, baseLayer.Id + ".zip");
            IOHelper.StreamCopy(destinationFilePath, model.File);

            return baseLayer;
        }

        [HttpDelete("{id}")]
        public override async Task<int> DeleteAsync(int id)
        {
            await base.DeleteAsync(id);

            var baseLayerDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "baseLayer");
            var destinationFilePath = Path.Combine(baseLayerDirectoryPath, id + ".zip");
            if (System.IO.File.Exists(destinationFilePath))
                System.IO.File.Delete(destinationFilePath);

            return id;
        }

        protected override IQueryable<BaseLayer> ApplyQuery(IQueryable<BaseLayer> query)
        {
            return query;
        }

        private string GetGeoJson(IFormFile file)
        {
            //var tempDirectoryPath = IOHelper.ExtractTempZip(file);
            //var shapeFilePath = Directory.GetFiles(tempDirectoryPath).FirstOrDefault(fileName => fileName.Contains("shp"));
            //var features = TopologyHelper.GetFeatureCollectionWgs84(shapefilePath);
            //var geojson = TopologyHelper.GetGeojson(features);
            //Directory.Delete(tempDirectoryPath, true);

            var features = TopologyHelper.GetFeatureCollectionWgs84(file);
            var geojson = TopologyHelper.GetGeojson(features);
            return geojson;
        }
    }
}