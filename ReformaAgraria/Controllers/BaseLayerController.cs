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

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class BaseLayerController : CrudController<BaseLayer, int>
    {
        private readonly ILogger<BaseLayerController> _logger;

        public BaseLayerController(ReformaAgrariaDbContext dbContext,
            ILogger<BaseLayerController> logger): base(dbContext)
        {
            _logger = logger;
        }

        protected override IQueryable<BaseLayer> ApplyQuery(IQueryable<BaseLayer> query)
        {
           return query;
        }
    }
}
            /*
            [Route("api/[controller]")]
            public class BaseLayerController : CrudController<BaseLayer, int>
            {
                private readonly IHostingEnvironment _hostingEnvironment;
                private readonly IHttpContextAccessor _contextAccessor;

                public BaseLayerController(ReformaAgrariaDbContext dbContext, IHostingEnvironment hostingEnvironment, IHttpContextAccessor contextAccessor) : base(dbContext)
                {
                    _hostingEnvironment = hostingEnvironment;
                    _contextAccessor = contextAccessor;
                }

                [HttpPost("import")]
                public async System.Threading.Tasks.Task ImportAsync()
                {
                    var results = HttpContext.Request.ReadFormAsync().Result;
                    var label = results["label"];
                    var color = results["color"];
                    var file = results.Files[0];

                    //var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "base_layer");
                    var tempFolderName = "reforma_agraria" + DateTime.Now.ToString("yyyyMMddHHmmssffff");
                    var tempPath = Path.Combine(Path.GetTempPath(), tempFolderName);
                    var zipPath = Path.Combine(tempPath, file.FileName);

                    ValidateAndCreateFolder(tempPath);
                    StreamCopy(zipPath, file);

                    ZipFile.ExtractToDirectory(zipPath, tempPath);
                    string[] shapeFiles = Directory.GetFiles(tempPath, "*.shp");

                    if (shapeFiles.Length == 0)
                    {
                        DeleteDirectory(tempPath);
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

                    var baseLayerContent = new BaseLayer
                    {
                        Label = label,
                        Color = color,
                        Geojson = geoJsonModel,
                    };

                    dbContext.Add(baseLayerContent);
                    await dbContext.SaveChangesAsync();

                    var destinationFile = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "base_layer", (baseLayerContent.Id.ToString() + '_' + file.FileName));
                    System.IO.File.Copy(zipPath, destinationFile, true);
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

                protected override IQueryable<BaseLayer> ApplyQuery(IQueryable<BaseLayer> query)
                {
                    var type = GetQueryString<string>("type", null);

                    if (!string.IsNullOrWhiteSpace(type))
                    {
                        if(type == "hgu")
                        {
                            query = query.Where(b => b.Label == "hgu");
                        }
                    }

                    return base.ApplyQuery(query);
                }

                private void DeleteDirectory(string directory)
                {
                    try
                    {
                        Directory.Delete(directory, true);
                    }
                    catch (IOException)
                    {
                        Directory.Delete(directory, true);
                    }
                    catch (UnauthorizedAccessException)
                    {
                        Directory.Delete(directory, true);
                    }
                }

            }*/
            
