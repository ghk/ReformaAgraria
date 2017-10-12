using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public class ProposalOfActDocumentCheckList
    {
        public ProposalOfActDocumentCheckList()
        {

        }

        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Region")]
        public int fkRegionId { get; set; }

        public bool ListProposalFromCommunity { get; set; }

        public bool ListToraObject { get; set; }

        public bool MapOfToraObject { get; set; }

        public bool ListOfToraSubject { get; set; }

        public bool ListOfToraObjectForestArea { get; set; }

        public bool MapOfToraObjectForestArea { get; set; }

        public bool ListOfToraSubjectForestArea { get; set; }

        public bool ListOfPsObjectAndCustomaryForest { get; set; }

        public bool MapOfPsObjectAndCustomaryForest { get; set; }

        public bool ListOfPsSubjectAndCustomaryForest { get; set; }

        public virtual Region Region { get; set; }

    }
}
