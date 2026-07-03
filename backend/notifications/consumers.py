import json

from channels.generic.websocket import AsyncWebsocketConsumer


class NotificationConsumer(
    AsyncWebsocketConsumer
):

    async def connect(self):

        print(
            "WebSocket Connected",
            flush=True,
        )

        await self.accept()

    async def disconnect(
        self,
        close_code,
    ):

        print(
            "WebSocket Disconnected",
            flush=True,
        )

    async def receive(
        self,
        text_data,
    ):

        print(
            f"Received: {text_data}",
            flush=True,
        )

        await self.send(
            text_data=text_data,
        )