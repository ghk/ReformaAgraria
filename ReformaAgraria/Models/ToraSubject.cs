using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class ToraSubject: BaseEntity<int>
    {
        public ToraSubject() { }
        
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }

        public string Name { get; set; }
       
        public MaritalStatus MaritalStatus { get; set; }

        public string Address { get; set; }

        public Gender Gender { get; set; }

        public int? Age { get; set; }

        public EducationalAttainment EducationalAttainment { get; set; }

        public int TotalFamilyMembers { get; set; }

        public string LandStatus { get; set; }

        public string LandLocation { get; set; }

        public decimal Size { get; set; }

        public string PlantTypes { get; set; }

        public string Notes { get; set; }

        public int FkToraObjectId { get; set; }

        [ForeignKey("FkToraObjectId")]
        public ToraObject ToraObject { get; set; }
    }
}
