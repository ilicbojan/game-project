import { ChoiceId, ChoiceItem, ChoiceName, ResultType } from "../types/game";

export const ResultToColorMap: Record<ResultType, string> = {
  [ResultType.Win]: "green",
  [ResultType.Lose]: "red",
  [ResultType.Tie]: "orange",
};

export const ChoiceToEmojiMap: Record<string, string> = {
  rock: "✊", // Rock
  paper: "✋", // Paper
  scissors: "✌️", // Scissors
  lizard: "🦎", // Lizard
  spock: "🖖", // Spock
  random: "🎲", // Random choice
  "": "❓", // Unknown choice
};

const choiceItemMap: Record<string, ChoiceItem> = {
  rock: { id: ChoiceId.Rock, name: ChoiceName.Rock },
  paper: { id: ChoiceId.Paper, name: ChoiceName.Paper },
  scissors: { id: ChoiceId.Scissors, name: ChoiceName.Scissors },
  lizard: { id: ChoiceId.Lizard, name: ChoiceName.Lizard },
  spock: { id: ChoiceId.Spock, name: ChoiceName.Spock },
};

export function getChoiceItem(name: ChoiceName): ChoiceItem {
  return choiceItemMap[name];
}

export const formatDateTime = (d: Date) =>
  `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
