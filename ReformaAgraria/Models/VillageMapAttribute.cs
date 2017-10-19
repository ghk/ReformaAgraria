using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class VillageMapAttribute: BaseEntity<int>
    {
        public VillageMapAttribute() { }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public override int Id { get; set; }        

        public decimal Size { get; set; }

        public BorderSettingProcessStage BorderSettingProcessStage { get; set; }

        public Status BorderSettingStatus { get; set; }

        public string Attachment { get; set; }
        
        public int? FkCoordinateId { get; set; }

        [ForeignKey("FkCoordinateId")]
        public Coordinate Coordinate { get; set; }

        public string FkRegionId { get; set; }

        [ForeignKey("FkRegionId")]
        public Region Region { get; set; }

    }
}
