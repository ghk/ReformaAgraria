using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using MicrovacWebCore;
using ReformaAgraria.Models;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;
using System.Net;
using System.Collections.Generic;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class LibraryController : CrudController<Library, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _contextAccessor;

        public LibraryController(ReformaAgrariaDbContext dbContext, IHostingEnvironment hostingEnvironment, IHttpContextAccessor contextAccessor) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _contextAccessor = contextAccessor;
        }

        [HttpPost("upload")]
        public async Task<Library> Upload()
        {
            var results = HttpContext.Request.ReadFormAsync().Result;
            var content = new Library
            {
                Title = results["title"],
                DateCreated = DateTime.Now,
                DateModified = DateTime.Now
            };
            var file = results.Files[0];
            content.FileExtension = '.' + file.FileName.Split('.')[1].ToString();
            
            dbContext.Add(content);
            await dbContext.SaveChangesAsync();

            var webRootPath = Path.Combine(_hostingEnvironment.WebRootPath, "library");
            ValidateAndCreateFolder(webRootPath);
            var destinationFile = Path.Combine(webRootPath, (content.Id.ToString() + "_" + content.Title + content.FileExtension));
            StreamCopy(destinationFile, file);

            return content;
        }

        [HttpPost("delete")]
        public void Delete()
        {
            var results = HttpContext.Request.ReadFormAsync().Result;
            var content = new Library
            {
                Id = Int32.Parse(results["id"])
            };
            var webRootPath = Path.Combine(_hostingEnvironment.WebRootPath, "library");

            string fileName = content.Id + "_";
            string[] Files = Directory.GetFiles(webRootPath);

            foreach (string file in Files)
            {
                if (file.Contains(fileName))
                {
                    System.IO.File.Delete(file);
                }
            }

            Delete(content.Id);
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
