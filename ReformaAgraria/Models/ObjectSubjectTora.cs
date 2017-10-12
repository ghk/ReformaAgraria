using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public class ObjectSubjectTora
    {
        public ObjectSubjectTora()
        {

        }
        
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [ForeignKey("Region")]
        public int fkRegionId { get; set; }

        public int Field { get; set; }
        
        public double Size { get; set; }

        public string Subject { get; set; }

        public string NIK { get; set; }
        
        public string ListOfTenants { get; set; }
        
        public string Livelihood { get; set; }

        public RegionType Administrative { get; set; }

        public double SizeOfHPT { get; set; }

        public double SizeOfHP { get; set; }

        public double SizeOfHPK { get; set; }

        public double SizeOfHL { get; set; }

        public double SizeOfAPL { get; set; }
        
        public string Concession { get; set; }

        public string ResumeOfCase { get; set; }

        public string Notes { get; set; }

        public Status Status { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public virtual Region Region { get; set; }
    }
}
