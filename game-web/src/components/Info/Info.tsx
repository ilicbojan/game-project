import React from "react";
import { useState } from "react";
import "./Info.css";

interface Props {
  handleReset: () => void;
}

const Info: React.FC<Props> = ({ handleReset }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="info section">
      <div className="info-header">
        <h3>Game Info</h3>
        <div className="info-buttons">
          <button
            onClick={() => setOpen((prev) => !prev)}
            aria-expanded={open}
            aria-controls="info-content"
            className="info-accordion-toggle"
          >
            {open ? "Hide" : "Show More"}
          </button>
          <button className="info-reset-button" onClick={handleReset}>
            Reset Game 🔃
          </button>
        </div>
      </div>
      {open && (
        <div id="info-content">
          <h4>Rock Paper Scissors Lizard Spock Game</h4>
          <p>
            Welcome to the game! Choose your move wisely and try to outsmart
            your opponent.
          </p>
          <p>
            The game is simple: you can choose from Rock, Paper, Scissors,
            Lizard, Spock, or Random. Each choice has its own strengths and
            weaknesses against the others.
          </p>
          <p>The rules are as follows:</p>
          <img
            src="../../assets/rules.png"
            alt="Game Rules"
            className="info-rules-image"
          />
          <p>Good luck!</p>
        </div>
      )}
    </div>
  );
};

export default Info;
