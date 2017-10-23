using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class MeetingMinute: BaseEntity<int>
    {
        public MeetingMinute() { }
        
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }
              
        public string Description { get; set; }
        
        public string Attachment { get; set; }

        public List<MeetingAttendee> MeetingAttendees { get; set; }

        public int FkEventId { get; set; }

        [ForeignKey("FkEventId")]
        public Event Event { get; set; }
    }
}
