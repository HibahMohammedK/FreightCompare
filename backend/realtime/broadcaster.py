from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer


class RealtimeBroadcaster:

    @staticmethod
    def broadcast_to_group(
        group_name,
        event,
        data,
    ):
        print("BROADCAST TO GROUP:", group_name)
        channel_layer = get_channel_layer()

        async_to_sync(
            channel_layer.group_send
        )(
            group_name,
            {
                "type": "realtime_event",
                "event": event,
                "data": data,
            },
        )