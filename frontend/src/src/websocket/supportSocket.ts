import store from "../redux/store";
import WS_BASE_URL from "../config/websocket";
import {
    updateStaffStatus
} from "../redux/staffSlice";

import {
    updateUserStatus
} from "../redux/authSlice";

import {
    ticketAssigned,
    ticketStatusChanged,
    ticketCreated,
    ticketUpdated
} from "../redux/ticketSlice";


class SupportSocket {

    private socket: WebSocket | null = null;

    connect(token: string) {

        if (this.socket) {
            return;
        }

        this.socket = new WebSocket(
            `${WS_BASE_URL}/ws/support/?token=${token}`
        );

        this.socket.onopen = () => {

            console.log(
                "Support WebSocket Connected"
            );

        };

        this.socket.onclose = () => {

            console.log(
                "Support WebSocket Closed"
            );

        };

        this.socket.onerror = (error) => {

            console.error(
                "Support WebSocket Error:",
                error
            );

        };

        this.socket.onmessage = (event) => {

            const message =
                JSON.parse(event.data);

            switch (message.event) {

                case "staff_status_changed": {

                    store.dispatch(
                        updateStaffStatus({
                            id:
                                message.data.user_id,
                            status:
                                message.data.status,
                        })
                    );

                    const currentUser =
                        store.getState()
                            .auth.user;

                    if (
                        currentUser &&
                        currentUser.id ===
                            message.data.user_id
                    ) {

                        store.dispatch(
                            updateUserStatus(
                                message.data.status
                            )
                        );

                    }

                    break;
                }


                case "staff_presence": {

                    const staffId =
                        message.data.staff_id;

                    const status =
                        message.data.status;


                    // Update admin staff list.
                    store.dispatch(
                        updateStaffStatus({
                            id: staffId,
                            status: status,
                        })
                    );


                    // Update the logged-in staff's
                    // own ProfileMenu.
                    const currentUser =
                        store.getState()
                            .auth.user;

                    if (
                        currentUser &&
                        currentUser.id === staffId
                    ) {

                        store.dispatch(
                            updateUserStatus(
                                status
                            )
                        );

                    }

                    break;
                }


                case "ticket_created": {

                    store.dispatch(
                        ticketCreated(
                            message.data
                        )
                    );

                    break;
                }


                case "ticket_assigned": {

                    store.dispatch(
                        ticketAssigned(
                            message.data
                        )
                    );

                    break;
                }


                case "ticket_status_changed": {

                    store.dispatch(
                        ticketStatusChanged(
                            message.data
                        )
                    );

                    break;
                }


                case "ticket_updated": {

                    store.dispatch(
                        ticketUpdated(
                            message.data
                        )
                    );

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