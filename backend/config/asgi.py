"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "config.settings",
)

from django.core.asgi import get_asgi_application

# Initialize Django before importing anything that accesses Django models.
django_asgi_app = get_asgi_application()

from channels.routing import ProtocolTypeRouter

from notifications.middleware import JWTAuthMiddleware
from .routing import application as websocket_application


application = ProtocolTypeRouter(
    {
        "http": django_asgi_app,

        "websocket": JWTAuthMiddleware(
            websocket_application
        ),
    }
)