import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subscription, mockSubscriptions } from '../utils/mockData';

interface SubscriptionState {
  subscriptions: Subscription[];
  currentSubscription: Subscription | null;
  loading: boolean;
}

const initialState: SubscriptionState = {
  subscriptions: mockSubscriptions,
  currentSubscription: mockSubscriptions[0], // Default to free for demo
  loading: false
};

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSubscriptions: (state, action: PayloadAction<Subscription[]>) => {
      state.subscriptions = action.payload;
    },
    setCurrentSubscription: (
    state,
    action: PayloadAction<Subscription | null>) =>
    {
      state.currentSubscription = action.payload;
    },
    upgradePlan: (
    state,
    action: PayloadAction<{userId: string;expiryDate: string;}>) =>
    {
      const sub = state.subscriptions.find(
        (s) => s.userId === action.payload.userId
      );
      if (sub) {
        sub.plan = 'premium';
        sub.expiryDate = action.payload.expiryDate;
        sub.status = 'active';
      }
      if (state.currentSubscription?.userId === action.payload.userId) {
        state.currentSubscription.plan = 'premium';
        state.currentSubscription.expiryDate = action.payload.expiryDate;
        state.currentSubscription.status = 'active';
      }
    },
    cancelPlan: (state, action: PayloadAction<string>) => {
      const sub = state.subscriptions.find((s) => s.userId === action.payload);
      if (sub) {
        sub.status = 'cancelled';
      }
      if (state.currentSubscription?.userId === action.payload) {
        state.currentSubscription.status = 'cancelled';
      }
    }
  }
});

export const {
  setSubscriptions,
  setCurrentSubscription,
  upgradePlan,
  cancelPlan
} = subscriptionSlice.actions;
export default subscriptionSlice.reducer;