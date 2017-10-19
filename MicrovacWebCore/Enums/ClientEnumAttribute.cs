using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MicrovacWebCore.Enums
{
    public class ClientEnumAttribute: Attribute
    {
        public object Value { get; set; }
    }
}
