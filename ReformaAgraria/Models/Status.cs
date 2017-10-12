using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public enum Status
    {
        PROPOSAL = 0,
        VERIFICATION = 1,
        ACT = 2
    }
}
