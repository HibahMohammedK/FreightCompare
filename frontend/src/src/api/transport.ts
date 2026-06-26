import API from "./axios";

// ✅ GET all transports
export const getTransports = (params?: {
  source?: string;
  destination?: string;
  transport_type?: string;
  departure_date?: string;
}) => {
  return API.get("/transports/", {
    params,
  });
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

export const saveSearchHistory = (data: {
  source: string;
  destination: string;
  transport_type: string;
}) => {
  return API.post(
    "/transports/search-history/",
    data
  );
};

export const getSearchHistory = () => {
  return API.get(
    "/transports/search-history/"
  );
};

export const deleteSearchHistory = (id:number) => {
  return API.delete(
    `/transports/search-history/${id}/`
  );
};

export const clearSearchHistory = () => {
  return API.delete(
    "/transports/search-history/clear"
  );
};