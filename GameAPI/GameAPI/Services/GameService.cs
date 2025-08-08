using System.Text.Json;
using System.Text.Json.Serialization;
using GameAPI.Enums;
using GameAPI.Interfaces;
using GameAPI.Models;

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
            _randomApiUrl = configuration["ExternalApi:RandomApiUrl"]
                ?? throw new ArgumentNullException("RandomApiUrl configuration is missing.");
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

        private sealed record RandomApiResponse([property: JsonPropertyName(RandomNumberProperty)] int? RandomNumber);

        public async Task<Choice> GetRandomChoiceAsync(CancellationToken ct = default)
        {
            try
            {
                var data = await _httpClient.GetFromJsonAsync<RandomApiResponse>(_randomApiUrl, cancellationToken: ct);
                if (data is null || data.RandomNumber is null)
                {
                    _logger.LogError("Random API returned null payload.");
                    throw new GameServiceException("Random API returned null payload.", new NullReferenceException(nameof(data)));
                }

                var choices = Enum.GetValues<Choice>();
                var index = Math.Abs(data.RandomNumber.Value) % choices.Length;

                return choices[index];
            }
            catch (OperationCanceledException oce) when (ct.IsCancellationRequested)
            {
                _logger.LogWarning(oce, "Random choice request canceled.");
                throw;
            }
            catch (JsonException ex)
            {
                _logger.LogError(ex, "Invalid JSON received from the random choice API.");
                throw new GameServiceException("Invalid JSON received from the random choice API.", ex);
            }
            catch (HttpRequestException ex)
            {
                // Polly already retried; this is the terminal failure
                _logger.LogError(ex, "Failed to get random choice after retries.");
                throw new GameServiceException("Failed to get random choice after retries.", ex);
            }
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
                Result = result.ToString().ToLowerInvariant()
            };
        }
    }

    public class GameServiceException : Exception
    {
        public GameServiceException(string message, Exception innerException)
            : base(message, innerException) { }
    }
}
