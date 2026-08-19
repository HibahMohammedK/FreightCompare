import json
import uuid

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.cache import cache
from django.utils import timezone

from users.models import User


class PresenceConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.user = self.scope["user"]

        if self.user.is_anonymous:
            await self.close()
            return

        if self.user.role != "staff":
            await self.close()
            return

        self.connection_id = str(uuid.uuid4())

        self.presence_key = (
            f"staff_presence:{self.user.id}"
        )

        await self.add_connection()

        await self.accept()

        # A fresh active session always starts as ONLINE.
        await self.mark_online()

        await self.broadcast_presence(
            status="online"
        )

    async def receive(
        self,
        text_data=None,
        bytes_data=None,
    ):

        if not text_data:
            return

        try:
            data = json.loads(text_data)

        except json.JSONDecodeError:
            return

        if data.get("type") == "heartbeat":

            await self.refresh_connection()

    async def disconnect(
        self,
        close_code
    ):

        if not hasattr(self, "user"):
            return

        if self.user.is_anonymous:
            return

        if self.user.role != "staff":
            return

        await self.remove_connection()

        has_connections = (
            await self.has_active_connections()
        )

        # Only go offline when the staff member
        # has no other active browser/tab connections.
        if not has_connections:

            await self.mark_offline()

            await self.broadcast_presence(
                status="offline"
            )

    @database_sync_to_async
    def add_connection(self):

        connections = cache.get(
            self.presence_key,
            set(),
        )

        connections = set(connections)

        connections.add(
            self.connection_id
        )

        cache.set(
            self.presence_key,
            connections,
            timeout=120,
        )

    @database_sync_to_async
    def remove_connection(self):

        connections = cache.get(
            self.presence_key,
            set(),
        )

        connections = set(connections)

        connections.discard(
            self.connection_id
        )

        if connections:

            cache.set(
                self.presence_key,
                connections,
                timeout=120,
            )

        else:

            cache.delete(
                self.presence_key
            )

    @database_sync_to_async
    def has_active_connections(self):

        connections = cache.get(
            self.presence_key,
            set(),
        )

        return bool(connections)

    @database_sync_to_async
    def refresh_connection(self):

        connections = cache.get(
            self.presence_key,
            set(),
        )

        connections = set(connections)

        if self.connection_id not in connections:

            connections.add(
                self.connection_id
            )

        cache.set(
            self.presence_key,
            connections,
            timeout=120,
        )

    @database_sync_to_async
    def mark_online(self):

        user = User.objects.get(
            id=self.user.id
        )

        user.status = "online"

        # Fresh login/session means automatic presence.
        user.manual_status = False

        user.last_seen = timezone.now()

        user.save(
            update_fields=[
                "status",
                "manual_status",
                "last_seen",
                "updated_at",
            ]
        )

    @database_sync_to_async
    def mark_offline(self):

        user = User.objects.get(
            id=self.user.id
        )

        user.status = "offline"

        # Clear manual override so the next login
        # starts automatically as ONLINE.
        user.manual_status = False

        user.last_seen = timezone.now()

        user.save(
            update_fields=[
                "status",
                "manual_status",
                "last_seen",
                "updated_at",
            ]
        )

    async def broadcast_presence(
        self,
        status,
    ):

        data = {
            "staff_id": str(
                self.user.id
            ),
            "status": status,
            "last_seen": timezone.now().isoformat(),
        }

        # Admins receive staff presence.
        await self.channel_layer.group_send(
            "admins",
            {
                "type": "realtime_event",
                "event": "staff_presence",
                "data": data,
            },
        )

        # The staff member also receives their own
        # presence update.
        await self.channel_layer.group_send(
            f"staff_{self.user.id}",
            {
                "type": "realtime_event",
                "event": "staff_presence",
                "data": data,
            },
        )