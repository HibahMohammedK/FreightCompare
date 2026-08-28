import json
from datetime import timedelta

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import timezone


# ============================================================
# SUPPORT CONSUMER
# ============================================================


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


# ============================================================
# PRESENCE CONSUMER
# ============================================================


class PresenceConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.user = self.scope["user"]

        if self.user.is_anonymous:
            await self.close()
            return

        # Presence is only relevant for staff
        if self.user.role != "staff":
            await self.close()
            return

        self.group_name = "staff_presence"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name,
        )

        await self.accept()

        await self.update_last_seen()

        await self.broadcast_presence(
            "online"
        )

    async def receive(
        self,
        text_data=None,
        bytes_data=None,
    ):

        if not text_data:
            return

        try:
            data = json.loads(
                text_data
            )

        except json.JSONDecodeError:
            return

        if data.get("type") == "heartbeat":
            await self.update_last_seen()

    async def disconnect(
        self,
        close_code,
    ):

        if hasattr(self, "group_name"):

            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name,
            )

        if (
            hasattr(self, "user")
            and self.user.is_authenticated
        ):

            if self.user.role == "staff":

                await self.mark_offline()

                await self.broadcast_presence(
                    "offline"
                )

    @database_sync_to_async
    def update_last_seen(self):

        self.user.last_seen = timezone.now()

        self.user.save(
            update_fields=[
                "last_seen",
                "updated_at",
            ]
        )

    @database_sync_to_async
    def mark_offline(self):

        self.user.last_seen = timezone.now()

        self.user.save(
            update_fields=[
                "last_seen",
                "updated_at",
            ]
        )

    async def broadcast_presence(
        self,
        presence_status,
    ):

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "presence_event",
                "staff_id": str(
                    self.user.id
                ),
                "status": presence_status,
            },
        )

    async def presence_event(self, event):

        await self.send(
            text_data=json.dumps(
                {
                    "event": "staff_presence",
                    "data": {
                        "staff_id": event["staff_id"],
                        "status": event["status"],
                    },
                }
            )
        )