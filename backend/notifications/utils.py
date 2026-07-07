from asgiref.sync import async_to_sync

from channels.layers import get_channel_layer

from .models import Notification


def send_notification(
    *,
    user,
    title,
    message,
    notification_type=Notification.SYSTEM,
    transport=None,
):
    notification = Notification.objects.create(
        user=user,
        title=title,
        message=message,
        type=notification_type,
        transport=transport,
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
        },
    )

    return notification