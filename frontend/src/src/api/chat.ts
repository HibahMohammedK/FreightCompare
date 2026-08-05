import API from "./axios";

import type {
    ConversationList,
    ConversationDetail,
    SendMessageRequest,
} from "../types/chat";

export const getConversations = () => {
    return API.get<ConversationList[]>(
        "/chat/conversations/"
    );
};

export const getConversation = (id: string) => {
    return API.get<ConversationDetail>(
        `/chat/conversations/${id}/`
    );
};

export const sendMessage = (
    data: SendMessageRequest,
) => {
    return API.post(
        "/chat/messages/",
        data,
    );
};

export const markMessagesRead = (
    conversationId: string,
) => {
    return API.post(
        `/chat/conversations/${conversationId}/read/`
    );
};