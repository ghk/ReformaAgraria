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
using GeoJSON.Net.Geometry;

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
            var baseLayerContent = new BaseLayer
            {
                Label = results["label"],
                Color = results["color"],
            };
            var file = results.Files[0];
            var geoJsonModel = GetGeoJson(file);

            if (geoJsonModel == null)
            {
                return null;
            }

            baseLayerContent.Geojson = geoJsonModel;
            dbContext.Add(baseLayerContent);
            await dbContext.SaveChangesAsync();

            var destinationFile = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "base_layer", (baseLayerContent.Id.ToString() + '_' +".zip"));
            StreamCopy(destinationFile, file);

            return baseLayerContent;
        }

        [HttpPost("edit")]
        public async Task<BaseLayer> EditAsync()
        {
            var results = HttpContext.Request.ReadFormAsync().Result;
            int id = Int32.Parse(results["id"]);
            var content = dbContext.Set<BaseLayer>().Where(o => o.Id == id).FirstOrDefault();
            content.Label = results["label"];
            content.Color = results["color"];

            IFormFile file = null;
            string geoJsonModel = "";
            if(results.Files.Count != 0)
            {
                file = results.Files[0];
                geoJsonModel = GetGeoJson(file);
                if (geoJsonModel != null)
                {
                    content.Geojson = geoJsonModel;
                    var destinationFile = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "base_layer", (content.Id.ToString() + '_' + ".zip"));
                    StreamCopy(destinationFile, file);
                }
            }

            dbContext.Update(content);
            await dbContext.SaveChangesAsync();
            return content;
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
            
            
            //foreach(var an in shape.Features)
            //{
            //    var prop = an.Properties;
            //}
            //var anu = shape.FeaturesAsJson();

             var ds = drv.Open(tempPath, 0);

            Layer layer = ds.GetLayerByIndex(0);
            Feature f;
            layer.ResetReading();            
            var geoJsons = new List<string>();     

            while ((f = layer.GetNextFeature()) != null)
            {               
                for (var i = 0; i <= f.GetFieldCount() - 1; i++) {
                    var anu = f.GetFieldDefnRef(i);
                    var anu3 = f.GetFieldType(i);
                    var anu4 = f.GetFieldDefnRef(i).GetName();
                    var anu2 = f.GetFieldAsString(i);
                }
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
            GeoJsonViewModel geoJson = JsonConvert.DeserializeObject<GeoJsonViewModel>("{'type': 'FeatureCollection', 'features': [] }");
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
          
            
