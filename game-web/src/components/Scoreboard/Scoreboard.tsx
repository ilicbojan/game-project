import React from "react";
import { Score } from "../../types/game";
import "./Scoreboard.css";

interface Props {
  score: Score;
}

const Scoreboard: React.FC<Props> = ({ score }) => {
  return (
    <div className="scoreboard section">
      <h3>Scoreboard</h3>
      <div className="scoreboard-rounds">
        Rounds played: {score.win + score.lose + score.tie}
      </div>
      <div className="scoreboard-values">
        Wins: <span className="scoreboard-wins-value">{score.win}</span> |
        Losses: <span className="scoreboard-loses-value">{score.lose}</span> |
        Ties: <span className="scoreboard-ties-value">{score.tie}</span>
      </div>
    </div>
  );
};

export default Scoreboard;
