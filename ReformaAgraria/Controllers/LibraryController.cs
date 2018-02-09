using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using MicrovacWebCore;
using ReformaAgraria.Helpers;
using ReformaAgraria.Models;
using ReformaAgraria.Models.ViewModels;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ReformaAgraria.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    //[Authorize(Policy = "Bearer")]
    public class LibraryController : CrudController<Library, int>
    {
        private readonly IHostingEnvironment _hostingEnvironment;
        private readonly IHttpContextAccessor _contextAccessor;
        private readonly ILogger<LibraryController> _logger;

        public LibraryController(ReformaAgrariaDbContext dbContext, IHostingEnvironment hostingEnvironment, IHttpContextAccessor contextAccessor, ILogger<LibraryController> logger) : base(dbContext)
        {
            _hostingEnvironment = hostingEnvironment;
            _contextAccessor = contextAccessor;
            _logger = logger;
        }

        [HttpPost("upload")]
        public async Task<Library> Upload([FromForm]UploadLibraryViewModel model)
        {
            var content = new Library
            {
                Title = model.Title,
                FileExtension = Path.GetExtension(model.File.FileName),
                DateCreated = DateTime.Now,
                DateModified = DateTime.Now
            };

            dbContext.Add(content);
            await dbContext.SaveChangesAsync();

            var webRootPath = Path.Combine(_hostingEnvironment.WebRootPath, "library");
            var destinationFile = Path.Combine(webRootPath, (content.Id.ToString() + "_" + content.Title + content.FileExtension));
            IOHelper.StreamCopy(destinationFile, model.File);

            return content;
        }

        [HttpDelete("delete/{id}")]
        public override int Delete(int id)
        {
            var webRootPath = Path.Combine(_hostingEnvironment.WebRootPath, "library");
            string fileName = id + "_";
            string[] Files = Directory.GetFiles(webRootPath);

            foreach (string file in Files)
            {
                if (file.Contains(fileName))
                {
                    System.IO.File.Delete(file);
                }
            }

            return base.Delete(id);
        }
    }
}