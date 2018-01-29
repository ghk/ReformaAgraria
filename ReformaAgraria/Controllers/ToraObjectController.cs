using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MicrovacWebCore;
using OfficeOpenXml;
using ReformaAgraria.Helpers;
using ReformaAgraria.Models;
using ReformaAgraria.Models.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class ToraObjectController : CrudController<ToraObject, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ILogger<ToraObjectController> _logger;
        private readonly ILogger<ToraSubjectController> _tsLogger;
        private readonly ReformaAgrariaDbContext _context;

        public ToraObjectController(ReformaAgrariaDbContext dbContext,
            IHostingEnvironment hostingEnvironment,
            ILogger<ToraObjectController> logger,
            ILogger<ToraSubjectController> tsLogger) : base(dbContext)
        {
            _context = dbContext;
            _hostingEnvironment = hostingEnvironment;
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
       
        [HttpPost("import")]
        public ToraObject Import([FromForm]UploadToraDocumentViewModel document)
        {
            var toraDocumentDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "tora", "document");
            var toraDocumentFilePath = Path.Combine(toraDocumentDirectoryPath, document.RegionId, document.Document.FileName);
            var regionId = document.RegionId;

            using (var stream = document.Document.OpenReadStream())
            using (ExcelPackage package = new ExcelPackage(stream))
            {
                ExcelWorkbook workbook = package.Workbook;
                ToraObject to = new ToraObject();

                if (workbook.Worksheets.Count > 0)
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[1];
                    int rowCount = worksheet.Dimension.Rows;
                    Dictionary<string, int> objectIdDict = new Dictionary<string, int>();
                    List<Dictionary<string, int>> objectIdList = new List<Dictionary<string, int>>();

                    for (int i = 1; i <= rowCount; i += 22)
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
                                    if (decimal.TryParse(worksheet.Cells[(i + 6), 4].Value.ToString().Trim().Split(" ")[0].Replace(",", "."), out decimal size))
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
                        ToraSubjectController ts = new ToraSubjectController(_context, _hostingEnvironment, _tsLogger);
                        ts.Import(objectIdList, package);
                    }

                    IOHelper.StreamCopy(toraDocumentFilePath, document.Document);
                }
                
                return to;
            }
        }

        [HttpPost("export")]
        public string Export([FromBody]ToraObject objectModel)
        {
            var region = dbContext.Set<Region>().First(r => r.Id == objectModel.FkRegionId);
            var parent1 = dbContext.Set<Region>().First(r => r.Id == region.FkParentId);
            var parent2 = dbContext.Set<Region>().First(r => r.Id == parent1.FkParentId);

            List<ToraSubject> subjectModel = dbContext.Set<ToraSubject>().Where(r => r.FkToraObjectId == objectModel.Id).ToList();

            var templateDocumentDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "template");
            string sFileName = @"Template_Object_Subject_Tora.xlsx";
            FileInfo file = new FileInfo(Path.Combine(templateDocumentDirectoryPath, sFileName));
            using (ExcelPackage package = new ExcelPackage(file))
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[1];

                //Add values
                worksheet.Cells["D3"].Value = objectModel.Name;
                worksheet.Cells["D4"].Value = region.Name;
                worksheet.Cells["D5"].Value = parent1.Name;
                worksheet.Cells["D6"].Value = parent2.Name;
                worksheet.Cells["D7"].Value = objectModel.Size;
                worksheet.Cells["D8"].Value = objectModel.TotalTenants;
                worksheet.Cells["D9"].Value = Translate(objectModel.RegionalStatus.ToString());
                worksheet.Cells["D10"].Value = Translate(objectModel.LandType);
                worksheet.Cells["D11"].Value = objectModel.Livelihood;
                worksheet.Cells["D12"].Value = objectModel.ProposedTreatment;
                worksheet.Cells["D14"].Value = Translate(objectModel.LandStatus.ToString());
                worksheet.Cells["C16"].Value = objectModel.LandTenureHistory;
                worksheet.Cells["D19"].Value = objectModel.ConflictChronology;
                worksheet.Cells["D21"].Value = objectModel.FormalAdvocacyProgress;
                worksheet.Cells["D22"].Value = objectModel.NonFormalAdvocacyProgress;

                ExcelWorksheet worksheet2 = package.Workbook.Worksheets[2];
                for (int i = 0; i < subjectModel.Count; i++)
                {
                    int row = 2;

                    worksheet2.Cells["A" + (row + i).ToString()].Value = i + 1;
                    worksheet2.Cells["B" + (row + i).ToString()].Value = subjectModel[i].Name;
                    worksheet2.Cells["C" + (row + i).ToString()].Value = Translate(subjectModel[i].MaritalStatus.ToString());
                    worksheet2.Cells["D" + (row + i).ToString()].Value = subjectModel[i].Address.ToString();
                    worksheet2.Cells["E" + (row + i).ToString()].Value = Translate(subjectModel[i].Gender.ToString());
                    worksheet2.Cells["F" + (row + i).ToString()].Value = subjectModel[i].Age;
                    worksheet2.Cells["G" + (row + i).ToString()].Value = Translate(subjectModel[i].EducationalAttainment.ToString());
                    worksheet2.Cells["H" + (row + i).ToString()].Value = subjectModel[i].TotalFamilyMembers;
                    worksheet2.Cells["I" + (row + i).ToString()].Value = Translate(subjectModel[i].LandStatus.ToString());
                    worksheet2.Cells["J" + (row + i).ToString()].Value = subjectModel[i].LandLocation;
                    worksheet2.Cells["K" + (row + i).ToString()].Value = subjectModel[i].Size;
                    worksheet2.Cells["L" + (row + i).ToString()].Value = subjectModel[i].PlantTypes;
                    worksheet2.Cells["M" + (row + i).ToString()].Value = subjectModel[i].Notes;
                }

                package.Save();
            }
            return sFileName;
        }

        public string Translate(string word)
        {
            switch (word)
            {
                case "Uneducated":
                    return "Tidak Sekolah";
                case "ElementarySchool":
                    return "SD dan Sederajat";
                case "JuniorHighSchool":
                    return "SMP dan Sederajat";
                case "SeniorHighSchool":
                    return "SMA dan Sederajat";
                case "BachelorDegree":
                    return "S1";
                case "MasterDegree":
                    return "S2";
                case "DoctorateDegree":
                    return "S3";
                case "Male":
                    return "Pria";
                case "Female":
                    return "Wanita";
                case "Government":
                    return "Pemerintah";
                case "Private":
                    return "Swasta";
                case "Gift":
                    return "Pemberian";
                case "Inheritage":
                    return "Warisan";
                case "Flat":
                    return "Datar";
                case "Sloping":
                    return "Landai";
                case "Hill":
                    return "Perbukitan";
                case "Mountain":
                    return "Pegunungan";
                case "Single":
                    return "Belum Menikah";
                case "Married":
                    return "Menikah";
                case "Divorced":
                    return "Cerai";
                case "ReleaseOfForestArea":
                    return "Pelepasan Area Hutan";
                case "CustomaryForest":
                    return "Hutan Adat";
                case "RedistributionOfLand":
                    return "Redistribusi Lahan";
                case "LegalizationOfAssets":
                    return "Legalisasi Aset";
                case "Forest":
                    return "Hutan";
                case "NonForest":
                    return "Non Hutan";
                case "Proposal":
                    return "Pengajuan";
                case "Verification":
                    return "Verifikasi";
                case "Act":
                    return "Penetapan";
                case "Identification":
                    return "Identifikasi";
                case "DeliberationWithinVillage":
                    return "Musyawarah Desa";
                case "DeliberationAmongVillages":
                    return "Musyawarah Antar Desa";
                case "CoordinationMeetingRaTaskForce":
                    return "Rapat Koordinasi Gugus Tugas RA";
                case "ProposalOfObjectSubjectToraAct":
                    return "Pengajuan Penetapan Objek Subjek Tora";
                case "PublicationOfPermissionFromAtrbpnOrLhk":
                    return "Publikasi Izin dar Atrbpn atau Lhk";
                case "Others":
                    return "Lainnya";
                case "NotSpecified":
                    return "Tidak Disebutkan";
                default:
                    return word;
            }
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

            if (type == "getCompleteRegion")
            {
                query = query.Include(to => to.Region)
                    .Include(to => to.Region.Parent)
                    .Include(to => to.Region.Parent.Parent);
            }

            return query;
        }
    }
}