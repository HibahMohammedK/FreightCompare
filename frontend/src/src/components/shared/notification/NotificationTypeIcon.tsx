import {
    BellIcon,
    BotIcon,
    MessageSquareIcon,
    RouteIcon,
    TagIcon,
    CreditCardIcon,
    TicketIcon
} from "lucide-react";

interface NotificationTypeIconProps {
    type: string;
    size?: number;
}

export const NotificationTypeIcon = ({
    type,
    size = 18,
}: NotificationTypeIconProps) => {

    switch (type) {

        case "price_alert":
            return <TagIcon size={size} />;

        case "route_match":
            return <RouteIcon size={size} />;

        case "subscription":
            return <CreditCardIcon size={size} />;

        case "ai":
            return <BotIcon size={size} />;
           
        case "ticket":
            return <TicketIcon size={size} />;

        case "chat":
            return <MessageSquareIcon size={size} />;

        case "system":
        default:
            return <BellIcon size={size} />;

    }
};
