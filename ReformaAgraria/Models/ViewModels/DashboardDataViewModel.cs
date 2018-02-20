namespace ReformaAgraria.Models.ViewModels
{
    public class DashboardDataViewModel
    {
        public Region Region { get; set; }
        public decimal TotalSize { get; set; }
        public int TotalToraObjects { get; set; }
        public int TotalToraSubjects { get; set; }

        public int TotalProposedObjects { get; set; }

        public int TotalVerifiedObjects { get; set; }

        public int TotalActualizedObjects { get; set; }
    }
}