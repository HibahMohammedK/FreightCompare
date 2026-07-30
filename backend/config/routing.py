from channels.routing import URLRouter

from notifications.routing import (
    websocket_urlpatterns as notification_patterns,
)

from realtime.routing import (
    websocket_urlpatterns as realtime_patterns,
)


application = URLRouter(
    notification_patterns +
    realtime_patterns
)