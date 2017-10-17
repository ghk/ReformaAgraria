using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class MeetingMinutes
    {
        public MeetingMinutes()
        {

        }
        
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }

        [ForeignKey("Event")]
        public int fkEventId { get; set; }

        public string ResultDescription { get; set; }
        
        public List<string> MeetingAttendees { get; set; }
        
        public string Attachment { get; set; }
        
        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public virtual Event Event { get; set; }
    }
}
