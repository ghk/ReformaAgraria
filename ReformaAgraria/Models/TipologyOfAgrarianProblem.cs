using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

        public bool LandTenureHistoryDataCheckList { get; set; }

        public string LocationCoordinate { get; set; }

        public int ContactPerson { get; set; }

        public LandType LandType { get; set; }

        public double HabitationSize { get; set; }

        public double PaddyFieldSize { get; set; }

        public double GardenSize { get; set; }

        public double FieldSize { get; set; }

        public double FarmSize { get; set; }

        public double ForestSize { get; set; }

        public double MereSize { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public virtual Region Region { get; set; }

    }
}
