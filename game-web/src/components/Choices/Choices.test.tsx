import { render, screen, fireEvent } from "@testing-library/react";
import Choices from "../Choices/Choices";
import { ChoiceItem } from "../../types/game";

describe("Choices component", () => {
  const choicesMock: ChoiceItem[] = [
    { id: 1, name: "rock" },
    { id: 2, name: "paper" },
    { id: 3, name: "scissors" },
  ];

  const onChoiceClickMock = jest.fn();
  const onRandomClickMock = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("matches the snapshot", () => {
    const { asFragment } = render(
      <Choices
        choices={choicesMock}
        onChoiceClick={onChoiceClickMock}
        onRandomClick={onRandomClickMock}
        loadingChoices={false}
        loadingResult={false}
      />
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it("shows loading spinner when loadingChoices is true", () => {
    const { container } = render(
      <Choices
        choices={choicesMock}
        onChoiceClick={onChoiceClickMock}
        onRandomClick={onRandomClickMock}
        loadingChoices={true}
        loadingResult={false}
      />
    );
    const spinner = container.querySelector(".loading-spinner");

    expect(spinner).toBeInTheDocument();
  });

  it("renders all choice buttons", () => {
    render(
      <Choices
        choices={choicesMock}
        onChoiceClick={onChoiceClickMock}
        onRandomClick={onRandomClickMock}
        loadingChoices={false}
        loadingResult={false}
      />
    );

    choicesMock.forEach((choice) => {
      expect(screen.getByText(choice.name.toUpperCase())).toBeInTheDocument();
    });
  });

  it("renders the RANDOM button", () => {
    render(
      <Choices
        choices={choicesMock}
        onChoiceClick={onChoiceClickMock}
        onRandomClick={onRandomClickMock}
        loadingChoices={false}
        loadingResult={false}
      />
    );

    expect(screen.getByText("RANDOM")).toBeInTheDocument();
  });

  it("calls onClick handler with correct ID when a button is clicked", () => {
    render(
      <Choices
        choices={choicesMock}
        onChoiceClick={onChoiceClickMock}
        onRandomClick={onRandomClickMock}
        loadingChoices={false}
        loadingResult={false}
      />
    );

    const button = screen.getByText("ROCK");
    fireEvent.click(button);

    expect(onChoiceClickMock).toHaveBeenCalledTimes(1);
    expect(onChoiceClickMock).toHaveBeenCalledWith(1);
  });

  it("calls onRandomClick handler when RANDOM button is clicked", () => {
    render(
      <Choices
        choices={choicesMock}
        onChoiceClick={onChoiceClickMock}
        onRandomClick={onRandomClickMock}
        loadingChoices={false}
        loadingResult={false}
      />
    );

    const randomButton = screen.getByText("RANDOM");
    fireEvent.click(randomButton);

    expect(onRandomClickMock).toHaveBeenCalledTimes(1);
  });

  it("disables all buttons when loading is true", () => {
    render(
      <Choices
        choices={choicesMock}
        onChoiceClick={onChoiceClickMock}
        onRandomClick={onRandomClickMock}
        loadingChoices={false}
        loadingResult={true}
      />
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it("buttons are enabled when loading is false", () => {
    render(
      <Choices
        choices={choicesMock}
        onChoiceClick={onChoiceClickMock}
        onRandomClick={onRandomClickMock}
        loadingChoices={false}
        loadingResult={false}
      />
    );

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toBeEnabled();
    });
  });
});
