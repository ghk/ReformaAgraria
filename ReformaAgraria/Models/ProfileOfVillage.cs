using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public class ProfileOfVillage
    {
        public ProfileOfVillage()
        {

        }

        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Region")]
        public int fkRegionId { get; set; }

        public string History { get; set; }
                
        public string Potential { get; set; }
                
        public string TenurialCondition { get; set; }
        
        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public virtual Region Region { get; set; }
    }
}
