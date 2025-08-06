import api from "./agent";
import { ChoiceItem, PlayRequest, PlayResponse } from "../types/game";

const GameApi = {
  getChoices: async (): Promise<ChoiceItem[]> => {
    const response = await api.get<ChoiceItem[]>("/game/choices");

    if (!response.data) {
      throw new Error("No choices returned from the API");
    }

    return response.data;
  },

  getRandomChoice: async (): Promise<ChoiceItem> => {
    const response = await api.get<ChoiceItem>("/game/choice");

    if (!response.data) {
      throw new Error("No choice returned from the API");
    }

    return response.data;
  },

  play: async (data: PlayRequest): Promise<PlayResponse> => {
    const response = await api.post<PlayResponse>("/game/play", data);

    if (!response.data) {
      throw new Error("No play response returned from the API");
    }

    return response.data;
  },
};

export default GameApi;
