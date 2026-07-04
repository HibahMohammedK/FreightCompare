"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""
import os

from channels.routing import ProtocolTypeRouter
from notifications.middleware import JWTAuthMiddleware
from django.core.asgi import get_asgi_application

from .routing import application as websocket_application


os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings",
)

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),

        "websocket": JWTAuthMiddleware(
            websocket_application
        ),
    }
)