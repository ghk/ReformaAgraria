using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public enum RegionType
    {
        NATIONAL = 0,
        PROVINCE = 1,
        REGENCY = 2,
        DISTRICT = 3,
        VILLAGE = 4
    }
}
