using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public enum Codefication
    {
        COMMUNITY_COMMUNITY = 0,
        COMMUNITY_NATION = 1,
        COMMUNITY_PRIVATE = 2,
        NATION_PRIVATE = 3
    }
}
