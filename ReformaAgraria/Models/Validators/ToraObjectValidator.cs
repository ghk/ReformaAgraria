using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FluentValidation;
using FluentValidation.Internal;
using Newtonsoft.Json;

namespace ReformaAgraria.Models.Validators
{
    public class ToraObjectValidator: AbstractValidator<ToraObject>
    {        
        public ToraObjectValidator()
        {
            RuleFor(t => t.Name).NotNull();            
        }
    }
}
