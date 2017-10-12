﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public class Region
    {
        public Region()
        {

        }
        
        [Required]
        [Key]
        public int RegionId { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public RegionType Type { get; set; }
        
        [ForeignKey("Parent")]
        public int? fkParentId { get; set; }

        public DateTime DateCreated { get; set; }

        public DateTime DateModified { get; set; }

        public virtual Region Parent { get; set; }
    }
}
