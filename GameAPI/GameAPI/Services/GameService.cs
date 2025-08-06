using GameAPI.Enums;
using GameAPI.Interfaces;
using GameAPI.Models;
using System.Text.Json;

namespace GameAPI.Services
{
    public class GameService : IGameService
    {
        private const string RandomApiUrl = "https://codechallenge.boohma.com/random";
        private const string RandomNumberProperty = "random_number";

        private static readonly Dictionary<Choice, List<Choice>> _rules = new()
        {
            { Choice.Rock, new List<Choice> { Choice.Scissors, Choice.Lizard } },
            { Choice.Paper, new List<Choice> { Choice.Rock, Choice.Spock } },
            { Choice.Scissors, new List<Choice> { Choice.Paper, Choice.Lizard } },
            { Choice.Lizard, new List<Choice> { Choice.Spock, Choice.Paper } },
            { Choice.Spock, new List<Choice> { Choice.Scissors, Choice.Rock } }
        };

        private readonly HttpClient _httpClient;
        private readonly ILogger<GameService> _logger;

        public GameService(HttpClient httpClient, ILogger<GameService> logger)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        private static bool IsValidChoice(Choice choice) => Enum.IsDefined(typeof(Choice), choice);


        public List<ChoiceItem> GetChoices()
        {
            return Enum.GetValues(typeof(Choice))
                .Cast<Choice>()
                .Select(choice => new ChoiceItem
                {
                    Id = (int)choice,
                    Name = choice.ToString().ToLower()
                })
                .ToList();
        }

        public async Task<Choice> GetRandomChoiceAsync()
        {
            try
            {
                var response = await _httpClient.GetAsync(RandomApiUrl);
                response.EnsureSuccessStatusCode();

                using var stream = await response.Content.ReadAsStreamAsync();
                using var data = await JsonDocument.ParseAsync(stream);

                int random = data.RootElement.GetProperty(RandomNumberProperty).GetInt32();
                var choices = Enum.GetValues<Choice>();
                var choice = choices[random % choices.Length];

                if (!IsValidChoice(choice))
                    throw new InvalidOperationException($"Invalid choice: {choice}");

                return choice;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get random choice from external API.");
                throw new GameServiceException("Failed to get random choice.", ex);
            }
        }

        public PlayResponse PlayRound(Choice playerChoice, Choice computerChoice)
        {
            if (!IsValidChoice(playerChoice) || !IsValidChoice(computerChoice))
                throw new ArgumentException("Invalid choice value");

            var result = GameResult.Tie;

            if (playerChoice != computerChoice)
            {
                result = _rules[playerChoice].Contains(computerChoice)
                    ? GameResult.Win
                    : GameResult.Lose;
            }

            return new PlayResponse
            {
                Player = (int)playerChoice,
                Computer = (int)computerChoice,
                Result = result.ToString().ToLower()
            };
        }
    }

    public class GameServiceException : Exception
    {
        public GameServiceException(string message, Exception innerException)
            : base(message, innerException) { }
    }
}
