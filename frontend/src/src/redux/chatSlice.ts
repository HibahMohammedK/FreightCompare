import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ChatConversation,
  ChatMessage,
  mockConversations,
  mockChatMessages } from
'../utils/mockData';

interface ChatState {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  messages: Record<string, ChatMessage[]>;
  loading: boolean;
}

const initialState: ChatState = {
  conversations: mockConversations,
  activeConversationId: null,
  messages: mockChatMessages,
  loading: false
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<ChatConversation[]>) => {
      state.conversations = action.payload;
    },
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
      // Mark messages as read when opening conversation
      if (action.payload && state.messages[action.payload]) {
        state.messages[action.payload].forEach((msg) => {
          msg.read = true;
        });
        const conv = state.conversations.find((c) => c.id === action.payload);
        if (conv) {
          conv.unreadCount = 0;
        }
      }
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      const { conversationId } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(action.payload);

      // Update conversation last message
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) {
        conv.lastMessage = action.payload.content;
        conv.lastMessageAt = action.payload.createdAt;
        if (state.activeConversationId !== conversationId) {
          conv.unreadCount += 1;
        }
      }
    },
    createConversation: (state, action: PayloadAction<ChatConversation>) => {
      state.conversations.unshift(action.payload);
      state.messages[action.payload.id] = [];
    },
    closeConversation: (state, action: PayloadAction<string>) => {
      const conv = state.conversations.find((c) => c.id === action.payload);
      if (conv) {
        conv.status = 'closed';
      }
    },
    markMessagesAsRead: (state, action: PayloadAction<string>) => {
      const conversationId = action.payload;
      if (state.messages[conversationId]) {
        state.messages[conversationId].forEach((msg) => {
          msg.read = true;
        });
      }
      const conv = state.conversations.find((c) => c.id === conversationId);
      if (conv) {
        conv.unreadCount = 0;
      }
    }
  }
});

export const {
  setConversations,
  setActiveConversation,
  addMessage,
  createConversation,
  closeConversation,
  markMessagesAsRead
} = chatSlice.actions;
export default chatSlice.reducer;