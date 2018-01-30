using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models.ViewModels
{
    public class UploadLibraryViewModel
    {
        public string Title { get; set; }
        public IFormFile File { get; set; }
    }
}
