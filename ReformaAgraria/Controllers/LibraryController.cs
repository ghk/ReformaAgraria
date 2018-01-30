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
using ReformaAgraria.Models.ViewModels;
using ReformaAgraria.Helpers;

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
        public async Task<Library> Upload([FromForm]ImportLibraryViewModel model)
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

            return Delete(id);
        }        
    }
}
