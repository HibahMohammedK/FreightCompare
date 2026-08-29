import axios from "axios";
import store from "../redux/store";
import { setAccessToken, logout } from "../redux/authSlice";

const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ||
    "/api";

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 🔥 Separate instance (no interceptors)
const refreshAPI = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Attach access token
API.interceptors.request.use((req) => {
  const token = store.getState().auth.accessToken;

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;
});

// Response interceptor
API.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // 🔐 TOKEN EXPIRED
    if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        store.getState().auth.accessToken &&
        !originalRequest.url.includes("/users/login") &&
        !originalRequest.url.includes("/users/token/refresh")
      ){
      originalRequest._retry = true;

      try {
        const res = await refreshAPI.post("/users/token/refresh/"); // ✅ FIXED

        store.dispatch(setAccessToken(res.data.access));

        originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
        return API(originalRequest);
      } catch (err) {
        console.error("Refresh failed:", err);
        store.dispatch(logout());
        return Promise.reject(err);
      }
    }

    // 🚫 FORBIDDEN
    if (error.response?.status === 403) {
      console.error("Access denied:", error.response.data);
    }

    return Promise.reject(error);
  }
);

export default API;