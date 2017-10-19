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
        
        public string Title { get; set; }

        public string Agenda { get; set; }

        public RegionType RegionType { get; set; }

        public string Place { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string Notes { get; set; }
    }
}
