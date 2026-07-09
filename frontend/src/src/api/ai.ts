import api from "./axios";

export const searchTransportAI = (data: {
  source: string;
  destination: string;
  transport_type: "air" | "sea";
}) => {
  return api.post("/ai/search-transport/", data);
};