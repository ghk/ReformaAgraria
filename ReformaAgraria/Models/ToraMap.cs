using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class ToraMap : BaseEntity<int>
    {
        public ToraMap()
        {
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }

        public string Name { get; set; }

        [Column(TypeName = "jsonb")]
        public string Geojson { get; set; }

        public decimal Size { get; set; }

        public int FkToraObjectId { get; set; }

        public string FkRegionId { get; set; }

        [ForeignKey("FkToraObjectId")]
        public ToraObject ToraObject { get; set; }

        [ForeignKey("FkRegionId")]
        public Region Region { get; set; }
    }
}