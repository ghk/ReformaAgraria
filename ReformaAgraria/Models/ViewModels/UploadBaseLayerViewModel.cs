using Microsoft.AspNetCore.Http;

namespace ReformaAgraria.Models.ViewModels
{
    public class UploadBaseLayerViewModel
    {
        public int Id { get; set; }
        public string Label { get; set; }
        public string Color { get; set; }
        public IFormFile File { get; set; }
    }
}