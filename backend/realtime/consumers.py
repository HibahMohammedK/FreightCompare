import json

from channels.generic.websocket import AsyncWebsocketConsumer


class SupportConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.user = self.scope["user"]

        if self.user.is_anonymous:
            await self.close()
            return

        self.support_group_name = "support_updates"

        await self.channel_layer.group_add(
            self.support_group_name,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(self, close_code):

        if hasattr(self, "support_group_name"):

            await self.channel_layer.group_discard(
                self.support_group_name,
                self.channel_name,
            )

    async def support_event(self, event):

        await self.send(
            text_data=json.dumps(
                {
                    "event": event["event"],
                    "data": event["data"],
                }
            )
        )
