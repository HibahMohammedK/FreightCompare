import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import transportReducer from './transportSlice';
import notificationReducer from './notificationSlice';
import ticketReducer from './ticketSlice';
import chatReducer from './chatSlice';
import subscriptionReducer from './subscriptionSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transport: transportReducer,
    notification: notificationReducer,
    ticket: ticketReducer,
    chat: chatReducer,
    subscription: subscriptionReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;