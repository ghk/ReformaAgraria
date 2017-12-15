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
using GeoJSON.Net;
using System.Dynamic;
using Newtonsoft.Json.Linq;
using GeoJSON.Net.Geometry;
using GeoJSON.Net.Converters;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class BaseLayerController : CrudController<BaseLayer, int>
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
                    var webRootPath = _hostingEnvironment.WebRootPath;
                    var destinationFile = Path.Combine(webRootPath "base_layer", (content.Id.ToString() + '_' + ".zip"));
                    StreamCopy(destinationFile, file);
                }
            }

            dbContext.Update(content);
            await dbContext.SaveChangesAsync();
            return content;
        }

        public string GetGeoJson(IFormFile file)
        {
            string result = null;
            var tempFolderName = "reforma_agraria_" + DateTime.Now.ToString("yyyyMMddHHmmssffff") + "_" + Guid.NewGuid().ToString("N");
            var tempPath = Path.Combine(Path.GetTempPath(), tempFolderName);
            var zipPath = Path.Combine(tempPath, file.FileName);

            ValidateAndCreateFolder(tempPath);
            StreamCopy(zipPath, file);
            ZipFile.ExtractToDirectory(zipPath, tempPath);

            Ogr.RegisterAll();
            Driver driver = Ogr.GetDriverByName("ESRI Shapefile");
            using (var dataSource = driver.Open(tempPath, 0))
            {
                Layer layer = dataSource.GetLayerByIndex(0);
                layer.ResetReading();

                var features = new List<GeoJSON.Net.Feature.Feature>();
                Feature f;
                while ((f = layer.GetNextFeature()) != null)
                {
                    var geometryRef = f.GetGeometryRef();
                    if (geometryRef == null)
                        continue;

                    var properties = new Dictionary<string, object>();

                    for (var i = 0; i <= f.GetFieldCount() - 1; i++)
                    {
                        FieldType type = f.GetFieldType(i);
                        var propName = f.GetFieldDefnRef(i).GetName();

                        switch (type)
                        {
                            case FieldType.OFTString:
                                properties.Add(propName, f.GetFieldAsString(i));
                                break;
                            case FieldType.OFTReal:
                                properties.Add(propName, f.GetFieldAsDouble(i));
                                break;
                            case FieldType.OFTInteger64:
                                properties.Add(propName, f.GetFieldAsInteger64(i));
                                break;
                        }
                    }

                    var json = geometryRef.ExportToJson(null);
                    var geometry = JsonConvert.DeserializeObject<IGeometryObject>(json, new GeometryConverter());
                    features.Add(new GeoJSON.Net.Feature.Feature(geometry, properties));
                }

                result = new GeoJSON.Net.Feature.FeatureCollection(features);
            }
                
            Directory.Delete(tempPath, true);
            return JsonConvert.SerializeObject(result);
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

    }
}
          
            
