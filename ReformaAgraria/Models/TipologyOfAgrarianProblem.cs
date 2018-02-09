using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class TipologyOfAgrarianProblem : BaseEntity<int>
    {
        public TipologyOfAgrarianProblem()
        {
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }

        public int TotalFamily { get; set; }

        public int TotalPeople { get; set; }

        public decimal Size { get; set; }

        public string MainProblem { get; set; }

        public Codefication Codefication { get; set; }

        public ProposedTreatment ProposedTreatment { get; set; }

        public bool IndividualSubjectDataCheckList { get; set; }

        public bool CommunalSubjectDataCheckList { get; set; }

        public bool ObjectDataCheckList { get; set; }

        public bool LandTenureHistoryDataCheckList { get; set; }

        public string ContactPerson { get; set; }

        public LandType LandType { get; set; }

        public decimal ProposedSize { get; set; }

        public decimal HabitationSize { get; set; }

        public decimal PaddyFieldSize { get; set; }

        public decimal GardenSize { get; set; }

        public decimal FieldSize { get; set; }

        public decimal FarmSize { get; set; }

        public decimal ForestSize { get; set; }

        public decimal MereSize { get; set; }

        public int? FkCoordinateId { get; set; }

        [ForeignKey("FkCoordinateId")]
        public Coordinate Coordinate { get; set; }

        public string FkRegionId { get; set; }

        [ForeignKey("FkRegionId")]
        public Region Region { get; set; }
    }
}