using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class BaseLayers : BaseEntity<int>
    {
        public BaseLayers() { }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }

        public string Label { get; set; }

        public string Color { get; set; }
        
        public string Geojson { get; set; }
    }
}
