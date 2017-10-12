using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public class TipologyOfAgrarianProblem
    {
        public TipologyOfAgrarianProblem()
        {

        }

        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Region")]
        public int fkRegionId { get; set; }

        public int TotalFamily { get; set; }

        public int TotalPeople { get; set; }

        public double Size { get; set; }

        public string MainProblem { get; set; }

        public Codefication Codefication { get; set; }

        public ProposedTreatment ProposedTreatment { get; set; }

        public double ProposedSize { get; set; }

        public bool IndividualSubjectDataCheckList { get; set; }

        public bool CommunalSubjectDataCheckList { get; set; }

        public bool ObjectDataCheckList { get; set; }

        public bool HistoryOfLandTenureDataCheckList { get; set; }

        public string CoordinateOfLocation { get; set; }

        public int ContactPerson { get; set; }

        public TypeOfLand TypeOfLand { get; set; }

        public double SizeOfHabitation { get; set; }

        public double SizeOfPaddyField { get; set; }

        public double SizeOfGarden { get; set; }

        public double SizeOFField { get; set; }

        public double SizeOfFarm { get; set; }

        public double SizeOfForest { get; set; }

        public double SizeOfMere { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public virtual Region Region { get; set; }

    }
}
