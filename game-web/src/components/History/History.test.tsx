import { render, screen } from "@testing-library/react";
import { ChoiceName, GameResult, ResultType } from "../../types/game";
import History from "./History";
import { ResultToColorMap } from "../../utils.ts/helpers";

const dateStringMock = "1/1/2025 10:00:00 AM";
jest.mock("../../utils.ts/helpers", () => ({
  ...jest.requireActual("../../utils.ts/helpers"),
  formatDateTime: () => dateStringMock,
}));

describe("History component", () => {
  const dateMock = new Date(dateStringMock);
  const historyMock: GameResult[] = [
    {
      player: ChoiceName.Rock,
      computer: ChoiceName.Scissors,
      result: ResultType.Win,
      date: dateMock,
    },
    {
      player: ChoiceName.Paper,
      computer: ChoiceName.Spock,
      result: ResultType.Win,
      date: dateMock,
    },
    {
      player: ChoiceName.Lizard,
      computer: ChoiceName.Rock,
      result: ResultType.Lose,
      date: dateMock,
    },
    {
      player: ChoiceName.Rock,
      computer: ChoiceName.Rock,
      result: ResultType.Tie,
      date: dateMock,
    },
  ];

  it("matches the snapshot", () => {
    const { asFragment } = render(<History history={historyMock} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the History heading and counter", () => {
    render(<History history={historyMock} />);

    expect(screen.getByText("History")).toBeInTheDocument();
    expect(screen.getByText(`${historyMock.length} / 10`)).toBeInTheDocument();
  });

  it("renders nothing if history is empty", () => {
    render(<History history={[]} />);

    expect(screen.queryAllByRole("listitem")).toHaveLength(0);
  });

  it("renders all history items correctly", () => {
    render(<History history={historyMock} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(historyMock.length);

    // Verify the content of each list item
    listItems.forEach((item, index) => {
      const { player, computer, result } = historyMock[index];

      expect(item).toHaveTextContent(dateStringMock);
      expect(item).toHaveTextContent(`You: ${player}`);
      expect(item).toHaveTextContent(`Computer: ${computer}`);
      expect(item).toHaveTextContent(result);
    });
  });

  it("limits displayed items to 10", () => {
    const longHistory: GameResult[] = Array.from({ length: 15 }, (_, i) => ({
      player: `player${i}`,
      computer: `computer${i}`,
      result: i % 2 === 0 ? ResultType.Win : ResultType.Lose,
      date: new Date(),
    }));

    render(<History history={longHistory} />);

    expect(screen.getAllByRole("listitem")).toHaveLength(10);
  });

  it("applies correct color to result text", () => {
    render(<History history={historyMock} />);

    const results = screen.getAllByText(/win|lose|tie/i);
    results.forEach((result, index) => {
      const expectedColor = ResultToColorMap[historyMock[index].result];
      expect(result).toHaveStyle(`color: ${expectedColor}`);
    });
  });
});
