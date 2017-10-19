using MicrovacWebCore;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ReformaAgraria.Models
{
    public class Region: BaseEntity<string>
    {
        public Region() { }
        
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public override string Id { get; set; }

        [Required]
        public string Name { get; set; }

        public RegionType Type { get; set; }

        public bool IsKelurahan { get; set; }

        public int? FkParentId { get; set; }

        [ForeignKey("FkParentId")]
        public Region Parent { get; set; }
    }
}
