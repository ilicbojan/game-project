using FluentValidation;
using GameAPI.Enums;
using GameAPI.Models;

namespace GameAPI.Validation
{
    public class PlayRequestValidator : AbstractValidator<PlayRequest>
    {
        public PlayRequestValidator()
        {
            RuleFor(request => request.Player)
                .Must(value => Enum.IsDefined(typeof(Choice), value))
                .WithMessage("Player choice must be a valid option.");
        }
    }
}
