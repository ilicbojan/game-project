import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from "@testing-library/react";
import Game from "./Game";
import GameApi from "../../api/gameApi";
import * as storage from "../../utils.ts/storage";

// Mock components to isolate logic
jest.mock("../Choices/Choices", () => ({
  __esModule: true,
  default: (props: { onChoiceClick: (id: number) => void }) => (
    <div data-testid="choices" onClick={() => props.onChoiceClick(1)}>
      Choices
    </div>
  ),
}));
jest.mock("../Result/Result", () => ({
  __esModule: true,
  default: () => <div data-testid="result">Result</div>,
}));
jest.mock("../Scoreboard/Scoreboard", () => ({
  __esModule: true,
  default: () => <div data-testid="scoreboard">Scoreboard</div>,
}));
jest.mock("../History/History", () => ({
  __esModule: true,
  default: () => <div data-testid="history">History</div>,
}));

// Mock API
jest.mock("../../api/gameApi");

const choicesMock = [
  { id: 1, name: "rock" },
  { id: 2, name: "paper" },
];

const playResponseMock = {
  player: 1,
  computer: 2,
  result: "win",
};

describe("Game component", () => {
  beforeEach(() => {
    (GameApi.getChoices as jest.Mock).mockResolvedValue(choicesMock);
    (GameApi.play as jest.Mock).mockResolvedValue(playResponseMock);
    jest
      .spyOn(storage, "loadFromStorage")
      .mockImplementation((key, fallback) => {
        if (key === "score") return { win: 0, lose: 0, tie: 0 };
        if (key === "history") return [];
        return fallback;
      });
    jest.spyOn(storage, "saveToStorage").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("matches snapshot", () => {
    const { asFragment } = render(<Game />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders correctly with all components", async () => {
    render(<Game />);

    expect(await screen.findByTestId("choices")).toBeInTheDocument();
    expect(screen.getByTestId("result")).toBeInTheDocument();
    expect(screen.getByTestId("scoreboard")).toBeInTheDocument();
    expect(screen.getByTestId("history")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /reset game/i })
    ).toBeInTheDocument();
  });

  it("calls GameApi.play and updates score and history", async () => {
    render(<Game />);

    const choices = await screen.findByTestId("choices");

    await fireEvent.click(choices);

    await waitFor(() => {
      expect(GameApi.play).toHaveBeenCalledWith({ player: 1 });
    });

    expect(storage.saveToStorage).toHaveBeenCalledWith("score", {
      win: 1,
      lose: 0,
      tie: 0,
    });

    expect(storage.saveToStorage).toHaveBeenCalledWith("history", [
      expect.objectContaining({
        date: expect.any(Date),
        player: "rock",
        computer: "paper",
        result: "win",
      }),
    ]);
  });

  it("resets the game when clicking reset", async () => {
    render(<Game />);

    act(() => {
      fireEvent.click(screen.getByText(/reset game/i));
    });

    expect(storage.saveToStorage).toHaveBeenCalledWith("score", {
      win: 0,
      lose: 0,
      tie: 0,
    });

    expect(storage.saveToStorage).toHaveBeenCalledWith("history", []);
  });
});
