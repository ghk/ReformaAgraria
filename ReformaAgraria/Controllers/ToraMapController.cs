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
using ReformaAgraria.Security;
using Microsoft.EntityFrameworkCore;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class ToraMapController : CrudController<ToraMap, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _contextAccessor;

        public ToraMapController(ReformaAgrariaDbContext dbContext, IHostingEnvironment hostingEnvironment, IHttpContextAccessor contextAccessor) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _contextAccessor = contextAccessor;
        }

        [HttpPost("import")]
        public async Task<ToraMap> Import()
        {
            var results = await HttpContext.Request.ReadFormAsync();
            var content = new ToraMap
            {
                FkRegionId = results["regionId"],
                FkToraObjectId = int.Parse(results["toraObjectId"]),
                Name = results["toraObjectName"]
            };

            var file = results.Files[0];
            var geojson = GetGeoJson(file);
            if (string.IsNullOrEmpty(geojson))
            {
                // TODO: LOG
                return null;
            }

            content.Geojson = geojson;
            dbContext.Add(content);
            await dbContext.SaveChangesAsync();

            var rootFolderPath = Path.Combine(_hostingEnvironment.WebRootPath, "TORA");
            ValidateAndCreateFolder(rootFolderPath);

            var regionFolderPath = Path.Combine(rootFolderPath, results["regionId"].ToString().ToUpper());
            ValidateAndCreateFolder(regionFolderPath);
            
            var destinationFile = Path.Combine(regionFolderPath, (content.Id.ToString() + ".zip"));
            StreamCopy(destinationFile, file);           

            return content;
        }

        [HttpPost("download")]
        public void Download()
        {
            var results = HttpContext.Request.ReadFormAsync().Result;
            using (var client = new WebClient())
            {
                string a = Path.Combine(_hostingEnvironment.WebRootPath, "TORA", results["regionId"].ToString().ToUpper(), results["toraId"].ToString().ToUpper() + ".zip");
                string b = Path.Combine(_hostingEnvironment.WebRootPath, "TORA", "KAMARORA A");
                client.DownloadFile(b,"5.zip");
            }
        }

        [HttpGet("download/{toraMapId}")]
        public async Task<IActionResult> Download(int toraMapId)
        {
            var toraMap = await dbContext.Set<ToraMap>()
                .Where(tm => tm.Id == toraMapId)
                .FirstOrDefaultAsync();

            if (toraMap == null)
                return NotFound(new RequestResult
                {
                    State = RequestState.Failed,
                    Message = "TORA map not found"
                });

            var toraPath = Path.Combine(_hostingEnvironment.WebRootPath, "TORA");
            var filePath = Path.Combine(toraPath, toraMap.FkRegionId, toraMap.Id + ".zip");
            var memory = new MemoryStream();
            using (var stream = new FileStream(filePath, FileMode.Open))
            {
                await stream.CopyToAsync(memory);
            }
            memory.Position = 0;
            return File(memory, "application/zip", Path.GetFileName(filePath));
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
                    query = query.Where(r => r.FkRegionId.Contains(regionId));
                }
            }

            return query;
        }

        private string GetGeoJson(IFormFile file)
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

        private string ValidateAndCreateFolder(string path)
        {
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            return path;
        }

        private void StreamCopy(string filePath, IFormFile file)
        {
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
        }
    }
}
