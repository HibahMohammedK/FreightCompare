import axios from "axios";
import store from "../redux/store";
import { setAccessToken, logout } from "../redux/authSlice";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true, // 🔥 REQUIRED for cookies
});

// Attach access token
API.interceptors.request.use((req) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// Auto refresh on 401
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const res = await API.post("/users/token/refresh/");

        store.dispatch(setAccessToken(res.data.access));

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return API(originalRequest);
      } catch (err) {
        store.dispatch(logout());
      }
    }

    return Promise.reject(error);
  }
);

export default API;