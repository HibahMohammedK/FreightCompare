import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'user' | 'staff' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isPremium: boolean;
  avatarUrl?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: {
    id: '1',
    name: 'hibahmohammed.k',
    email: 'hibah@example.com',
    role: 'user',
    isPremium: false
  },
  isAuthenticated: true, // Auto-login for demo
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    upgradeToPremium: (state) => {
      if (state.user) {
        state.user.isPremium = true;
      }
    }
  }
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  upgradeToPremium
} = authSlice.actions;
export default authSlice.reducer;