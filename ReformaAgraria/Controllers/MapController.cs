using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using MicrovacWebCore;
using ReformaAgraria.Models;
using Microsoft.AspNetCore.Http;               
using System.IO.Compression;

namespace ReformaAgraria.Controllers
{
    [Route("api/[controller]")]
    public class MapController : CrudController<ToraObject, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _contextAccessor;

        public MapController(ReformaAgrariaDbContext dbContext, IHostingEnvironment hostingEnvironment, IHttpContextAccessor contextAccessor) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _contextAccessor = contextAccessor;
        }
        
        [HttpPost("import")]
        public void Import()
        {
            var results = HttpContext.Request.ReadFormAsync().Result;
            var label = results["label"];
            var color = results["color"];
            var file = results.Files[0];
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "base_layer");

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            var filePath = Path.Combine(folderPath, file.FileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                file.CopyTo(stream);
            }
            



        }
    }
}
