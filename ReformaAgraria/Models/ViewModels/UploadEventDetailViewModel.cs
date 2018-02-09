using Microsoft.AspNetCore.Http;

namespace ReformaAgraria.Models.ViewModels
{
    public class UploadEventDetailViewModel
    {
        public string EventId { get; set; }

        public string UploadType { get; set; }

        public IFormFile File { get; set; }
    }
}