using Microsoft.AspNetCore.Http;

namespace ReformaAgraria.Models.ViewModels
{
    public class UploadToraDocumentViewModel
    {
        public string RegionId { get; set; }
        public IFormFile File { get; set; }
    }
}