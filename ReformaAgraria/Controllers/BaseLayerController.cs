using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using MicrovacWebCore;
using ReformaAgraria.Models;
using Microsoft.AspNetCore.Http;
using System.IO.Compression;
using System;
using OSGeo.OGR;
using System.Collections.Generic;
using Newtonsoft.Json;
using ReformaAgraria.Models.ViewModels;
using ReformaAgraria.Security;
using System.Linq;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class BaseLayerController : CrudController<BaseLayer, int>
    {
        private readonly ILogger<BaseLayerController> _logger;

        public BaseLayerController(ReformaAgrariaDbContext dbContext,
            ILogger<BaseLayerController> logger) : base(dbContext)
        {
            _logger = logger;
        }

        protected override IQueryable<BaseLayer> ApplyQuery(IQueryable<BaseLayer> query)
        {
            return query;
        }

        [HttpPost("import")]
        public async Task<BaseLayer> ImportAsync()
        {
            var results = HttpContext.Request.ReadFormAsync().Result;
            var label = results["label"];
            var color = results["color"];
            var file = results.Files[0];
            var geoJsonModel = GetGeoJson(file);

            if (geoJsonModel == null)
            {
                return null;
            }

            var baseLayerContent = new BaseLayer
            {
                Label = label,
                Color = color,
                Geojson = geoJsonModel,
            };

            dbContext.Add(baseLayerContent);
            await dbContext.SaveChangesAsync();

            var destinationFile = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "base_layer", (baseLayerContent.Id.ToString() + '_' +".zip"));
            StreamCopy(destinationFile, file);

            return baseLayerContent;
        }

        public string GetGeoJson(IFormFile file)
        {
            var tempFolderName = "reforma_agraria_" + DateTime.Now.ToString("yyyyMMddHHmmssffff");
            var tempPath = Path.Combine(Path.GetTempPath(), tempFolderName);
            var zipPath = Path.Combine(tempPath, file.FileName);

            ValidateAndCreateFolder(tempPath);
            StreamCopy(zipPath, file);

            ZipFile.ExtractToDirectory(zipPath, tempPath);
            string[] shapeFiles = Directory.GetFiles(tempPath, "*.shp");

            if (shapeFiles.Length == 0)
            {
                //DeleteDirectory(tempPath);
                return null;
            }

            string fileName = Path.Combine(tempPath, shapeFiles[0]);

            Ogr.RegisterAll();
            Driver drv = Ogr.GetDriverByName("ESRI Shapefile");

            var ds = drv.Open(fileName, 0);

            Layer layer = ds.GetLayerByIndex(0);
            Feature f;
            layer.ResetReading();

            var geoJsons = new List<string>();

            while ((f = layer.GetNextFeature()) != null)
            {
                var geom = f.GetGeometryRef();
                if (geom != null)
                {
                    var geometryJson = geom.ExportToJson(null);
                    geoJsons.Add(geometryJson);
                }
            }

            GeoJsonViewModel featureCollections = CreateFeatureCollection(geoJsons);
            string geoJsonModel = JsonConvert.SerializeObject(featureCollections);

            //Directory.Delete(tempPath, true);
            return geoJsonModel;
        }

        public void StreamCopy(string filePath, IFormFile file)
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
        }

        public string ValidateAndCreateFolder(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            return path;
        }

        public GeoJsonViewModel CreateFeatureCollection(List<string> data)
        {
            GeoJsonViewModel geoJson = JsonConvert.DeserializeObject<GeoJsonViewModel>("{'type': 'FeatureCollections', 'features': [] }");
            geoJson.features = new object[data.Count];

            for (var i = 0; i < data.Count; i++)
            {
                geoJson.features[i] = JsonConvert.DeserializeObject(data[i]);
            }

            return geoJson;
        }

       private void DeleteDirectory(string directory)
        {
            DirectoryInfo di = new DirectoryInfo(directory);

            foreach (FileInfo file in di.GetFiles())
            {
                file.Delete();
            }
            foreach (DirectoryInfo dir in di.GetDirectories())
            {
                dir.Delete(true);
            }
        }
    }
}
          
            
