import API from "./axios";

// ✅ GET all transports
export const getTransports = () => {
  return API.get("/transports/");
};

// ✅ CREATE transport
export const createTransport = (data: any) => {
  return API.post("/transports/", data);
};

// ✅ UPDATE transport
export const updateTransport = (id: number, data: any) => {
  return API.put(`/transports/${id}/`, data);
};

// ✅ DELETE transport
export const deleteTransport = (id: number) => {
  return API.delete(`/transports/${id}/`);
};

//GET Locations
export const getLocations = () => {
  return API.get("/transports/locations/");
};