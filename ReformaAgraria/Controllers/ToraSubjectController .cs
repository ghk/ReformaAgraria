using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using OfficeOpenXml;
using System.Text;
using System.Data;
using MicrovacWebCore;
using ReformaAgraria.Models;

namespace ReformaAgraria.Controllers
{
    [Route("api/[controller]")]
    public class ToraSubjectController : CrudController<ToraSubject, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public ToraSubjectController(ReformaAgrariaDbContext dbContext, IHostingEnvironment hostingEnvironment): base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
        }
        
        [HttpPost("import")]
        public ToraSubject Import()
        {
            var formFile = HttpContext.Request.ReadFormAsync().Result.Files[0];

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
                    ExcelWorksheet worksheet = package.Workbook.Worksheets[1];
                    int rowCount = worksheet.Dimension.Rows;
                    ToraSubject ts = new ToraSubject();

                    for (int i = 2; i <= rowCount; i++)
                    {
                        ts.Name = worksheet.Cells[i, 2].Value.ToString();
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

                        ts.Address = worksheet.Cells[i, 4].Value.ToString();

                        if (worksheet.Cells[i, 5].Value.ToString().ToLower().Trim() == "l")
                        {
                            ts.Gender = Gender.Male;
                        }
                        else if (worksheet.Cells[i, 5].Value.ToString().ToLower().Trim() == "p")
                        {
                            ts.Gender = Gender.Female;
                        }

                        ts.Age = int.Parse(worksheet.Cells[i, 6].Value.ToString().Trim());

                        if (worksheet.Cells[i, 8].Value.ToString().ToLower().Trim().Contains("tidak sekolah"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.Uneducated;
                        }
                        else if (worksheet.Cells[i, 8].Value.ToString().ToLower().Trim().Contains("sd"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.ElementarySchool;
                        }
                        else if (worksheet.Cells[i, 8].Value.ToString().ToLower().Trim().Contains("smp"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.JuniorHighSchool;
                        }
                        else if (worksheet.Cells[i, 8].Value.ToString().ToLower().Trim().Contains("sma"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.SeniorHighSchool;
                        }
                        else if (worksheet.Cells[i, 8].Value.ToString().ToLower().Trim().Contains("s1"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.BachelorDegree;
                        }
                        else if (worksheet.Cells[i, 8].Value.ToString().ToLower().Trim().Contains("s2"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.MasterDegree;
                        }
                        else if (worksheet.Cells[i, 8].Value.ToString().ToLower().Trim().Contains("s3"))
                        {
                            ts.EducationalAttainment = EducationalAttainment.DoctorateDegree;
                        }
                        else
                        {
                            ts.EducationalAttainment = EducationalAttainment.Others;
                        }
                        ts.TotalFamilyMembers = int.Parse(worksheet.Cells[i, 9].Value.ToString().Trim());
                        ts.LandStatus = worksheet.Cells[i, 10].Value.ToString();
                        ts.LandLocation = worksheet.Cells[i, 11].Value.ToString();
                        ts.Size = int.Parse(worksheet.Cells[i, 12].Value.ToString().Split(" ")[0]);
                        ts.PlantTypes = worksheet.Cells[i, 14].Value.ToString();
                        ts.Notes = worksheet.Cells[i, 15].Value.ToString();

                        Post(ts);
                    }

                    
                    
                    file.Delete();
                    return ts;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        protected override IQueryable<ToraSubject> ApplyQuery(IQueryable<ToraSubject> query)
        {
            var type = GetQueryString<string>("type");

            if (type == "getAllById")
            {
                var id = GetQueryString<int>("id");
                query = query.Where(ts => ts.FkToraObjectId == id);
            }

            return query;
        }
    }
}
