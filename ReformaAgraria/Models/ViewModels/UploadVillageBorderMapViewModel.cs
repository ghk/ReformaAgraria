using Microsoft.AspNetCore.Http;

namespace ReformaAgraria.Models.ViewModels
{
    public class UploadVillageBorderMapViewModel
    {
        public string RegionId { get; set; }
        public IFormFile File { get; set; }
    }
}