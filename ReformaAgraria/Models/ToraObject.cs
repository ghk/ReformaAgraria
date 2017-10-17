using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class ToraObject
    {
        public ToraObject()
        {

        }
        
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Region")]
        public int fkRegionId { get; set; }
        
        public double Size { get; set; }
       
        public string TotalTenants { get; set; }

        public RegionalStatus RegionalStatus { get; set; }

        public LandType LandType { get; set; }

        public string Livelihood { get; set; }

        public ProposedTreatment ProposedTreatment { get; set; }

        public LandStatus LandStatus { get; set; }

        public string LandTenureHistory { get; set; }

        public virtual Region Region { get; set; }
    }
}
