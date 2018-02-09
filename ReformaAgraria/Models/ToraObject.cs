using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class ToraObject : BaseEntity<int>
    {
        public ToraObject()
        {
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }

        public string Name { get; set; }

        public decimal Size { get; set; }

        public int TotalSubjects { get; set; }

        public RegionalStatus RegionalStatus { get; set; }

        public string LandType { get; set; }

        public string Livelihood { get; set; }

        public string ProposedTreatment { get; set; }

        public LandStatus LandStatus { get; set; }

        public string LandTenureHistory { get; set; }

        public string ConflictChronology { get; set; }

        public string FormalAdvocacyProgress { get; set; }

        public string NonFormalAdvocacyProgress { get; set; }

        public Status Status { get; set; }

        public string FkRegionId { get; set; }

        [ForeignKey("FkRegionId")]
        public Region Region { get; set; }

        public List<ToraSubject> ToraSubjects { get; set; }
    }
}