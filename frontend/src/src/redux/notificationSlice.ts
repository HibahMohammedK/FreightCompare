import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
        state.notifications.unshift(
            action.payload
        );

        if (!action.payload.is_read) {
            state.unreadCount += 1;
        }
    },

    setNotifications: (state, action: PayloadAction<Notification[]>) => {
        state.notifications = action.payload;

        state.unreadCount =
            action.payload.filter(
                n => !n.is_read
            ).length;
    },

    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(
        (n) => n.id === action.payload
      );
      if (notification && !notification.is_read) {
        notification.is_read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },

    markAllAsRead: (state) => {
      state.notifications.forEach((n) => n.is_read = true);
      state.unreadCount = 0;
    },

    removeNotification: (state, action: PayloadAction<string> ) => {
        const notification =
            state.notifications.find(
                n => n.id === action.payload
            );

        if ( notification && !notification.is_read ) {
            state.unreadCount = Math.max(
                0,
                state.unreadCount - 1
            );
        }

        state.notifications =
            state.notifications.filter(
                n => n.id !== action.payload
            );
    },

    clearNotifications: (state) => {
        state.notifications = [];
        state.unreadCount = 0;
    },
  }
});

export const { addNotification, setNotifications, markAsRead, markAllAsRead, removeNotification, clearNotifications } =
notificationSlice.actions;
export default notificationSlice.reducer;