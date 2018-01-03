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
using OSGeo.OGR;
using Newtonsoft.Json;
using GeoJSON.Net.Geometry;
using GeoJSON.Net.Converters;
using ProjNet.CoordinateSystems.Transformations;
using ProjNet.CoordinateSystems;
using System.Net;

namespace ReformaAgraria.Controllers
{
    [Route("api/[controller]")]
    public class ToraMapController : CrudController<ToraMap, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _contextAccessor;

        public ToraMapController(ReformaAgrariaDbContext dbContext, IHostingEnvironment hostingEnvironment, IHttpContextAccessor contextAccessor) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _contextAccessor = contextAccessor;
        }

        protected override IQueryable<ToraMap> ApplyQuery(IQueryable<ToraMap> query)
        {
            var type = GetQueryString<string>("type");
            if (type != null)
            {
                if (type == "parent")
                {
                    var parentId = GetQueryString<string>("parentId").ToString().Trim().Replace("_", ".");


                    if (!string.IsNullOrWhiteSpace(parentId))
                    {
                        query = query.Where(r => r.FkRegionId.Contains(parentId));
                    }
                }
            }

            return query;
        }

        [HttpPost("import")]
        public async Task<ToraMap> ImportAsync()
        {
            var results = HttpContext.Request.ReadFormAsync().Result;
            var content = new ToraMap
            {
                FkRegionId = results["regionId"],
                Name = results["name"]
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

            var rootFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "TORA");
            ValidateAndCreateFolder(rootFolderPath);

            var regionFolderPath = Path.Combine(rootFolderPath, results["regionName"].ToString().ToUpper());
            ValidateAndCreateFolder(regionFolderPath);
            
            var destinationFile = Path.Combine(regionFolderPath, (content.Id.ToString() + '_' + ".zip"));
            StreamCopy(destinationFile, file);

            return content;
        }

        [HttpPost("download")]
        public void Download()
        {
            var results = HttpContext.Request.ReadFormAsync().Result;
            using (var client = new WebClient())
            {
                string a = Path.Combine(_hostingEnvironment.WebRootPath, "TORA", results["regionName"].ToString().ToUpper(), results["toraId"].ToString().ToUpper() + "_.zip");
                string b = Path.Combine(_hostingEnvironment.WebRootPath, "TORA", "KAMARORA A");
                client.DownloadFile(b,"5_.zip");
            }
        }

        public string GetGeoJson(IFormFile file)
        {
            GeoJSON.Net.Feature.FeatureCollection result = null;
            var tempFolderName = "reforma_agraria_tora_" + DateTime.Now.ToString("yyyyMMddHHmmssffff") + "_" + Guid.NewGuid().ToString("N");
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

        public string ValidateAndCreateFolder(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            return path;
        }

        public void StreamCopy(string filePath, IFormFile file)
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
        }
    }
}
