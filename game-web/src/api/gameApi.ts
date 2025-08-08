import api from "./agent";
import { ChoiceItem, PlayRequest, PlayResponse } from "../types/game";

const GameApi = {
  getChoices: async (): Promise<ChoiceItem[]> => {
    const res = await api.get<ChoiceItem[]>("/game/choices");
    return res.data;
  },

  getRandomChoice: async (): Promise<ChoiceItem> => {
    const res = await api.get<ChoiceItem>("/game/choice");
    return res.data;
  },

  play: async (data: PlayRequest): Promise<PlayResponse> => {
    const res = await api.post<PlayResponse>("/game/play", data);
    return res.data;
  },
};

export default GameApi;
