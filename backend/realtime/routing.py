from django.urls import path

from .consumers import SupportConsumer
from .presence import PresenceConsumer


websocket_urlpatterns = [

    path(
        "ws/support/",
        SupportConsumer.as_asgi(),
    ),

    path(
        "ws/presence/",
        PresenceConsumer.as_asgi(),
    ),

]