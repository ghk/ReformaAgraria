using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class ToraMap : BaseEntity<int>
    {
        public ToraMap() { }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }        
        
        public string Geojson { get; set; }

        public string FkRegionId { get; set; }

        [ForeignKey("FkRegionId")]
        public Region Region { get; set; }

    }
}
