using FluentAssertions;
using GameAPI.Models;
using Microsoft.AspNetCore.Mvc.Testing;
using System.Net;
using System.Net.Http.Json;

namespace GameAPI.Tests.IntegrationTests
{
    public class GameControllerIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly HttpClient _client;
        private const string BaseUrl = "/api/game";
        private const string ChoicesEndpoint = BaseUrl + "/choices";
        private const string ChoiceEndpoint = BaseUrl + "/choice";
        private const string PlayEndpoint = BaseUrl + "/play";

        public GameControllerIntegrationTests(WebApplicationFactory<Program> factory)
        {
            _client = factory.CreateClient();
        }

        [Fact]
        public async Task GetChoices_WhenCalled_ReturnsAllChoices()
        {
            var response = await _client.GetAsync(ChoicesEndpoint);
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var choices = await response.Content.ReadFromJsonAsync<List<ChoiceItem>>();
            var expectedNames = new[] { "rock", "paper", "scissors", "lizard", "spock" };
            var expectedIds = new[] { 1, 2, 3, 4, 5 };

            choices.Should().NotBeNull();
            choices.Should().HaveCount(5);
            choices.Select(c => c.Name).Should().BeEquivalentTo(expectedNames);
            choices.Select(c => c.Id).Should().BeEquivalentTo(expectedIds);
        }

        [Fact]
        public async Task GetRandomChoice_WhenCalled_ReturnsValidChoice()
        {
            var response = await _client.GetAsync(ChoiceEndpoint);
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var choice = await response.Content.ReadFromJsonAsync<ChoiceItem>();

            choice.Should().NotBeNull();
            choice.Id.Should().BeInRange(1, 5);
            choice.Name.Should().NotBeNullOrEmpty();
        }

        [Fact]
        public async Task Play_WhenCalledWithValidPlayerChoice_ReturnsResult()
        {
            var playRequest = new PlayRequest { Player = 1 }; // Rock
            var response = await _client.PostAsJsonAsync(PlayEndpoint, playRequest);
            response.StatusCode.Should().Be(HttpStatusCode.OK);

            var playResponse = await response.Content.ReadFromJsonAsync<PlayResponse>();

            playResponse.Should().NotBeNull();
            playResponse.Player.Should().Be(1);
            playResponse.Computer.Should().BeInRange(1, 5);
            playResponse.Result.Should().Match(x => x == "win" || x == "lose" || x == "tie");
        }

        [Fact]
        public async Task Play_WhenCalledWithInvalidPlayerChoice_ReturnsBadRequest()
        {
            var playRequest = new PlayRequest { Player = 999 };

            var response = await _client.PostAsJsonAsync(PlayEndpoint, playRequest);

            response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        }
    }
}
