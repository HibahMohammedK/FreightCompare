import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import transportReducer from './transportSlice';
import notificationReducer from './notificationSlice';
import ticketReducer from './ticketSlice';
import chatReducer from './chatSlice';
import staffReducer from "./staffSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    transport: transportReducer,
    notification: notificationReducer,
    ticket: ticketReducer,
    chat: chatReducer,
    staff: staffReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store