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

namespace ReformaAgraria.Controllers
{
    [Route("api/[controller]")]
    public class VillageMapAttributeController : CrudController<ToraObject, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _contextAccessor;

        public VillageMapAttributeController(ReformaAgrariaDbContext dbContext, IHostingEnvironment hostingEnvironment, IHttpContextAccessor contextAccessor) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _contextAccessor = contextAccessor;
        }

        [HttpGet("export")]
        public string Export()
        {
            string sWebRootFolder = _hostingEnvironment.WebRootPath;
            string sFileName = @"demo.xlsx";
            string URL = string.Format("{0}://{1}/{2}", Request.Scheme, Request.Host, sFileName);
            FileInfo file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
            if (file.Exists)
            {
                file.Delete();
                file = new FileInfo(Path.Combine(sWebRootFolder, sFileName));
            }
            using (ExcelPackage package = new ExcelPackage(file))
            {
                // add a new worksheet to the empty workbook
                ExcelWorksheet worksheet = package.Workbook.Worksheets.Add("Employee");
                //First add the headers
                worksheet.Cells[1, 1].Value = "ID";
                worksheet.Cells[1, 2].Value = "Name";
                worksheet.Cells[1, 3].Value = "Gender";
                worksheet.Cells[1, 4].Value = "Salary (in $)";

                //Add values
                worksheet.Cells["A2"].Value = 1000;
                worksheet.Cells["B2"].Value = "Jon";
                worksheet.Cells["C2"].Value = "M";
                worksheet.Cells["D2"].Value = 5000;

                worksheet.Cells["A3"].Value = 1001;
                worksheet.Cells["B3"].Value = "Graham";
                worksheet.Cells["C3"].Value = "M";
                worksheet.Cells["D3"].Value = 10000;

                worksheet.Cells["A4"].Value = 1002;
                worksheet.Cells["B4"].Value = "Jenny";
                worksheet.Cells["C4"].Value = "F";
                worksheet.Cells["D4"].Value = 5000;

                package.Save(); //Save the workbook.
            }
            return URL;
        }

        [HttpPost("import")]
        public string Import()
        {
            GeoJSON.Net.Feature.FeatureCollection result = null;
            var formFile = HttpContext.Request.ReadFormAsync().Result.Files[0];
            var toraName = HttpContext.Request.ReadFormAsync().Result["toraName"];
            var tempFolderName = "reforma_agraria_" + DateTime.Now.ToString("yyyyMMddHHmmssffff") + "_" + Guid.NewGuid().ToString("N");
            //var tempPath = Path.Combine(Path.GetTempPath(), tempFolderName);
            var tempPath = Path.Combine(
                        Directory.GetCurrentDirectory(), "wwwroot",
                        tempFolderName);
            var zipPath = Path.Combine(tempPath, formFile.FileName);

            ValidateAndCreateFolder(tempPath);
            StreamCopy(zipPath, formFile);
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

                Directory.Delete(tempPath, true);
                return JsonConvert.SerializeObject(result);
            }
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
