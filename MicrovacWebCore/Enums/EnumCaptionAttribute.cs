using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MicrovacWebCore.Enums
{
    public class EnumCaptionAttribute: ClientEnumAttribute
    {
        public EnumCaptionAttribute(string value)
        {
            Value = value;
        }
    }
}
