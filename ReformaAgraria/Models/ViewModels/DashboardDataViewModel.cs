using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models.ViewModels
{
    public class DashboardDataViewModel
    {
        public Region Region { get; set; }
        public decimal TotalSize { get; set; }
        public int TotalToraObjects { get; set; }
        public int TotalToraSubjects { get; set; }
    }
}
