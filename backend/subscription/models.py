from django.db import models
from django.conf import settings


class Subscription(models.Model):
    STATUS_CHOICES = (
        ("active", "Active"),
        ("cancelled", "Cancelled"),
        ("expired", "Expired"),
    )

    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="subscription",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="expired",
    )

    stripe_customer_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    stripe_subscription_id = models.CharField(
        max_length=255,
        blank=True,
        null=True,
    )

    start_date = models.DateTimeField()

    expiry_date = models.DateTimeField()

    cancel_at_period_end = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.email} - {self.status}"