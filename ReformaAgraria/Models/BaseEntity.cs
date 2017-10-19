using MicrovacWebCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ReformaAgraria.Models
{
    public class BaseEntity<TId> : IModel<TId>, IAuditableEntity
    {
        public virtual TId Id { get; set; }

        public DateTime? DateCreated { get; set; }

        public DateTime? DateModified { get; set; }
    }

    public interface IAuditableEntity
    {
        DateTime? DateCreated { get; set; }

        DateTime? DateModified { get; set; }
    }
}
