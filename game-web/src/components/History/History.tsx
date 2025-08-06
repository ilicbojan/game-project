import React from "react";
import { GameResult } from "../../types/game";
import "./History.css";
import { ChoiceToEmojiMap, ResultToColorMap } from "../../utils.ts/helpers";

interface Props {
  history: GameResult[];
}

const History: React.FC<Props> = ({ history }) => {
  return (
    <div className="history section">
      <h3>
        History <span>{history.length} / 10</span>
      </h3>
      <ul>
        {history.slice(0, 10).map((item, index) => (
          <li key={index}>
            <span className="history-date">
              {item.date.toLocaleDateString()} {item.date.toLocaleTimeString()}{" "}
              |{" "}
            </span>
            You chose{" "}
            <span className="history-player">
              {item.player} {ChoiceToEmojiMap[item.player]}
            </span>
            , computer chose{" "}
            <span className="history-computer">
              {item.computer} {ChoiceToEmojiMap[item.computer]}
            </span>{" "}
            →{" "}
            <span
              className="history-result"
              style={{ color: ResultToColorMap[item.result] }}
            >
              {item.result}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default History;
