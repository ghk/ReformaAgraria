using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models.ViewModels
{
    public class UploadToraDocumentViewModel
    {
        public string RegionId { get; set; }
        public IFormFile File { get; set; }
    }
}
