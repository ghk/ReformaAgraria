using Microsoft.AspNetCore.Http;

namespace ReformaAgraria.Models.ViewModels
{
    public class UploadToraMapViewModel
    {
        public int ToraObjectId { get; set; }
        public IFormFile File { get; set; }
    }
}