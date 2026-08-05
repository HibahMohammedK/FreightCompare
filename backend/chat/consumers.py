import json

from channels.generic.websocket import AsyncWebsocketConsumer

from .models import Conversation


class ChatConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.user = self.scope["user"]

        if self.user.is_anonymous:
            await self.close()
            return

        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]

        try:
            conversation = await Conversation.objects.aget(
                id=self.conversation_id
            )

        except Conversation.DoesNotExist:
            await self.close()
            return

        is_participant = (
            conversation.customer_id == self.user.id
            or conversation.staff_id == self.user.id
            or self.user.role == "admin"
        )

        if not is_participant:
            await self.close()
            return

        self.group_name = f"conversation_{self.conversation_id}"

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