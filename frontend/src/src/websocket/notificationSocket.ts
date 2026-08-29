import store from "../redux/store";
import { addNotification } from "../redux/notificationSlice";
import { getPriceAlerts } from "../api/priceAlerts";
import { setPriceAlerts } from "../redux/transportSlice";
import WS_BASE_URL from "../config/websocket";

class NotificationSocket {

    private socket: WebSocket | null = null;

    connect(token: string) {

        if (this.socket) {
            return;
        }

        this.socket = new WebSocket(
            `${WS_BASE_URL}/ws/notifications/?token=${token}`
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

        this.socket.onmessage = async (event) => {

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

            if (
                notification.type === "price_alert"
            ) {

                try {

                    const res =
                        await getPriceAlerts();

                    store.dispatch(
                        setPriceAlerts(
                            res.data
                        )
                    );
                    console.log(
                        store.getState().transport.priceAlerts
                    );

                } catch (error) {

                    console.error(
                        "Failed to refresh price alerts",
                        error
                    );

                }

            }

        };
    }

    disconnect() {

        this.socket?.close();

        this.socket = null;

    }

}

export const notificationSocket =
    new NotificationSocket();