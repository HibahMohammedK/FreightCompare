import API from "./axios";

export const loginUser = (data: { email: string; password: string }) =>
  API.post("/users/login/", data);

export const registerUser = (data: any) =>
  API.post("/users/register/", data);

export const getProfile = () =>
  API.get("/users/profile/");

export const logoutUser = () =>
  API.post("/users/logout/");

export const changePassword = (
 data: {
   current_password: string;
   new_password: string;
   confirm_password: string;
 }
) => {

 return API.post(
   "/users/change-password/",
   data
 );

};

export const loginWithGoogle = (data: { token: string }) =>
  API.post("/users/google-login/", data);