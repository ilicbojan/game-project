import { render, screen } from "@testing-library/react";
import { Score } from "../../types/game";
import Scoreboard from "./Scoreboard";

describe("Scoreboard", () => {
  const scoreMock: Score = {
    win: 3,
    lose: 1,
    tie: 2,
  };

  it("matches the snapshot", () => {
    const { asFragment } = render(<Scoreboard score={scoreMock} />);

    expect(asFragment()).toMatchSnapshot();
  });

  it("renders the score values correctly", () => {
    const { container } = render(<Scoreboard score={scoreMock} />);

    expect(screen.getByText("Scoreboard")).toBeInTheDocument();
    expect(screen.getByText(/Rounds played: 6/i)).toBeInTheDocument();

    expect(screen.getByText(/Wins:/)).toBeInTheDocument();
    expect(screen.getByText(/Losses:/)).toBeInTheDocument();
    expect(screen.getByText(/Ties:/)).toBeInTheDocument();

    expect(container.querySelector(".scoreboard-wins-value")?.textContent).toBe(
      "3"
    );
    expect(
      container.querySelector(".scoreboard-loses-value")?.textContent
    ).toBe("1");
    expect(container.querySelector(".scoreboard-ties-value")?.textContent).toBe(
      "2"
    );
  });
});
