using Microsoft.AspNetCore.Http;

namespace ReformaAgraria.Models.ViewModels
{
    public class UploadLibraryViewModel
    {
        public string Title { get; set; }
        public IFormFile File { get; set; }
    }
}