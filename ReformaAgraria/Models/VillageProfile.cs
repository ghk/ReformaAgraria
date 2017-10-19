using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class VillageProfile: BaseEntity<int>
    {
        public VillageProfile() { }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }

        public string History { get; set; }
                
        public string Potential { get; set; }
                
        public string TenurialCondition { get; set; }
        
        public string FkRegionId { get; set; }

        [ForeignKey("FkRegionId")]
        public Region Region { get; set; }
    }
}
