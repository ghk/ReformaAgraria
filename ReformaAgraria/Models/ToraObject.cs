using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class ToraObject: BaseEntity<int>
    {
        public ToraObject() { }
        
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }

        public decimal Size { get; set; }
       
        public string TotalTenants { get; set; }

        public RegionalStatus RegionalStatus { get; set; }

        public LandType LandType { get; set; }

        public string Livelihood { get; set; }

        public ProposedTreatment ProposedTreatment { get; set; }

        public LandStatus LandStatus { get; set; }

        public string LandTenureHistory { get; set; }

        public string FkRegionId { get; set; }

        [ForeignKey("FkRegionId")]
        public virtual Region Region { get; set; }
    }
}
