using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public class ToraSubmission
    {
        public ToraSubmission()
        {

        }
        
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        
        public string Attachment { get; set; }
        
        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }
    }
}
