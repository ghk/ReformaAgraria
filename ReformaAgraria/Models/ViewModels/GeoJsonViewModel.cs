using System.Collections.Generic;

namespace ReformaAgraria.Models.ViewModels
{
    public class GeoJsonViewModel
    {
        public string type { get; set; }

        public object[] features { get; set; }
    }
}
