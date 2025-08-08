import { render, screen } from "@testing-library/react";
import Result from "./Result";
import {
  ChoiceItem,
  ChoiceName,
  PlayResponse,
  ResultType,
} from "../../types/game";
import { getChoiceItem } from "../../utils.ts/helpers";

describe("Result component", () => {
  const choicesMock: ChoiceItem[] = [
    getChoiceItem(ChoiceName.Rock),
    getChoiceItem(ChoiceName.Paper),
    getChoiceItem(ChoiceName.Scissors),
  ];

  const resultMock: PlayResponse = {
    player: 1,
    computer: 2,
    result: ResultType.Lose,
  };

  it("matches the snapshot", () => {
    const { asFragment } = render(
      <Result result={resultMock} choices={choicesMock} loading={false} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it("renders LoadingSpinner when loading is true", () => {
    const { container } = render(
      <Result result={null} choices={choicesMock} loading={true} />
    );
    const spinner = container.querySelector(".loading-spinner");

    expect(spinner).toBeInTheDocument();
  });

  it("shows fallback message when result is null and loading is false", () => {
    render(<Result result={null} choices={choicesMock} loading={false} />);

    expect(
      screen.getByText(/No result available, please choose your option/i)
    ).toBeInTheDocument();
  });

  it("handles empty choices array gracefully", () => {
    render(<Result result={resultMock} choices={[]} loading={false} />);
    expect(screen.getByText(/Your choice:/i)).toBeInTheDocument();
    expect(screen.queryByText("rock")).not.toBeInTheDocument();
    expect(screen.getByText(/Computer's choice:/i)).toBeInTheDocument();
    expect(screen.queryByText("paper")).not.toBeInTheDocument();
  });

  it("handles invalid player or computer IDs in result", () => {
    const invalidResultMock: PlayResponse = {
      player: 99,
      computer: 100,
      result: ResultType.Lose,
    };
    render(
      <Result
        result={invalidResultMock}
        choices={choicesMock}
        loading={false}
      />
    );

    expect(screen.getByText(/Your choice:/i)).toBeInTheDocument();
    expect(screen.queryByText("rock")).not.toBeInTheDocument();
    expect(screen.getByText(/Computer's choice:/i)).toBeInTheDocument();
    expect(screen.queryByText("paper")).not.toBeInTheDocument();
  });

  it("displays result when result is provided", () => {
    render(
      <Result result={resultMock} choices={choicesMock} loading={false} />
    );

    expect(screen.getByText(/Your choice:/i)).toBeInTheDocument();
    expect(screen.getByText("rock")).toBeInTheDocument();
    expect(screen.getByText(/Computer's choice:/i)).toBeInTheDocument();
    expect(screen.getByText("paper")).toBeInTheDocument();
    expect(screen.getByText(/Result:/i)).toBeInTheDocument();
    expect(screen.getByText("LOSE")).toBeInTheDocument();
  });
});
