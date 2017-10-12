using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public enum StageOfBorderSettingProcess
    {
        IDENTIFICATION = 0,
        DELIBERATION_WITHIN_VILLAGE = 1,
        DELIBERATION_AMONG_VILLAGES = 2,
        COORDINATION_MEETING_BORDER_SETTING_ACT_TEAM = 3,
        BORDER_SETTING_ACT_FROM_REGENT = 4
    }
}
