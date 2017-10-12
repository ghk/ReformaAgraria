using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public enum ProposedTreatment
    {
        RELEASE_OF_FOREST_AREA = 0,
        CUSTOMARY_FOREST = 1,
        REDISTRIBUTION_OF_LAND = 2,
        LEGALISATION_OF_ASSETS = 3
    }
}
