using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public enum StageOfToraSettingProcess
    {
        IDENTIFICATION = 0,
        DELIBERATION_WITHIN_VILLAGE = 1,
        DELIBERATION_AMONG_VILLAGES = 2,
        COORDINATION_MEETING_RA_TASK_FORCE = 3,
        PROPOSAL_OF_OBJECT_SUBJECT_TORA_ACT = 4,
        PUBLICATION_OF_PERMISSION_FROM_ATRBPN_OR_LHK = 4
    }
}
