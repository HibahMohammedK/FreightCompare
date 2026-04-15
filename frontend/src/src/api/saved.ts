import API from "./axios";

// ✅ GET saved transports
export const getSavedTransports = () => {
  return API.get("/saved/saved-transports/");
};

// ✅ SAVE transport
export const saveTransport = (transportId: number) => {
  return API.post("/saved/saved-transports/", {
    transport: transportId,
  });
};

// ✅ UNSAVE transport
export const unsaveTransport = (id: number) => {
  return API.delete(`/saved/saved-transports/${id}/`);
};