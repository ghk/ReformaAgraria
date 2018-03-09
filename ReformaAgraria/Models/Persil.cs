using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class Persil : BaseEntity<int>
    {
        public Persil()
        {
        }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }
        
        public Status Status { get; set; }

        public int? TotalSubject { get; set; }

        [Column(TypeName = "jsonb")]
        public string Geojson { get; set; }

        public decimal? TotalSize { get; set; }

        public string FkRegionId { get; set; }

        public int FkSchemeId { get; set; }

        [ForeignKey("FkRegionId")]
        public Region Region { get; set; }

        [ForeignKey("FkSchemeId")]
        public Scheme Scheme { get; set; }
    }
}