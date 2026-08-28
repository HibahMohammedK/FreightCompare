from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import Notification


# ============================================================
# SEND NOTIFICATION
# ============================================================


def send_notification(
    *,
    user,
    title,
    message,
    notification_type=Notification.SYSTEM,
    transport=None,
    ticket=None,
):
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        type=notification_type,
        transport=transport,
        ticket=ticket,
    )

    channel_layer = get_channel_layer()

    async_to_sync(
        channel_layer.group_send
    )(
        f"notifications_{user.id}",
        {
            "type": "send_notification",
            "id": str(notification.id),
            "title": notification.title,
            "message": notification.message,
            "notification_type": notification.type,
            "created_at": notification.created_at.isoformat(),
            "is_read": notification.is_read,
            "transport_id": (
                str(notification.transport.id)
                if notification.transport
                else None
            ),
            "ticket_id": (
                str(notification.ticket.id)
                if notification.ticket
                else None
            ),
            "source": (
                notification.transport.source
                if notification.transport
                else None
            ),
            "destination": (
                notification.transport.destination
                if notification.transport
                else None
            ),
            "transport_type": (
                notification.transport.transport_type
                if notification.transport
                else None
            ),
        },
    )

    return notification