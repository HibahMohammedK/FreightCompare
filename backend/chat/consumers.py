import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer

from realtime.chat_presence import (
    add_chat_connection,
    remove_chat_connection,
)

from .models import Conversation


class ChatConsumer(AsyncWebsocketConsumer):

    # ========================================================
    # CONNECTION
    # ========================================================

    async def connect(self):

        self.user = self.scope["user"]

        if self.user.is_anonymous:
            await self.close()
            return

        self.conversation_id = (
            self.scope["url_route"]["kwargs"][
                "conversation_id"
            ]
        )

        try:

            conversation = await (
                Conversation.objects.aget(
                    id=self.conversation_id
                )
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

        self.group_name = (
            f"conversation_{self.conversation_id}"
        )

        # Add WebSocket to the conversation group.
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        # Register this specific connection as
        # actively viewing the conversation.
        self.connection_id = (
            await self.add_chat_presence()
        )

        await self.accept()

    # ========================================================
    # DISCONNECTION
    # ========================================================

    async def disconnect(
        self,
        close_code,
    ):

        if hasattr(
            self,
            "group_name",
        ):

            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name,
            )

        if (
            hasattr(self, "connection_id")
            and hasattr(self, "conversation_id")
            and hasattr(self, "user")
        ):

            await self.remove_chat_presence()

    # ========================================================
    # CHAT PRESENCE
    # ========================================================

    @database_sync_to_async
    def add_chat_presence(self):

        return add_chat_connection(
            conversation_id=self.conversation_id,
            user_id=self.user.id,
        )

    @database_sync_to_async
    def remove_chat_presence(self):

        remove_chat_connection(
            conversation_id=self.conversation_id,
            user_id=self.user.id,
            connection_id=self.connection_id,
        )

    # ========================================================
    # RECEIVE CLIENT EVENTS
    # ========================================================

    async def receive(
        self,
        text_data=None,
        bytes_data=None,
    ):

        # Currently the chat WebSocket is used for
        # server-to-client realtime events.
        #
        # Keep this available for future client events.

        if not text_data:
            return

        try:

            data = json.loads(
                text_data
            )

        except json.JSONDecodeError:

            return

    # ========================================================
    # REALTIME EVENT
    # ========================================================

    async def realtime_event(
        self,
        event,
    ):

        await self.send(
            text_data=json.dumps(
                {
                    "event": event["event"],
                    "data": event["data"],
                }
            )
        )