using FluentValidation;
using GameAPI.Enums;
using GameAPI.Interfaces;
using GameAPI.Models;
using Microsoft.AspNetCore.Mvc;

namespace GameAPI.Controllers
{
    /// <summary>
    /// Handles game-related endpoints for Rock, Paper, Scissors, Lizard, Spock.
    /// </summary>
    [ApiController]
    [Route("api/game")]
    [Produces("application/json")]
    public class GameController : ControllerBase
    {
        private readonly IGameService _gameService;

        public GameController(IGameService gameService)
        {
            _gameService = gameService;
        }

        /// <summary>Gets all available choices for the game.</summary>
        /// <returns>List of choices with their IDs and names.</returns>
        [HttpGet("choices")]
        [ProducesResponseType(typeof(List<ChoiceItem>), StatusCodes.Status200OK)]
        public ActionResult<List<ChoiceItem>> GetChoices()
        {
            var choices = _gameService.GetChoices();

            return Ok(choices);
        }

        /// <summary>Gets a randomly generated choice for the computer.</summary>
        /// <returns>A random choice with its ID and name.</returns>
        [HttpGet("choice")]
        [ProducesResponseType(typeof(ChoiceItem), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status503ServiceUnavailable)]
        public async Task<ActionResult<ChoiceItem>> GetRandomChoice(CancellationToken ct)
        {
            var choice = await _gameService.GetRandomChoiceAsync(ct);
            var response = new ChoiceItem
            {
                Id = (int)choice,
                Name = choice.ToString().ToLowerInvariant()
            };

            return Ok(response);
        }

        /// <summary>Plays a round against the computer.</summary>
        /// <param name="request">The player's choice.</param>
        /// <param name="validator">Validator for the play request.</param>
        /// <returns>The result of the round, including both choices and the outcome.</returns>
        [HttpPost("play")]
        [Consumes("application/json")]
        [ProducesResponseType(typeof(PlayResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status400BadRequest)]
        [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status503ServiceUnavailable)]
        public async Task<ActionResult<PlayResponse>> Play(
            [FromBody] PlayRequest request,
            [FromServices] IValidator<PlayRequest> validator,
            CancellationToken ct)
        {
            var validationResult = await validator.ValidateAsync(request, ct);
            if (!validationResult.IsValid)
            {
                return BadRequest(validationResult.Errors.Select(e => e.ErrorMessage));
            }

            var playerChoice = (Choice)request.Player;
            var computerChoice = await _gameService.GetRandomChoiceAsync(ct);
            var result = _gameService.PlayRound(playerChoice, computerChoice);

            return Ok(result);
        }
    }
}
