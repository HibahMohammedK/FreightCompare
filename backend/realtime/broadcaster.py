from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class SupportBroadcaster:

    GROUP_NAME = "support_updates"

    @classmethod
    def broadcast(
        cls,
        event: str,
        data: dict,
    ):
        channel_layer = get_channel_layer()

        async_to_sync(
            channel_layer.group_send
        )(
            cls.GROUP_NAME,
            {
                "type": "support_event",
                "event": event,
                "data": data,
            },
        )