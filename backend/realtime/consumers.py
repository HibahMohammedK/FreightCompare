import json

from channels.generic.websocket import AsyncWebsocketConsumer


class SupportConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.user = self.scope["user"]

        if self.user.is_anonymous:
            await self.close()
            return

        if self.user.role == "admin":
            self.group_name = "admins"

        elif self.user.role == "staff":
            self.group_name = f"staff_{self.user.id}"

        else:
            self.group_name = f"customer_{self.user.id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name,
        )

    async def realtime_event(self, event):

        await self.send(
            text_data=json.dumps(
                {
                    "event": event["event"],
                    "data": event["data"],
                }
            )
        )
