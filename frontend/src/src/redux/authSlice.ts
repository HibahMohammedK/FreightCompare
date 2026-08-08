import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../types/user";

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
  loading: true,
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

    setAuthLoading: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.loading = action.payload;
    },


    // Staff's status change
    updateUserStatus: (
      state,
      action: PayloadAction<
        "online" |
        "busy" |
        "offline"
      >
    ) => {

      if (state.user) {
        state.user.status =
          action.payload;
      }

    },

    updateUser: (
        state,
        action: PayloadAction<Partial<User>>
    ) => {

        if (!state.user) return;

        Object.assign(
            state.user,
            action.payload,
        );

    },
  },
});

export const {
  setAccessToken,
  setUser,
  loginStart,
  loginFailure,
  logout,
  setAuthLoading,
  updateUserStatus,
  updateUser,
} = authSlice.actions;

export default authSlice.reducer;