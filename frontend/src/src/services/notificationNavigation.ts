import type { NavigateFunction } from "react-router-dom";
import type { Notification } from "../types/notification";
import type {
    UserRole,
} from "../types/user";

export function navigateFromNotification(
    notification: Notification,
    role: UserRole,
    navigate: NavigateFunction,
) {

    switch (notification.type) {

        case "ticket":

            if (role === "customer") {

                navigate(
                    `/support?ticket=${notification.ticket_id}`
                );

            } else if (role === "staff") {

                navigate(
                    `/staff/tickets?ticket=${notification.ticket_id}`
                );

            } else if (role === "admin") {

                navigate(
                    `/admin/tickets?ticket=${notification.ticket_id}`
                );

            }

            break;

        case "price_alert":

        case "route_match":

            if (
                notification.source &&
                notification.destination &&
                notification.transport_type
            ) {

                navigate(
                    `/search?source=${encodeURIComponent(notification.source)}&destination=${encodeURIComponent(notification.destination)}&type=${notification.transport_type}`
                );

            }

            break;

            }

}