import store from "../redux/store";
import { updateStaffStatus } from "../redux/staffSlice";
import { updateUserStatus } from "../redux/authSlice";

class SupportSocket {

    private socket: WebSocket | null = null;

    connect(token: string) {

        if (this.socket) {
            return;
        }

        this.socket = new WebSocket(
            `ws://localhost:8000/ws/support/?token=${token}`
        );

        this.socket.onopen = () => {
            console.log("Support WebSocket Connected");
        };

        this.socket.onclose = () => {
            console.log("Support WebSocket Closed");
        };

        this.socket.onerror = (error) => {
            console.error(
                "Support WebSocket Error:",
                error
            );
        };

        this.socket.onmessage = (event) => {

            const message = JSON.parse(event.data);

            switch (message.event) {

                case "staff_status_changed": {

                    store.dispatch(
                        updateStaffStatus({
                            id: message.data.user_id,
                            status: message.data.status,
                        })
                    );

                    const currentUser =
                        store.getState().auth.user;

                    if (
                        currentUser &&
                        currentUser.id === message.data.user_id
                    ) {
                        store.dispatch(
                            updateUserStatus(
                                message.data.status
                            )
                        );
                    }

                    break;
                }

                default:

                    console.warn(
                        "Unknown support event:",
                        message.event
                    );

            }

        };
    }

    disconnect() {

        this.socket?.close();

        this.socket = null;

    }

}

export const supportSocket =
    new SupportSocket();