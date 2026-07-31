from django.db import models
from django.conf import settings
import uuid

class Notification(models.Model):

    PRICE_ALERT = "price_alert"
    ROUTE_MATCH = "route_match"
    SUBSCRIPTION = "subscription"
    AI = "ai"
    SYSTEM = "system"
    TICKET = "ticket"
    CHAT = "chat"

    TYPE_CHOICES = [
        (PRICE_ALERT, "Price Alert"),
        (ROUTE_MATCH, "Route Match"),
        (SUBSCRIPTION, "Subscription"),
        (AI, "AI"),
        (SYSTEM, "System"),
        (TICKET, "Ticket"),
        (CHAT, "Chat"),
    ]

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="notifications",
    )

    title = models.CharField(
        max_length=255,
    )

    message = models.TextField()

    type = models.CharField(
        max_length=30,
        choices=TYPE_CHOICES,
        default=SYSTEM,
    )

    is_read = models.BooleanField(
        default=False,
    )

    transport = models.ForeignKey(
        "transports.Transport",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="notifications",
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    class Meta:

        ordering = [
            "-created_at",
        ]

        indexes = [
            models.Index(
                fields=[
                    "user",
                    "is_read",
                ]
            ),
        ]

    def __str__(self):

        return (
            f"{self.user.username} - {self.title}"
        )