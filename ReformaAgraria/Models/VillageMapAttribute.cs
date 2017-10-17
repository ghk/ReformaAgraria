using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class VillageMapAttribute
    {
        public VillageMapAttribute()
        {

        }

        [Required]
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [ForeignKey("Region")]
        public int fkRegionId { get; set; }

        public string Coordinate { get; set; }

        public double Size { get; set; }

        public BorderSettingProcessStage BorderSettingProcessStage { get; set; }

        public Status BorderSettingStatus { get; set; }

        public string Attachment { get; set; }
        
        public virtual Region Region { get; set; }

    }
}
