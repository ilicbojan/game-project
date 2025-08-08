import React from "react";
import { ChoiceItem } from "../../types/game";
import "./Choices.css";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { ChoiceToEmojiMap } from "../../utils.ts/helpers";

interface Props {
  choices: ChoiceItem[];
  onChoiceClick: (id: number) => void;
  onRandomClick: () => void;
  loadingChoices: boolean;
  loadingResult: boolean;
}

const Choices: React.FC<Props> = ({
  choices,
  onChoiceClick,
  onRandomClick,
  loadingChoices,
  loadingResult,
}) => {
  return (
    <div className="choices section">
      <h3>Choose your option</h3>
      {loadingChoices && <LoadingSpinner />}
      {!loadingChoices && choices.length === 0 && <p>No choices available</p>}
      {!loadingChoices && choices.length > 0 && (
        <div className="choices-buttons">
          {choices.map((choice) => (
            <button
              key={choice.id}
              onClick={() => onChoiceClick(choice.id)}
              disabled={loadingResult}
            >
              <div>{choice.name.toUpperCase()}</div>
              <div>{ChoiceToEmojiMap[choice.name]}</div>
            </button>
          ))}
          <button onClick={onRandomClick} disabled={loadingResult}>
            <div>RANDOM</div>
            <div>{ChoiceToEmojiMap["random"]}</div>
          </button>
        </div>
      )}
    </div>
  );
};

export default Choices;
