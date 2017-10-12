using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public enum TypeOfLand
    {
        FLAT = 0,
        SLOPING = 1,
        HILL = 2,
        MOUNTAIN = 3
    }
}
