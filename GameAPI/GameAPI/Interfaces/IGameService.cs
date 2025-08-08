using GameAPI.Enums;
using GameAPI.Models;

namespace GameAPI.Interfaces
{
    public interface IGameService
    {
        Task<Choice> GetRandomChoiceAsync(CancellationToken ct);
        PlayResponse PlayRound(Choice playerChoice, Choice computerChoice);
        List<ChoiceItem> GetChoices();
    }
}
