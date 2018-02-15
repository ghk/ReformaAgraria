using FluentValidation;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MicrovacWebCore;
using MicrovacWebCore.Exceptions;
using MicrovacWebCore.Helpers;
using OfficeOpenXml;
using ReformaAgraria.Helpers;
using ReformaAgraria.Models;
using ReformaAgraria.Models.Validators;
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
    [Authorize(Policy = "Bearer")]
    public class ToraObjectController : CrudControllerAsync<ToraObject, int>
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

        [HttpPost]
        [NotGenerated]
        public override async Task<int> PostAsync([FromBody] ToraObject model)
        {
            var validator = new ToraObjectValidator();
            validator.ValidateAndThrow(model);
            return await base.PostAsync(model);
        }

        [HttpPost("upload")]
        public async Task<ToraObject> Upload([FromForm] UploadToraDocumentViewModel document)
        {
            var toraDocumentDirectoryPath = Path.Combine(_hostingEnvironment.WebRootPath, "tora", "document");
            var toraDocumentFilePath = Path.Combine(toraDocumentDirectoryPath, document.RegionId, document.File.FileName);
            var regionId = document.RegionId;

            using (var stream = document.File.OpenReadStream())
            using (ExcelPackage package = new ExcelPackage(stream))
            {
                ExcelWorkbook workbook = package.Workbook;
                ToraObject to = new ToraObject();

                if (workbook.Worksheets.Count > 0)
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[1];
                    int rowCount = worksheet.Dimension.Rows;
                    List<ToraObject> toraObjects = new List<ToraObject>();

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

                                //to.TotalTenants = worksheet.Cells[(i + 7), 4].Value != null ? worksheet.Cells[(i + 7), 4].Value.ToString().Trim().Split(" ")[0] : "";

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

                                await PostAsync(to);
                                toraObjects.Add(to);
                            }
                        }
                    }

                    if (workbook.Worksheets.Count > 1)
                    {
                        ToraSubjectController ts = new ToraSubjectController(_context, _hostingEnvironment, _tsLogger);
                        await ts.Upload(toraObjects, package);
                    }               

                    await IOHelper.StreamCopyAsync(toraDocumentFilePath, document.File);
                }

                return to;
            }
        }

        [HttpGet("download/{id}")]
        public async Task<FileStreamResult> Download(int id)
        {
            var objectModel = await dbContext.Set<ToraObject>().FirstOrDefaultAsync(t => t.Id == id);
            var region = await dbContext.Set<Region>()
                .Include(r => r.Parent)
                .Include(r => r.Parent.Parent)
                .FirstOrDefaultAsync(r => r.Id == objectModel.FkRegionId);

            List<ToraSubject> subjectModel = await dbContext.Set<ToraSubject>()
                .Where(r => r.FkToraObjectId == objectModel.Id)
                .ToListAsync();

            var templateFileName = @"Template_Object_Subject_Tora.xlsx";
            var templateFilePath = Path.Combine(_hostingEnvironment.WebRootPath, "template", templateFileName);

            var outputStream = new MemoryStream();

            using (var templateStream = new MemoryStream())
            using (var fileStream = new FileStream(templateFilePath, FileMode.Open, FileAccess.Read, FileShare.Read))
            {
                await fileStream.CopyToAsync(templateStream);
                templateStream.Position = 0;
                using (ExcelPackage package = new ExcelPackage(templateStream))
                {
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[1];

                    //Add values
                    worksheet.Cells["D3"].Value = objectModel.Name;
                    worksheet.Cells["D4"].Value = region.Name;
                    worksheet.Cells["D5"].Value = region.Parent.Name;
                    worksheet.Cells["D6"].Value = region.Parent.Parent.Name;
                    worksheet.Cells["D7"].Value = 0;
                    worksheet.Cells["D8"].Value = subjectModel.Count;
                    worksheet.Cells["D9"].Value = TranslateHelper.Translate(objectModel.RegionalStatus.ToString());
                    worksheet.Cells["D10"].Value = TranslateHelper.Translate(objectModel.LandType);
                    worksheet.Cells["D11"].Value = objectModel.Livelihood;
                    worksheet.Cells["D12"].Value = objectModel.ProposedTreatment;
                    worksheet.Cells["D14"].Value = TranslateHelper.Translate(objectModel.LandStatus.ToString());
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
                        worksheet2.Cells["C" + (row + i).ToString()].Value = TranslateHelper.Translate(subjectModel[i].MaritalStatus.ToString());
                        worksheet2.Cells["D" + (row + i).ToString()].Value = subjectModel[i].Address.ToString();
                        worksheet2.Cells["E" + (row + i).ToString()].Value = TranslateHelper.Translate(subjectModel[i].Gender.ToString());
                        worksheet2.Cells["F" + (row + i).ToString()].Value = subjectModel[i].Age;
                        worksheet2.Cells["G" + (row + i).ToString()].Value = TranslateHelper.Translate(subjectModel[i].EducationalAttainment.ToString());
                        worksheet2.Cells["H" + (row + i).ToString()].Value = subjectModel[i].TotalFamilyMembers;
                        worksheet2.Cells["I" + (row + i).ToString()].Value = TranslateHelper.Translate(subjectModel[i].LandStatus.ToString());
                        worksheet2.Cells["J" + (row + i).ToString()].Value = subjectModel[i].LandLocation;
                        worksheet2.Cells["K" + (row + i).ToString()].Value = subjectModel[i].Size;
                        worksheet2.Cells["L" + (row + i).ToString()].Value = subjectModel[i].PlantTypes;
                        worksheet2.Cells["M" + (row + i).ToString()].Value = subjectModel[i].Notes;
                    }

                    package.SaveAs(outputStream);
                }
            }

            outputStream.Position = 0;
            return File(outputStream, "application/xlsx", "tora.xlsx");
        }

        [HttpGet("summary/{id}")]
        public async Task<List<DashboardDataViewModel>> GetSummary(string id)
        {
            var results = new List<DashboardDataViewModel>();
            var region = await dbContext.Set<Region>().FirstAsync(r => r.Id == id);
            var children = await dbContext.Set<Region>()
                .Where(r => r.FkParentId == id)
                .OrderBy(x => x.Name)
                .ToListAsync();

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
                var totalToraSubjects = await dbContext.Set<ToraSubject>()
                        .Where(ts => toraObjectIds.Contains(ts.FkToraObjectId))
                        .CountAsync();

                var dashboardData = new DashboardDataViewModel
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
                   ?? new DashboardDataViewModel { Region = c })
                .ToList();

            return finalResult;
        }

        [HttpGet("calculate/all")]
        public async Task<IActionResult> CalculateAll()
        {
            var toraObjects = await dbContext.Set<ToraObject>().ToListAsync();
            foreach (var toraObject in toraObjects)
                ToraHelper.CalculateToraObject(dbContext, toraObject);
            return Ok(new RequestResult() { Message = "Success" });
        }

        [HttpGet("calculate/{id}")]
        public async Task<IActionResult> Calculate(int id)
        {
            var toraObject = await dbContext.Set<ToraObject>().FirstOrDefaultAsync(to => to.Id == id);
            if (toraObject == null)
                throw new NotFoundException();

            ToraHelper.CalculateToraObject(dbContext, toraObject);
            return Ok(new RequestResult() { Message = "Success" });
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

            if (type == "getByStatus")
            {
                var status = GetQueryString<string>("status");
                if (!string.IsNullOrWhiteSpace(status))
                    query = query.Where(to => to.Status == (Status)Convert.ToInt32(status));
            }

            return query;
        }
    }
}