namespace GameAPI.Models
{
    /// <summary>
    /// Represents a request to play a round.
    /// </summary>
    public class PlayRequest
    {
        /// <summary>
        /// The player's choice as an integer (1=Rock, 2=Paper, 3=Scissors, 4=Lizard, 5=Spock).
        /// </summary>
        public int Player { get; set; }
    }
}
