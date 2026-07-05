import store from "../redux/store";
import { addNotification } from "../redux/notificationSlice";

class NotificationSocket {

    private socket: WebSocket | null = null;

    connect(token: string) {

        if (this.socket) {
            return;
        }

        this.socket = new WebSocket(
            `ws://localhost:8000/ws/notifications/?token=${token}`
        );

        this.socket.onopen = () => {
            console.log("Notification WebSocket Connected");
        };

        this.socket.onclose = () => {
            console.log("Notification WebSocket Closed");
        };

        this.socket.onerror = (error) => {
            console.error(
                "Notification WebSocket Error:",
                error
            );
        };

        this.socket.onmessage = (event) => {

            const notification = JSON.parse(
                event.data
            );

            console.log(
                "New notification:",
                notification
            );


            store.dispatch(
                addNotification(notification)
            );

        };
    }

    disconnect() {

        this.socket?.close();

        this.socket = null;

    }

}

export const notificationSocket =
    new NotificationSocket();