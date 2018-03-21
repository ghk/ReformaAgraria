using Microsoft.AspNetCore.Http;

namespace ReformaAgraria.Models.ViewModels
{
    public class EditPersilViewModel
    {
        public int PersilId { get; set; }

        public Status PersilStatus { get; set; }

        public int PersilTotalSize { get; set; }

        public int PersilTotalSubject { get; set; }

        public IFormFile File { get; set; }
    }
}