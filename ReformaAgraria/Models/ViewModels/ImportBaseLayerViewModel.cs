using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models.ViewModels
{
    public class ImportBaseLayerViewModel
    {
        public int Id { get; set; }
        public string Label { get; set; }
        public string Color { get; set; }
        public IFormFile File { get; set; }
    }
}
