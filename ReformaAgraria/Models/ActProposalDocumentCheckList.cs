using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class ActProposalDocumentCheckList: BaseEntity<int>
    {
        public ActProposalDocumentCheckList() { }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }
                
        public bool ProposalFromCommunityList { get; set; }

        public bool ToraObjectList { get; set; }

        public bool ToraObjectMap { get; set; }

        public bool ToraSubjectList { get; set; }

        public bool ToraObjectForestAreaList { get; set; }

        public bool ToraObjectForestAreaMap { get; set; }

        public bool ToraSubjectForestAreaList { get; set; }

        public bool PsObjectAndCustomaryForestList { get; set; }

        public bool PsObjectAndCustomaryForestMap { get; set; }

        public bool PsSubjectAndCustomaryForestList { get; set; }

        public string fkRegionId { get; set; }

        [ForeignKey("FkRegionId")]
        public Region Region { get; set; }

    }
}
