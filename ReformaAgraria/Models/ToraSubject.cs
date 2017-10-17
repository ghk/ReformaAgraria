using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class ToraSubject
    {
        public ToraSubject()
        {

        }
        
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [ForeignKey("ToraObject")]
        public int fkToraObjectId { get; set; }
        
        public string Name { get; set; }
       
        public MaritalStatus MaritalStatus { get; set; }

        public string Address { get; set; }

        public Gender Gender { get; set; }

        public int? Age { get; set; }

        public EducationalAttainment EducationalAttainment { get; set; }

        public int TotalFamilyMembers { get; set; }

        public string LandStatus { get; set; }

        public string LandLocation { get; set; }

        public double Size { get; set; }

        public string PlantTypes { get; set; }

        public string Notes { get; set; }

        public virtual ToraObject ToraObject { get; set; }
    }
}
