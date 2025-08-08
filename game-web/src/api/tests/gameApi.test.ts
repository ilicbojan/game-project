import GameApi from "../gameApi";
import api from "../agent";
import {
  ChoiceId,
  ChoiceItem,
  ChoiceName,
  PlayRequest,
  PlayResponse,
  ResultType,
} from "../../types/game";
import { getChoiceItem } from "../../utils.ts/helpers";

jest.mock("../agent");

const apiMocked = api as jest.Mocked<typeof api>;

describe("GameApi", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getChoices", () => {
    it("fetches choices from the API", async () => {
      const mockData: ChoiceItem[] = [
        getChoiceItem(ChoiceName.Rock),
        getChoiceItem(ChoiceName.Paper),
      ];

      apiMocked.get.mockResolvedValueOnce({ data: mockData });

      const result = await GameApi.getChoices();

      expect(api.get).toHaveBeenCalledWith("/game/choices");
      expect(result).toEqual(mockData);
    });
  });

  describe("getRandomChoice", () => {
    it("fetches a random choice from the API", async () => {
      const mockData: ChoiceItem = getChoiceItem(ChoiceName.Scissors);

      apiMocked.get.mockResolvedValueOnce({ data: mockData });

      const result = await GameApi.getRandomChoice();

      expect(api.get).toHaveBeenCalledWith("/game/choice");
      expect(result).toEqual(mockData);
    });
  });

  describe("play", () => {
    it("posts play request and returns result", async () => {
      const requestData: PlayRequest = {
        player: ChoiceId.Rock,
      };

      const responseMock: PlayResponse = {
        result: ResultType.Win,
        player: ChoiceId.Rock,
        computer: ChoiceId.Paper,
      };

      apiMocked.post.mockResolvedValueOnce({ data: responseMock });

      const result = await GameApi.play(requestData);

      expect(api.post).toHaveBeenCalledWith("/game/play", requestData);
      expect(result).toEqual(responseMock);
    });
  });
});
