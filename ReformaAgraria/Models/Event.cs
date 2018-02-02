using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class Event: BaseEntity<int>
    {
        public Event() { }
        
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }        

        public string Description { get; set; }                

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string FkRegionId { get; set; }

        public string ResultDescription { get; set; }

        public string Attendees { get; set; }

        [ForeignKey("FkRegionId")]
        public Region Region { get; set; }

        public string FkEventTypeId { get; set; }

        [ForeignKey("FkEventTypeId")]
        public EventType EventType { get; set; }
    }
}
