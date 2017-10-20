using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MicrovacWebCore
{
    public interface IModel { }

    public interface IModel<TId>: IModel
    {
        TId Id { get; set; }
    }
}
