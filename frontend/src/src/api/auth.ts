import API from "./axios";

export const loginUser = (data: { email: string; password: string }) =>
  API.post("/users/login/", data);

export const registerUser = (data: any) =>
  API.post("/users/register/", data);

export const getProfile = () =>
  API.get("/users/profile/");

export const logoutUser = () =>
  API.post("/users/logout/");