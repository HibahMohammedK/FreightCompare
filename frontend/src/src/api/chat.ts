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
    const formData = new FormData();

    formData.append(
        "conversation",
        data.conversation,
    );

    if (data.message?.trim()) {
        formData.append(
            "message",
            data.message.trim(),
        );
    }

    if (data.attachment) {
        formData.append(
            "attachment",
            data.attachment,
        );
    }

    return API.post(
        "/chat/messages/",
        formData,
    );
};

export const markMessagesRead = (
    conversationId: string,
) => {
    return API.post(
        `/chat/conversations/${conversationId}/read/`
    );
};