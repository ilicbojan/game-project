export interface ChoiceItem {
  id: number;
  name: string;
}

export interface PlayRequest {
  player: number;
}

export interface PlayResponse {
  player: number;
  computer: number;
  result: ResultType;
}

export interface GameResult {
  player: string;
  computer: string;
  result: ResultType;
  date: Date;
}

export interface Score {
  win: number;
  lose: number;
  tie: number;
}

export enum ResultType {
  Win = "win",
  Lose = "lose",
  Tie = "tie",
}

export enum ChoiceId {
  Rock = 1,
  Paper = 2,
  Scissors = 3,
  Lizard = 4,
  Spock = 5,
}

export enum ChoiceName {
  Rock = "rock",
  Paper = "paper",
  Scissors = "scissors",
  Lizard = "lizard",
  Spock = "spock",
}
