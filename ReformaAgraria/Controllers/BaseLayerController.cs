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
using ProjNet.CoordinateSystems.Transformations;
using ProjNet.CoordinateSystems;
using Microsoft.EntityFrameworkCore;

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
            var content = new BaseLayer
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

            content.Geojson = geoJsonModel;
            dbContext.Add(content);
            await dbContext.SaveChangesAsync();

            var webRootPath = Path.Combine(_hostingEnvironment.WebRootPath, "baseLayer");
            ValidateAndCreateFolder(webRootPath);

            var destinationFile = Path.Combine(webRootPath , (content.Id.ToString() + ".zip"));
            StreamCopy(destinationFile, file);

            return content;
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
                    var destinationFile = Path.Combine(webRootPath, "baseLayer", (content.Id.ToString() + ".zip"));
                    StreamCopy(destinationFile, file);
                }
            }

            dbContext.Update(content);
            await dbContext.SaveChangesAsync();
            return content;
        }

        [HttpDelete("{id}")]
        public override void Delete(int id)
        {
            base.Delete(id);
            var webRootPath = _hostingEnvironment.WebRootPath;
            var targetFile = Path.Combine(webRootPath, "baseLayer", (id.ToString() + ".zip"));

            if (System.IO.File.Exists(targetFile)) { 
                System.IO.File.Delete(targetFile);
            }
        }

        public string GetGeoJson(IFormFile file)
        {
            GeoJSON.Net.Feature.FeatureCollection result = null;
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

                var sourceSpatialRef = layer.GetSpatialRef();
                sourceSpatialRef.ExportToWkt(out string sourceWkt);

                CoordinateTransformationFactory ctfac = new CoordinateTransformationFactory();
                CoordinateSystemFactory cfac = new CoordinateSystemFactory();                
                GeographicCoordinateSystem wgs84 = GeographicCoordinateSystem.WGS84;
                var transformer = ctfac.CreateFromCoordinateSystems(cfac.CreateFromWkt(sourceWkt), wgs84);
                
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

                    TransformGeometry(geometryRef, transformer);

                    var json = geometryRef.ExportToJson(null);
                    var geometry = JsonConvert.DeserializeObject<IGeometryObject>(json, new GeometryConverter());                
                    var feature = new GeoJSON.Net.Feature.Feature(geometry, properties);                    
                    features.Add(feature);
                    
                }

                result = new GeoJSON.Net.Feature.FeatureCollection(features);
            }
                
            Directory.Delete(tempPath, true);
            return JsonConvert.SerializeObject(result);
        }
       
        private void TransformGeometry(Geometry geometry, ICoordinateTransformation transformer)
        {
            if (geometry.GetGeometryCount() == 0)
            {
                for (var i = 0; i <= geometry.GetPointCount() - 1; i++)
                {
                    var outPoint = new double[3];
                    geometry.GetPoint(i, outPoint);
                    var transformedPoint = transformer.MathTransform.Transform(outPoint);
                    geometry.SetPoint_2D(i, transformedPoint[0], transformedPoint[1]);
                }
            }
            else
            {
                for (var i = 0; i <= geometry.GetGeometryCount() - 1; i++)
                {
                    TransformGeometry(geometry.GetGeometryRef(i), transformer);
                }
            }
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
          
            
