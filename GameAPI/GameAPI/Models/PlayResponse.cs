namespace GameAPI.Models
{
    /// <summary>
    /// Represents the response returned after playing a round.
    /// </summary>
    public class PlayResponse
    {
        /// <summary>
        /// The result of the round: "win", "lose", or "tie".
        /// </summary>
        public string Result { get; set; } = string.Empty;

        /// <summary>
        /// The player's choice as an integer (1=Rock, 2=Paper, 3=Scissors, 4=Lizard, 5=Spock).
        /// </summary>
        public int Player { get; set; }

        /// <summary>
        /// The computer's choice as an integer (1=Rock, 2=Paper, 3=Scissors, 4=Lizard, 5=Spock).
        /// </summary>
        public int Computer { get; set; }
    }
}
