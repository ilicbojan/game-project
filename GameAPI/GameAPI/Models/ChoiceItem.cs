namespace GameAPI.Models
{
    /// <summary>
    /// Represents a selectable choice in the game.
    /// </summary>
    public class ChoiceItem
    {
        /// <summary>
        /// The unique identifier for the choice (1=Rock, 2=Paper, 3=Scissors, 4=Lizard, 5=Spock).
        /// </summary>
        public int Id { get; set; }

        /// <summary>
        /// The name of the choice (e.g., "rock", "paper", "scissors", "lizard", "spock").
        /// </summary>
        public string Name { get; set; } = string.Empty;
    }
}
