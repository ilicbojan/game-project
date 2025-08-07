using GameAPI.Enums;
using GameAPI.Interfaces;
using GameAPI.Models;
using System.Text.Json;

namespace GameAPI.Services
{
    public class GameService : IGameService
    {
        private readonly string _randomApiUrl;
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

        public GameService(HttpClient httpClient, ILogger<GameService> logger, IConfiguration configuration)
        {
            _httpClient = httpClient ?? throw new ArgumentNullException(nameof(httpClient));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _randomApiUrl = configuration["ExternalApi:RandomApiUrl"] ?? throw new ArgumentNullException("RandomApiUrl configuration is missing.");
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
            int maxRetries = 3;
            for (int attempt = 1; attempt <= maxRetries; attempt++)
            {
                try
                {
                    var response = await _httpClient.GetAsync(_randomApiUrl);
                    response.EnsureSuccessStatusCode();

                    using var stream = await response.Content.ReadAsStreamAsync();
                    using var data = await JsonDocument.ParseAsync(stream);
                    if (!data.RootElement.TryGetProperty(RandomNumberProperty, out var numEl))
                    {
                        _logger.LogError("JSON missing property '{RandomNumberProperty}'.", RandomNumberProperty);
                        throw new GameServiceException($"JSON missing '{RandomNumberProperty}'.", new Exception());
                    }

                    int random = data.RootElement.GetProperty(RandomNumberProperty).GetInt32();
                    var choices = Enum.GetValues<Choice>();
                    var choice = choices[random % choices.Length];

                    return choice;
                }
                catch (HttpRequestException ex) when (attempt < maxRetries)
                {
                    _logger.LogWarning(ex, "Attempt {Attempt} failed to get random choice. Retrying...", attempt);
                }
                catch (HttpRequestException ex) when (attempt == maxRetries)
                {
                    _logger.LogError(ex, "Failed to get random choice after {MaxRetries} attempts.", maxRetries);
                    throw new GameServiceException("Failed to get random choice after multiple attempts.", ex);
                }
                catch (JsonException ex)
                {
                    _logger.LogError(ex, "Invalid JSON received from the random choice API.");
                    throw new GameServiceException("Invalid JSON received from the random choice API.", ex);
                }
            }

            _logger.LogError("Unexpected error in GetRandomChoiceAsync.");
            throw new GameServiceException("Unexpected error in GetRandomChoiceAsync.", new Exception("No inner exception."));
        }

        public PlayResponse PlayRound(Choice playerChoice, Choice computerChoice)
        {
            if (!IsValidChoice(playerChoice) || !IsValidChoice(computerChoice))
            {
                _logger.LogError("Invalid choice: Player - {PlayerChoice}, Computer - {ComputerChoice}", playerChoice, computerChoice);
                throw new ArgumentException("Invalid choice value");
            }

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
