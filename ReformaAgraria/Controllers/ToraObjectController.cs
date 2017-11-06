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

namespace ReformaAgraria.Controllers
{
    [Route("api/[controller]")]
    public class ToraObjectController : CrudController<ToraObject, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _contextAccessor;

        public ToraObjectController(ReformaAgrariaDbContext dbContext, IHostingEnvironment hostingEnvironment, IHttpContextAccessor contextAccessor) : base(dbContext)
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
        public ToraObject Import()
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
                    ToraObject to = new ToraObject();

                    to.Name = worksheet.Cells[3, 4].Value.ToString();
                    to.Size = worksheet.Cells[7, 4].Value != null ? Int32.Parse(worksheet.Cells[7, 4].Value.ToString()) : 0;
                    to.TotalTenants = worksheet.Cells[8, 4].Value.ToString();
                    to.RegionalStatus = worksheet.Cells[9, 4].Value.ToString();
                    to.LandType = worksheet.Cells[10, 4].Value.ToString();
                    to.Livelihood = worksheet.Cells[11, 4].Value.ToString();
                    to.ProposedTreatment = worksheet.Cells[12, 4].Value.ToString();
                    to.LandStatus = worksheet.Cells[14, 4].Value.ToString();

                    Post(to);

                    //ToraSubjectController ts = new ToraSubjectController();
                    //ts.Import(file, to.Id);
                    file.Delete(); 
                    return to;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        
        protected override IQueryable<ToraObject> ApplyQuery(IQueryable<ToraObject> query)
        {
            var type = GetQueryString<string>("type");

            if (type == "getAllById")
            {
                var id = GetQueryString<string>("id");
                query = query.Where(to => to.FkRegionId == id);
            }
            
            return query;
        }
    }
}
