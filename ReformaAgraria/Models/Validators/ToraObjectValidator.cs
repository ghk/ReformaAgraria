using FluentValidation;

namespace ReformaAgraria.Models.Validators
{
    public class ToraObjectValidator : AbstractValidator<ToraObject>
    {
        public ToraObjectValidator()
        {
            RuleFor(t => t.Name).NotNull();
        }
    }
}