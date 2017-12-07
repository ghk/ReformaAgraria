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

namespace ReformaAgraria.Controllers
{
    [Route("api/[controller]")]
    public class MapController : CrudController<ToraObject, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _contextAccessor;

        public MapController(ReformaAgrariaDbContext dbContext, IHostingEnvironment hostingEnvironment, IHttpContextAccessor contextAccessor) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _contextAccessor = contextAccessor;
        }

        [HttpPost("import")]
        public void Import()
        {
            var results = HttpContext.Request.ReadFormAsync().Result;
            var label = results["label"];
            var color = results["color"];
            var file = results.Files[0];

            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "base_layer");
            var tempPath = Path.Combine(Path.GetTempPath(), "reforma_agraria" + DateTime.Now.ToString("yyyyMMddHHmmssffff"));

            ValidateAndCreateFolder(folderPath);
            ValidateAndCreateFolder(Path.Combine(Path.GetTempPath(), tempPath));

            var zipPath = Path.Combine(folderPath, file.FileName);
            StreamCopy(zipPath, file);

            ZipFile.ExtractToDirectory(zipPath, tempPath);
            string[] shapeFiles = Directory.GetFiles(tempPath, "*.shp");

            if (shapeFiles.Length == 0)
            {
                return;
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

            DeleteDirectory(tempPath);
        }

        public void StreamCopy(string filePath,IFormFile file)
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

            for(var i=0; i < data.Count; i++)
            {
                geoJson.features[i] = JsonConvert.DeserializeObject(data[i]);
            }
            
            return geoJson;
        }

        public static void DeleteFileOrDirectory(string path)
        {
            try
            {
                Directory.Delete(path, true);
            }
            catch (IOException)
            {
                Directory.Delete(path, true);
            }
            catch (UnauthorizedAccessException)
            {
                Directory.Delete(path, true);
            }
        }

        private static void DeleteDirectory(string directory)
        {
            throw new NotImplementedException();
        }
    }
}
