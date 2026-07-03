from channels.routing import URLRouter

from notifications.routing import websocket_urlpatterns


application = URLRouter(
    websocket_urlpatterns
)