import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: string;
  email: string;
  username: string;
  role: "admin" | "staff" | "customer";
  is_verified: boolean;
  is_staff: boolean;
  isPremium?: boolean;
  created_at: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // 🔐 Set access token (after login or refresh)
    setAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },

    // 👤 Set user profile
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },

    // 🚀 Login start (UI state)
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // ❌ Login failed
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // 🚪 Logout
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setAccessToken,
  setUser,
  loginStart,
  loginFailure,
  logout,
} = authSlice.actions;

export default authSlice.reducer;