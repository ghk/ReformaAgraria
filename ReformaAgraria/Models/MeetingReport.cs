using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public class MeetingReport
    {
        public MeetingReport()
        {

        }
        
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        
        public string NameOfActivity { get; set; }
        
        public DateTime Date { get; set; }
        
        public string Place { get; set; }
        
        public RegionType LevelOfMeeting { get; set; }
        
        public string AgendaOfDiscussion { get; set; }
        
        public string DescriptionOfResult { get; set; }
        
        public string ListOfParticipants { get; set; }
        
        public string Attachment { get; set; }
        
        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }
    }
}
