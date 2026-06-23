import API from "./axios";

export const loginUser = (data: { email: string; password: string }) =>
  API.post("/users/login/", data);

export const registerUser = (data: any) =>
  API.post("/users/register/", data);

export const getProfile = () =>
  API.get("/users/profile/");

export const updateProfile = (data: { username: string;}) =>
  API.patch("/users/profile/update/",data);

export const requestEmailChange = (data: { new_email: string }) =>
  API.post("/users/change-email/", data);

export const verifyEmailChange = (data: { verification_id: string; otp: string; }) =>
  API.post("/users/verify-email-change/", data);

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

export const validateResetToken = async (token: string) => {
  const response = await API.get(
    "/users/reset-password/validate/",
    {
      params: { token }
    }
  );

  return response.data;
};

export const loginWithGoogle = (data: { token: string }) =>
  API.post("/users/google-login/", data);