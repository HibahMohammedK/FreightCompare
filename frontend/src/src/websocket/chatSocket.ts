import store from "../redux/store";
import WS_BASE_URL from "../config/websocket";

import {
    messageReceived,
    conversationUpdated,
    messagesMarkedRead,
} from "../redux/chatSlice";

class ChatSocket {

    private socket: WebSocket | null = null;

    connect(conversationId: string) {

        if (
            this.socket &&
            this.socket.readyState === WebSocket.OPEN
        ) {
            return;
        }

        const token =
            store.getState().auth.accessToken;

        if (!token) {
            return;
        }

        this.socket = new WebSocket(
            `${WS_BASE_URL}/ws/chat/${conversationId}/?token=${token}`
        );


        this.socket.onopen = () => {
            console.log("Chat WebSocket Connected");
        };

        this.socket.onclose = () => {
            console.log("Chat WebSocket Closed");
        };

        this.socket.onerror = (error) => {
            console.error(
                "Chat WebSocket Error:",
                error,
            );
        };

        this.socket.onmessage = (event) => {
            console.log("CHAT EVENT:", event.data);
            const message = JSON.parse(event.data);

            switch (message.event) {

                case "chat_message":

                    store.dispatch(
                        messageReceived(message.data),
                    );

                    break;

                case "conversation_updated":

                    store.dispatch(
                        conversationUpdated(message.data),
                    );

                    break;

                case "chat_read":

                    store.dispatch(
                        messagesMarkedRead(message.data),
                    );

                    break;

                default:

                    console.warn(
                        "Unknown chat event:",
                        message.event,
                    );

            }

        };

    }

    disconnect() {

        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }

    }

}

export const chatSocket =
    new ChatSocket();