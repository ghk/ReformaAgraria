using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public class WorkCalendar
    {
        public WorkCalendar()
        {

        }
        
        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public string Id { get; set; }
        
        public string TitleOfActivity { get; set; }

        public string AgendaOfActivity { get; set; }

        public RegionType ImplementationOfActivity { get; set; }

        public string Place { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string Notes { get; set; }
        
        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }
    }
}
