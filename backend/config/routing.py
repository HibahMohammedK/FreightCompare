from channels.routing import URLRouter

websocket_urlpatterns = []

application = URLRouter(
    websocket_urlpatterns
)