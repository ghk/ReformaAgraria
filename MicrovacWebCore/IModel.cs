using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MicrovacWebCore
{
    public interface IModel<TId>
    {
        TId Id { get; set; }
    }
}
