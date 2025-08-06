import React from "react";
import { ChoiceItem, PlayResponse } from "../../types/game";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import "./Result.css";
import { ChoiceToEmojiMap, ResultToColorMap } from "../../utils.ts/helpers";

interface Props {
  result: PlayResponse | null;
  choices: ChoiceItem[];
  loading: boolean;
}

const Result: React.FC<Props> = ({ result, choices, loading }) => {
  const playerChoice = choices.find((c) => c.id === result?.player);
  const computerChoice = choices.find((c) => c.id === result?.computer);

  return (
    <div className="result section">
      <h3>Round Result</h3>
      {loading && <LoadingSpinner />}
      {!result && !loading && (
        <p>No result available, please choose your option</p>
      )}
      {result && (
        <div>
          <p>
            Your choice: <strong>{playerChoice?.name}</strong>{" "}
            {ChoiceToEmojiMap[playerChoice?.name || ""]}
          </p>
          <p>
            Computer&apos;s choice: <strong>{computerChoice?.name}</strong>
            {ChoiceToEmojiMap[computerChoice?.name || ""]}
          </p>
          <div className="result-details">
            Result:{" "}
            <span style={{ color: ResultToColorMap[result.result] }}>
              {result.result.toUpperCase()}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Result;
