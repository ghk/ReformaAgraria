using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MicrovacWebCore;
using OfficeOpenXml;
using ReformaAgraria.Models;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [Authorize(Policy = "Bearer")]
    public class ToraSubjectController : CrudControllerAsync<ToraSubject, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly ILogger<ToraSubjectController> _logger;

        public ToraSubjectController(ReformaAgrariaDbContext dbContext,
            IHostingEnvironment hostingEnvironment,
            ILogger<ToraSubjectController> logger) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _logger = logger;
        }

        public async Task Upload(List<ToraObject> toraObjects, ExcelPackage package)
        {
            using (package)
            {
                ExcelWorksheet worksheet = package.Workbook.Worksheets[2];
                ToraSubject ts = new ToraSubject();

                for (int i = 2; i <= worksheet.Dimension.Rows; i++)
                {
                    ts = new ToraSubject();

                    var toraObjectName = worksheet.Cells[i, 10].Value != null ? worksheet.Cells[i, 10].Value.ToString().Trim().ToLower() : null;
                    var toraObject = toraObjects.FirstOrDefault(to => to.Name.ToLowerInvariant() == toraObjectName);
                    if (toraObject == null)
                        continue;
                    ts.FkToraObjectId = toraObject.Id;

                    ts.Name = worksheet.Cells[i, 2].Value != null ? worksheet.Cells[i, 2].Value.ToString().Trim() : "";

                    if (worksheet.Cells[i, 3].Value != null)
                    {
                        if (worksheet.Cells[i, 3].Value.ToString().ToLower().Trim() == "menikah")
                        {
                            ts.MaritalStatus = MaritalStatus.Married;
                        }
                        else if (worksheet.Cells[i, 3].Value.ToString().ToLower().Trim().Contains("belum menikah"))
                        {
                            ts.MaritalStatus = MaritalStatus.Single;
                        }
                        else if (worksheet.Cells[i, 3].Value.ToString().ToLower().Trim().Contains("cerai"))
                        {
                            ts.MaritalStatus = MaritalStatus.Divorced;
                        }
                    }
                    else
                    {
                        ts.MaritalStatus = MaritalStatus.NotSpecified;
                    }

                    ts.Address = worksheet.Cells[i, 4].Value != null ? worksheet.Cells[i, 4].Value.ToString().Trim() : "";

                    if (worksheet.Cells[i, 5].Value != null)
                    {
                        if (worksheet.Cells[i, 5].Value.ToString().Trim() != "-")
                        {
                            if (worksheet.Cells[i, 5].Value.ToString().ToLower().Trim() == "l")
                            {
                                ts.Gender = Gender.Male;
                            }
                            else if (worksheet.Cells[i, 5].Value.ToString().ToLower().Trim() == "p")
                            {
                                ts.Gender = Gender.Female;
                            }
                            else
                            {
                                ts.Gender = Gender.NotSpecified;
                            }
                        }
                        else
                        {
                            ts.Gender = Gender.NotSpecified;
                        }
                    }

                    if (worksheet.Cells[i, 6].Value != null)
                    {
                        if (int.TryParse(worksheet.Cells[i, 6].Value.ToString().Trim().ToLower().Split(" ")[0], out int age))
                        {
                            ts.Age = age;
                        }
                        else
                        {
                            ts.Age = 0;
                        }
                    }
                    else
                    {
                        ts.Age = 0;
                    }

                    if (worksheet.Cells[i, 7].Value != null)
                    {
                        if (worksheet.Cells[i, 7].Value.ToString().ToLower().Trim().Contains("tidak sekolah"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.Uneducated;
                        }
                        else if (worksheet.Cells[i, 7].Value.ToString().ToLower().Trim().Contains("sd"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.ElementarySchool;
                        }
                        else if (worksheet.Cells[i, 7].Value.ToString().ToLower().Trim().Contains("smp"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.JuniorHighSchool;
                        }
                        else if (worksheet.Cells[i, 7].Value.ToString().ToLower().Trim().Contains("sma"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.SeniorHighSchool;
                        }
                        else if (worksheet.Cells[i, 7].Value.ToString().ToLower().Trim().Contains("s1"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.BachelorDegree;
                        }
                        else if (worksheet.Cells[i, 7].Value.ToString().ToLower().Trim().Contains("s2"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.MasterDegree;
                        }
                        else if (worksheet.Cells[i, 7].Value.ToString().ToLower().Trim().Contains("s3"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.DoctorateDegree;
                        }
                        else
                        {
                            ts.EducationalAttainment = EducationalAttainment.Others;
                        }
                    }
                    else
                    {
                        ts.EducationalAttainment = EducationalAttainment.Others;
                    }

                    if (worksheet.Cells[i, 8].Value != null)
                    {
                        if (int.TryParse(worksheet.Cells[i, 8].Value.ToString().Trim(), out int totalFamilyMembers))
                        {
                            ts.TotalFamilyMembers = totalFamilyMembers;
                        }
                        else
                        {
                            ts.TotalFamilyMembers = 0;
                        }
                    }
                    else
                    {
                        ts.TotalFamilyMembers = 0;
                    }

                    if (worksheet.Cells[i, 9].Value != null)
                    {
                        if (worksheet.Cells[i, 9].Value.ToString().Trim() != "-")
                        {
                            if (worksheet.Cells[i, 9].Value.ToString().ToLower().Trim() == "tanah warisan")
                            {
                                ts.LandStatus = LandStatus.Inheritance;
                            }
                            else if (worksheet.Cells[i, 9].Value.ToString().ToLower().Trim() == "tanah berian")
                            {
                                ts.LandStatus = LandStatus.Gift;
                            }
                        }
                        else
                        {
                            ts.LandStatus = LandStatus.Others;
                        }
                    }
                    else
                    {
                        ts.LandStatus = LandStatus.Others;
                    }

                    ts.LandLocation = worksheet.Cells[i, 10].Value != null ? worksheet.Cells[i, 10].Value.ToString().Trim() : "";

                    if (worksheet.Cells[i, 11].Value != null)
                    {
                        if (decimal.TryParse(worksheet.Cells[i, 11].Value.ToString().Trim().Split(" ")[0].Replace(",", "."), out decimal size))
                        {
                            ts.Size = size;
                        }
                        else
                        {
                            ts.Size = 0;
                        }
                    }
                    else
                    {
                        ts.Size = 0;
                    }

                    ts.PlantTypes = worksheet.Cells[i, 12].Value != null ? worksheet.Cells[i, 12].Value.ToString().Trim() : "";
                    ts.Notes = worksheet.Cells[i, 13].Value != null ? worksheet.Cells[i, 13].Value.ToString().Trim() : "";

                    await PostAsync(ts);
                }
            }
        }
      
        protected override IQueryable<ToraSubject> ApplyQuery(IQueryable<ToraSubject> query)
        {
            var type = GetQueryString<string>("type");

            if (type == "getAllByRegion")
            {
                var regionId = GetQueryString<int>("regionId");
                query = query.Where(ts => ts.FkToraObjectId == regionId);
            }

            if (type == "getAllByPersil")
            {
                var persilId = GetQueryString<int>("persilId");
                query = query.Where(ts => ts.FkPersilId == persilId);
            }
           
            if (type == "getAllByToraObject")
            {
                var toraObjectId = GetQueryString<int>("toraObjectId");
                query = query.Where(ts => ts.FkToraObjectId == toraObjectId);
            }

            return query;
        }
    }
}