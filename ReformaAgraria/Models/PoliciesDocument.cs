using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class PoliciesDocument: BaseEntity<int>
    {
        public PoliciesDocument() { }
        
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }
        
        public string Title { get; set; }
                
        public string Attachment { get; set; }
    }
}
