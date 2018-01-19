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
using Microsoft.Extensions.Logging;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class ToraObjectController : CrudController<ToraObject, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ILogger<ToraObjectController> _logger;
        private readonly ILogger<ToraSubjectController> _tsLogger;
        private readonly ReformaAgrariaDbContext _context;

        public ToraObjectController(ReformaAgrariaDbContext dbContext, 
            IHostingEnvironment hostingEnvironment, 
            IHttpContextAccessor contextAccessor,
            ILogger<ToraObjectController> logger,
            ILogger<ToraSubjectController> tsLogger) : base(dbContext)
        {
            _context = dbContext;
            _hostingEnvironment = hostingEnvironment;
            _contextAccessor = contextAccessor;
            _logger = logger;
            _tsLogger = tsLogger;
        }

        public class DashboardData
        {
            public Region Region { get; set; }
            public decimal TotalSize { get; set; }
            public int TotalToraObjects { get; set; }
            public int TotalToraSubjects { get; set; }

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
        public ToraObject Import()
        {
            var results = HttpContext.Request.ReadFormAsync().Result;
            var formFile = results.Files[0];
            string regionId = results["regionId"];
            decimal size;

            var path = Path.Combine(
                        Directory.GetCurrentDirectory(), "wwwroot",
                        formFile.FileName);

            using (var stream = new FileStream(path, FileMode.Create))
            {
                formFile.CopyTo(stream);
            }

            FileInfo file = new FileInfo(path);
            try
            {
                using (ExcelPackage package = new ExcelPackage(file))
                {
                    ExcelWorkbook workbook = package.Workbook;
                    ToraObject to = new ToraObject();

                    if (workbook.Worksheets.Count > 0)
                    {
                        ExcelWorksheet worksheet = package.Workbook.Worksheets[1];
                        int rowCount = worksheet.Dimension.Rows;
                        Dictionary<string, int> objectIdDict = new Dictionary<string, int>();
                        List<Dictionary<string, int>> objectIdList = new List<Dictionary<string, int>>();

                        for (int i = 1; i <= rowCount; i+=22)
                        {
                            if (worksheet.Cells[i, 1].Value != null)
                            {
                                if (worksheet.Cells[i, 1].Value.ToString().Trim().ToLower() == "no")
                                {
                                    to = new ToraObject();
                                    to.FkRegionId = regionId;
                                    to.Name = worksheet.Cells[(i + 2), 4].Value != null ? worksheet.Cells[(i + 2), 4].Value.ToString().Trim() : "";

                                    if (worksheet.Cells[(i + 6), 4].Value != null)
                                    {
                                        if (decimal.TryParse(worksheet.Cells[(i + 6), 4].Value.ToString().Trim().Split(" ")[0].Replace(",", "."), out size))
                                        {
                                            to.Size = size;
                                        }
                                        else
                                        {
                                            to.Size = 0;
                                        }
                                    }
                                    else
                                    {
                                        to.Size = 0;
                                    }

                                    to.TotalTenants = worksheet.Cells[(i + 7), 4].Value != null ? worksheet.Cells[(i + 7), 4].Value.ToString().Trim().Split(" ")[0] : "";

                                    if (worksheet.Cells[(i + 8), 4].Value != null)
                                    {
                                        if (worksheet.Cells[(i + 8), 4].Value.ToString().Trim() != "-")
                                        {
                                            if (worksheet.Cells[(i + 8), 4].Value.ToString().ToLower().Trim() == "hutan")
                                            {
                                                to.RegionalStatus = RegionalStatus.Forest;
                                            }
                                            else if (worksheet.Cells[(i + 8), 4].Value.ToString().ToLower().Trim() == "non hutan")
                                            {
                                                to.RegionalStatus = RegionalStatus.NonForest;
                                            }
                                            else
                                            {
                                                to.RegionalStatus = RegionalStatus.NotSpecified;
                                            }
                                        }
                                        else
                                        {
                                            to.RegionalStatus = RegionalStatus.NotSpecified;
                                        }
                                    }
                                    else
                                    {
                                        to.RegionalStatus = RegionalStatus.NotSpecified;
                                    }

                                    to.LandType = worksheet.Cells[(i + 9), 4].Value != null ? worksheet.Cells[(i + 9), 4].Value.ToString().Trim() : "";
                                    to.Livelihood = worksheet.Cells[(i + 10), 4].Value != null ? worksheet.Cells[(i + 10), 4].Value.ToString().Trim() : "";
                                    to.ProposedTreatment = worksheet.Cells[(i + 11), 4].Value != null ? worksheet.Cells[(i + 11), 4].Value.ToString().Trim() : "";

                                    if (worksheet.Cells[(i + 13), 4].Value != null)
                                    {
                                        if (worksheet.Cells[(i + 13), 4].Value.ToString().Trim() != "-")
                                        {
                                            if (worksheet.Cells[(i + 13), 4].Value.ToString().ToLower().Contains("negara"))
                                            {
                                                to.LandStatus = LandStatus.Government;
                                            }
                                            else if (worksheet.Cells[(i + 13), 4].Value.ToString().ToLower().Contains("swasta"))
                                            {
                                                to.LandStatus = LandStatus.Private;
                                            }
                                            else
                                            {
                                                to.LandStatus = LandStatus.Others;
                                            }
                                        }
                                        else
                                        {
                                            to.LandStatus = LandStatus.Others;
                                        }
                                    }
                                    else
                                    {
                                        to.LandStatus = LandStatus.Others;
                                    }

                                    to.LandTenureHistory = worksheet.Cells[(i + 15), 3].Value != null ? worksheet.Cells[(i + 15), 3].Value.ToString().Trim() : "";
                                    to.ConflictChronology = worksheet.Cells[(i + 18), 4].Value != null ? worksheet.Cells[(i + 18), 4].Value.ToString().Trim() : "";
                                    to.FormalAdvocacyProgress = worksheet.Cells[(i + 20), 4].Value != null ? worksheet.Cells[(i + 20), 4].Value.ToString().Trim() : "";
                                    to.NonFormalAdvocacyProgress = worksheet.Cells[(i + 22), 4].Value != null ? worksheet.Cells[(i + 22), 4].Value.ToString().Trim() : "";

                                    int objectId = Post(to);
                                    objectIdDict.Add(to.Name, objectId);
                                }
                            }
                        }

                        objectIdList.Add(objectIdDict);

                        if (objectIdList.Count > 0 && workbook.Worksheets.Count > 1)
                        {
                            //ToraSubjectController ts = (ToraSubjectController)HttpContext.RequestServices.GetService(typeof(ToraSubjectController));
                            ToraSubjectController ts = new ToraSubjectController(_context, _hostingEnvironment, _tsLogger);
                            ts.Import(objectIdList, package);
                        }
                    }

                    file.Delete();
                    return to;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost("edit")]
        public async Task<ToraObject> Edit()
        {
            var results = HttpContext.Request.ReadFormAsync().Result;
            int id = Int32.Parse(results["id"]);
            var conflictChronology = results["conflictChronology"];
            var fkRegionId = results["fkRegionId"];
            var formalAdvocacyProgress = results["formalAdvocacyProgress"];
            var nonFormalAdvocacyProgress = results["nonFormalAdvocacyProgress"];
            int landStatus = Int32.Parse(results["landStatus"]);
            var landTenureHistory = results["landTenureHistory"];
            var landType = results["landType"];
            var livelihood = results["livelihood"];
            var name = results["name"];
            var proposedTreatment = results["proposedTreatment"];
            int regionalStatus = Int32.Parse(results["regionalStatus"]);
            decimal size = Convert.ToDecimal(results["size"]);
            int stages = Int32.Parse(results["stages"]);
            var totalTenants = results["totalTenants"];

            var content = dbContext.Set<ToraObject>().Where(o => o.Id == id).FirstOrDefault();
            content.DateModified = DateTime.Now;
            content.ConflictChronology = conflictChronology;
            content.FkRegionId = fkRegionId;
            content.FormalAdvocacyProgress = formalAdvocacyProgress;
            content.NonFormalAdvocacyProgress = nonFormalAdvocacyProgress;
            content.LandStatus = (LandStatus)landStatus;
            content.LandTenureHistory = landTenureHistory;
            content.LandType = landType;
            content.Livelihood = livelihood;
            content.Name = name;
            content.ProposedTreatment = proposedTreatment;
            content.RegionalStatus = (RegionalStatus)regionalStatus;
            content.Size = size;
            content.Stages = stages;
            content.TotalTenants = totalTenants;

            dbContext.Update(content);
            await dbContext.SaveChangesAsync();
            return content;
        }

        [HttpPost("add")]
        public async Task<ToraObject> Add()
        {
            var results = HttpContext.Request.ReadFormAsync().Result;
            var conflictChronology = results["conflictChronology"];
            var fkRegionId = results["fkRegionId"];
            var formalAdvocacyProgress = results["formalAdvocacyProgress"];
            var nonFormalAdvocacyProgress = results["nonFormalAdvocacyProgress"];
            int landStatus = Int32.Parse(results["landStatus"]);
            var landTenureHistory = results["landTenureHistory"];
            var landType = results["landType"];
            var livelihood = results["livelihood"];
            var name = results["name"];
            var proposedTreatment = results["proposedTreatment"];
            int regionalStatus = Int32.Parse(results["regionalStatus"]);
            decimal size = Convert.ToDecimal(results["size"]);
            int stages = Int32.Parse(results["stages"]);
            var totalTenants = results["totalTenants"];

            var content = new ToraObject();
            content.DateCreated = DateTime.Now;
            content.DateModified = DateTime.Now;
            content.ConflictChronology = conflictChronology;
            content.FkRegionId = fkRegionId;
            content.FormalAdvocacyProgress = formalAdvocacyProgress;
            content.NonFormalAdvocacyProgress = nonFormalAdvocacyProgress;
            content.LandStatus = (LandStatus)landStatus;
            content.LandTenureHistory = landTenureHistory;
            content.LandType = landType;
            content.Livelihood = livelihood;
            content.Name = name;
            content.ProposedTreatment = proposedTreatment;
            content.RegionalStatus = (RegionalStatus)regionalStatus;
            content.Size = size;
            content.Stages = stages;
            content.TotalTenants = totalTenants;

            dbContext.Add(content);
            await dbContext.SaveChangesAsync();
            return content;
        }

        [HttpGet("summary/{id}")]
        public List<DashboardData> GetSummary(string id)
        {
            var results = new List<DashboardData>();
            var region = dbContext.Set<Region>().First(r => r.Id == id);
            var children = dbContext.Set<Region>()
                .Where(r => r.FkParentId == id)
                .OrderBy(x => x.Name)
                .ToList();

            if (children.Count == 0)
                children.Add(region);

            var toraObjects = from objects in dbContext.Set<ToraObject>()
                          join desa in dbContext.Set<Region>() on objects.FkRegionId equals desa.Id
                          join kec in dbContext.Set<Region>() on desa.FkParentId equals kec.Id
                          join kab in dbContext.Set<Region>() on kec.FkParentId equals kab.Id
                          where objects.FkRegionId.StartsWith(id)
                          group objects by region.Type == RegionType.Kabupaten ? kec.Id : desa.Id into r
                          select new { Data = r };
            
            foreach (var toraObject in toraObjects)
            {
                var toraObjectIds = toraObject.Data.Select(t => t.Id);
                var totalToraSubjects = dbContext.Set<ToraSubject>()
                        .Where(ts => toraObjectIds.Contains(ts.FkToraObjectId))
                        .Count();

                var dashboardData = new DashboardData
                {
                    Region = children.First(c => c.Id == toraObject.Data.Key),
                    TotalSize = toraObject.Data.Sum(t => t.Size),
                    TotalToraObjects = toraObject.Data.Count(),
                    TotalToraSubjects = totalToraSubjects
                };

                results.Add(dashboardData);
            }

            var finalResult = children
                .Select(c => results.FirstOrDefault(g => g.Region.Id == c.Id)
                   ?? new DashboardData { Region = c })
                .ToList();

            return finalResult;
        }

        protected override IQueryable<ToraObject> ApplyQuery(IQueryable<ToraObject> query)
        {
            var type = GetQueryString<string>("type");

            if (type == "getAllByRegion")
            {
                var regionId = GetQueryString<string>("regionId");
                if (!string.IsNullOrWhiteSpace(regionId))
                    query = query.Where(to => to.FkRegionId == regionId);
            }
            
            return query;
        }
    }
}
