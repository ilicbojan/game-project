import { useEffect, useState } from "react";
import GameApi from "../../api/gameApi";
import {
  ChoiceItem,
  GameResult,
  PlayRequest,
  PlayResponse,
  Score,
} from "../../types/game";
import { loadFromStorage, saveToStorage } from "../../utils.ts/storage";
import Choices from "../Choices/Choices";
import Result from "../Result/Result";
import Scoreboard from "../Scoreboard/Scoreboard";
import History from "../History/History";
import Info from "../Info/Info";
import "./Game.css";
import { toast } from "react-toastify";

const Game = () => {
  const [choices, setChoices] = useState<ChoiceItem[]>([]);
  const [result, setResult] = useState<PlayResponse | null>(null);
  const [loadingChoices, setLoadingChoices] = useState(false);
  const [loadingResult, setLoadingResult] = useState(false);
  const [score, setScore] = useState<Score>(
    loadFromStorage("score", { win: 0, lose: 0, tie: 0 })
  );
  const [history, setHistory] = useState<GameResult[]>(
    loadFromStorage("history", [])
  );

  useEffect(() => {
    setLoadingChoices(true);
    GameApi.getChoices()
      .then(setChoices)
      .catch(() => {})
      .finally(() => setLoadingChoices(false));
  }, []);

  const handlePlay = async (choiceId: number) => {
    setLoadingResult(true);
    setResult(null);

    try {
      const request: PlayRequest = { player: choiceId };
      const response = await GameApi.play(request);
      setResult(response);

      const playerName =
        choices.find((c) => c.id === response.player)?.name || "";
      const computerName =
        choices.find((c) => c.id === response.computer)?.name || "";

      const updatedScore = { ...score };
      updatedScore[response.result as keyof Score] += 1;
      setScore(updatedScore);
      saveToStorage("score", updatedScore);

      const newHistory: GameResult = {
        player: playerName,
        computer: computerName,
        result: response.result,
        date: new Date(),
      };

      // Remove the oldest entry if there is 10 already
      let trimmedHistory = history;
      if (history.length >= 10) {
        trimmedHistory = history.slice(0, 9);
      }
      const updatedHistory = [newHistory, ...trimmedHistory];
      setHistory(updatedHistory);
      saveToStorage("history", updatedHistory);
    } catch (error) {
    } finally {
      setLoadingResult(false);
    }
  };

  const handleRandomChoice = async () => {
    setLoadingResult(true);
    setResult(null);

    try {
      const randomChoice = await GameApi.getRandomChoice();
      if (randomChoice) {
        await handlePlay(randomChoice.id);
      }
    } catch (error) {
    } finally {
      setLoadingResult(false);
    }
  };

  const handleReset = () => {
    setHistory([]);
    setScore({ win: 0, lose: 0, tie: 0 });
    setResult(null);
    saveToStorage("score", { win: 0, lose: 0, tie: 0 });
    saveToStorage("history", []);
  };

  return (
    <div className="game">
      <Info handleReset={handleReset} />
      <Choices
        choices={choices}
        onChoiceClick={handlePlay}
        onRandomClick={handleRandomChoice}
        loadingChoices={loadingChoices}
        loadingResult={loadingResult}
      />
      <div className="game-results">
        <Result result={result} choices={choices} loading={loadingResult} />
        <Scoreboard score={score} />
      </div>
      <History history={history} />
    </div>
  );
};

export default Game;
