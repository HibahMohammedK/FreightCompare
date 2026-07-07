from django.db import models
from django.conf import settings

from transports.models import Transport

class PriceAlert(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="price_alerts",
    )

    transport = models.ForeignKey(
        Transport,
        on_delete=models.CASCADE,
        related_name="price_alerts",
        null=True,
        blank=True,
    )

    source = models.CharField(
        max_length=255,
    )

    destination = models.CharField(
        max_length=255,
    )

    transport_type = models.CharField(
        max_length=10,
        choices=Transport.TRANSPORT_TYPE_CHOICES,
    )

    target_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    departure_date = models.DateField(null=True,
    blank=True,)

    is_active = models.BooleanField(
        default=True,
    )

    status = models.CharField(
        max_length=15,
        choices=[
            ("active", "Active"),
            ("triggered", "Triggered"),
        ],
        default="active",
    )

    triggered_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    triggered_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):

        return (
            f"{self.user.username}: "
            f"{self.source} → "
            f"{self.destination} "
            f"({self.target_price})"
        )

    class Meta:

        ordering = [
            "-created_at",
        ]