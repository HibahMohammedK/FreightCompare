import {
    createAsyncThunk,
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit";

import {
    getConversation,
    getConversations,
    markMessagesRead,
    sendMessage,
} from "../api/chat";

import type {
    ConversationList,
    ConversationDetail,
    Message,
    SendMessageRequest,
} from "../types/chat";

interface ChatState {
    conversations: ConversationList[];
    selectedConversation: ConversationDetail | null;

    loading: {
        list: boolean;
        detail: boolean;
        send: boolean;
    };

    error: string | null;
}

const initialState: ChatState = {
    conversations: [],
    selectedConversation: null,

    loading: {
        list: false,
        detail: false,
        send: false,
    },

    error: null,
};

export const fetchConversations = createAsyncThunk(
    "chat/fetchConversations",
    async () => {
        const response = await getConversations();
        return response.data;
    },
);

export const fetchConversation = createAsyncThunk(
    "chat/fetchConversation",
    async (id: string) => {
        const response = await getConversation(id);
        return response.data;
    },
);

export const sendChatMessage = createAsyncThunk(
    "chat/sendMessage",
    async (data: SendMessageRequest) => {
        const response = await sendMessage(data);
        return response.data as Message;
    },
);

export const markConversationRead = createAsyncThunk(
    "chat/markConversationRead",
    async (conversationId: string) => {
        const response = await markMessagesRead(conversationId);

        return response.data;
    },
);
const chatSlice = createSlice({
    name: "chat",
    initialState,

    reducers: {

        messageReceived: (
            state,
            action: PayloadAction<Message>,
        ) => {

            if (
                state.selectedConversation &&
                state.selectedConversation.id === action.payload.conversation
            ) {
                const exists =
                    state.selectedConversation.messages.some(
                        message => message.id === action.payload.id,
                    );

                if (!exists) {
                    state.selectedConversation.messages.push(
                        action.payload,
                    );
                }
            }

        },

        conversationUpdated: (
            state,
            action: PayloadAction<ConversationList>,
        ) => {

            const index = state.conversations.findIndex(
                (conversation) =>
                    conversation.id === action.payload.id,
            );

            if (index >= 0) {

                state.conversations[index] =
                    action.payload;

            } else {

                state.conversations.unshift(
                    action.payload,
                );

            }

        },

        messagesMarkedRead: (
            state,
            action: PayloadAction<{
                conversation: string;
                message_ids: string[];
                reader: string;
            }>,
        ) => {

            if (
                state.selectedConversation &&
                state.selectedConversation.id === action.payload.conversation
            ) {

                action.payload.message_ids.forEach((id) => {

                    const message =
                        state.selectedConversation!.messages.find(
                            (m) => m.id === id,
                        );

                    if (message) {
                        message.is_read = true;
                    }

                });

            }

            const conversation =
                state.conversations.find(
                    (conversation) =>
                        conversation.id === action.payload.conversation,
                );

            if (conversation) {
                conversation.unread_count = 0;
            }

        },

        clearSelectedConversation: (
            state,
        ) => {

            state.selectedConversation = null;

        },

    },

    extraReducers: (builder) => {

        builder

            .addCase(
                fetchConversations.pending,
                (state) => {

                    state.loading.list = true;
                    state.error = null;

                },
            )

            .addCase(
                fetchConversations.fulfilled,
                (state, action) => {

                    state.loading.list = false;
                    state.conversations =
                        action.payload;

                },
            )

            .addCase(
                fetchConversations.rejected,
                (state, action) => {

                    state.loading.list = false;

                    state.error =
                        action.error.message ??
                        "Failed to load conversations.";

                },
            )

            .addCase(
                fetchConversation.pending,
                (state) => {

                    state.loading.detail = true;
                    state.error = null;

                },
            )

            .addCase(
                fetchConversation.fulfilled,
                (state, action) => {

                    state.loading.detail = false;

                    state.selectedConversation =
                        action.payload;

                },
            )

            .addCase(
                fetchConversation.rejected,
                (state, action) => {

                    state.loading.detail = false;

                    state.error =
                        action.error.message ??
                        "Failed to load conversation.";

                },
            )

            .addCase(
                sendChatMessage.pending,
                (state) => {

                    state.loading.send = true;

                },
            )

            .addCase(
                sendChatMessage.fulfilled,
                (state, action) => {

                    state.loading.send = false;

                    if (
                        state.selectedConversation &&
                        state.selectedConversation.id ===
                            action.payload.conversation
                    ) {

                        const exists =
                            state.selectedConversation.messages.some(
                                message => message.id === action.payload.id,
                            );

                        if (!exists) {
                            state.selectedConversation.messages.push(
                                action.payload,
                            );
                        }

                    }

                    const conversation =
                        state.conversations.find(
                            (conversation) =>
                                conversation.id ===
                                action.payload.conversation,
                        );

                    if (conversation) {

                        conversation.last_message =
                            action.payload.message ||
                            (action.payload.attachment
                                ? "📎 Attachment"
                                : null);

                        conversation.last_message_at =
                            action.payload.created_at;

                    }

                },
            )

            .addCase(
                sendChatMessage.rejected,
                (state, action) => {

                    state.loading.send = false;

                    state.error =
                        action.error.message ??
                        "Failed to send message.";

                },
            )

            .addCase(
                markConversationRead.fulfilled,
                (state, action) => {

                    const {
                        conversation,
                        message_ids,
                    } = action.payload;

                    if (
                        state.selectedConversation &&
                        state.selectedConversation.id === conversation
                    ) {

                        state.selectedConversation.messages.forEach(
                            (message) => {

                                if (message_ids.includes(message.id)) {
                                    message.is_read = true;
                                }

                            },
                        );
                    }

                    const conversationItem =
                        state.conversations.find(
                            (item) =>
                                item.id === conversation,
                        );

                    if (conversationItem) {
                        conversationItem.unread_count = 0;
                    }

                },
            )

    },

});

export const {
    messageReceived,
    conversationUpdated,
    messagesMarkedRead,
    clearSelectedConversation,
} = chatSlice.actions;

export default chatSlice.reducer;