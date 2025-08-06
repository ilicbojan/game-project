using FluentAssertions;
using GameAPI.Enums;
using GameAPI.Services;
using Microsoft.Extensions.Logging;
using System.Net;

namespace GameAPI.Tests.UnitTests
{
    public class GameServiceTests
    {
        private static ILogger<GameService> CreateFakeLogger()
        {
            return new LoggerFactory().CreateLogger<GameService>();
        }

        // GetChoices tests
        [Fact]
        public void GetChoices_ReturnsAllExpectedChoices()
        {
            var service = new GameService(new HttpClient(), CreateFakeLogger());
            var choices = service.GetChoices();
            var expectedNames = new[] { "rock", "paper", "scissors", "lizard", "spock" };
            var expectedIds = new[] { 1, 2, 3, 4, 5 };

            choices.Should().HaveCount(5);
            choices.Select(c => c.Name).Should().BeEquivalentTo(expectedNames);
            choices.Select(c => c.Id).Should().BeEquivalentTo(expectedIds);
        }

        // GetRandomChoiceAsync tests
        [Fact]
        public async Task GetRandomChoiceAsync_HttpError_ThrowsGameServiceException()
        {
            var handler = new MockHttpMessageHandler("{}", HttpStatusCode.InternalServerError);
            var httpClient = new HttpClient(handler);
            var service = new GameService(httpClient, CreateFakeLogger());

            var act = async () => await service.GetRandomChoiceAsync();
            await act.Should().ThrowAsync<GameServiceException>();
        }

        [Fact]
        public async Task GetRandomChoiceAsync_InvalidJson_ThrowsGameServiceException()
        {
            var handler = new MockHttpMessageHandler("not a json", HttpStatusCode.OK);
            var httpClient = new HttpClient(handler);
            var service = new GameService(httpClient, CreateFakeLogger());

            var act = async () => await service.GetRandomChoiceAsync();

            await act.Should().ThrowAsync<GameServiceException>();
        }

        [Fact]
        public async Task GetRandomChoiceAsync_ReturnsExpectedChoice()
        {
            var handler = new MockHttpMessageHandler("{\"random_number\": 7}", HttpStatusCode.OK);
            var httpClient = new HttpClient(handler);
            var service = new GameService(httpClient, CreateFakeLogger());

            var choice = await service.GetRandomChoiceAsync();

            // Assert: 7 % 5 = 2, so choiceId = 3 (Scissors)
            choice.Should().Be(Choice.Scissors);
        }

        // PlayRound tests
        [Fact]
        public void PlayRound_InvalidPlayerChoice_ThrowsArgumentException()
        {
            var service = new GameService(new HttpClient(), CreateFakeLogger());
            var act = () => service.PlayRound((Choice)999, Choice.Rock);

            act.Should().Throw<ArgumentException>();
        }

        [Fact]
        public void PlayRound_InvalidComputerChoice_ThrowsArgumentException()
        {
            var service = new GameService(new HttpClient(), CreateFakeLogger());
            var act = () => service.PlayRound(Choice.Rock, (Choice)999);

            act.Should().Throw<ArgumentException>();
        }

        // Win cases
        [Theory]
        [InlineData(Choice.Rock, Choice.Scissors)]
        [InlineData(Choice.Rock, Choice.Lizard)]
        [InlineData(Choice.Paper, Choice.Rock)]
        [InlineData(Choice.Paper, Choice.Spock)]
        [InlineData(Choice.Scissors, Choice.Paper)]
        [InlineData(Choice.Scissors, Choice.Lizard)]
        [InlineData(Choice.Lizard, Choice.Spock)]
        [InlineData(Choice.Lizard, Choice.Paper)]
        [InlineData(Choice.Spock, Choice.Scissors)]
        [InlineData(Choice.Spock, Choice.Rock)]
        public void PlayRound_PlayerShouldWin_ReturnsWin(Choice player, Choice computer)
        {
            var service = new GameService(new HttpClient(), CreateFakeLogger());
            var result = service.PlayRound(player, computer);

            result.Result.Should().Be("win");
            result.Player.Should().Be((int)player);
            result.Computer.Should().Be((int)computer);
        }

        // Lose cases
        [Theory]
        [InlineData(Choice.Scissors, Choice.Rock)]
        [InlineData(Choice.Lizard, Choice.Rock)]
        [InlineData(Choice.Rock, Choice.Paper)]
        [InlineData(Choice.Spock, Choice.Paper)]
        [InlineData(Choice.Paper, Choice.Scissors)]
        [InlineData(Choice.Lizard, Choice.Scissors)]
        [InlineData(Choice.Spock, Choice.Lizard)]
        [InlineData(Choice.Paper, Choice.Lizard)]
        [InlineData(Choice.Scissors, Choice.Spock)]
        [InlineData(Choice.Rock, Choice.Spock)]
        public void PlayRound_PlayerShouldLose_ReturnsLose(Choice player, Choice computer)
        {
            var service = new GameService(new HttpClient(), CreateFakeLogger());
            var result = service.PlayRound(player, computer);

            result.Result.Should().Be("lose");
            result.Player.Should().Be((int)player);
            result.Computer.Should().Be((int)computer);
        }

        // Tie cases
        [Theory]
        [InlineData(Choice.Rock, Choice.Rock)]
        [InlineData(Choice.Paper, Choice.Paper)]
        [InlineData(Choice.Scissors, Choice.Scissors)]
        [InlineData(Choice.Lizard, Choice.Lizard)]
        [InlineData(Choice.Spock, Choice.Spock)]
        public void PlayRound_PlayerAndComputerTie_ReturnsTie(Choice player, Choice computer)
        {
            var service = new GameService(new HttpClient(), CreateFakeLogger());
            var result = service.PlayRound(player, computer);

            result.Result.Should().Be("tie");
            result.Player.Should().Be((int)player);
            result.Computer.Should().Be((int)computer);
        }
    }

    public class MockHttpMessageHandler : HttpMessageHandler
    {
        private readonly string _response;
        private readonly HttpStatusCode _statusCode;

        public MockHttpMessageHandler(string response, HttpStatusCode statusCode)
        {
            _response = response;
            _statusCode = statusCode;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var message = new HttpResponseMessage(_statusCode)
            {
                Content = new StringContent(_response)
            };

            return Task.FromResult(message);
        }
    }
}
