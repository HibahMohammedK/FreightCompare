from django.conf import settings
from django.db import models

from companies.models import Company


class Transport(models.Model):
    TRANSPORT_TYPE_CHOICES = (
        ("air", "Air"),
        ("sea", "Sea"),
    )

    PRICE_UNIT_CHOICES = (
        ("shipment", "Per Shipment"),
        ("kg", "Per KG"),
        ("cbm", "Per CBM"),
        ("pallet", "Per Pallet"),
        ("container", "Per Container"),
    )

    company = models.ForeignKey(
        Company,
        on_delete=models.CASCADE,
    )

    transport_type = models.CharField(
        max_length=10,
        choices=TRANSPORT_TYPE_CHOICES,
    )

    source = models.CharField(
        max_length=255,
    )

    destination = models.CharField(
        max_length=255,
    )

    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    price_unit = models.CharField(
        max_length=20,
        choices=PRICE_UNIT_CHOICES,
        default="shipment",
    )

    duration = models.IntegerField(
        help_text="Duration in hours",
    )

    departure_date = models.DateField()

    booking_url = models.URLField()

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    def __str__(self):
        return f"{self.source} → {self.destination}"

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=[
                    "company",
                    "transport_type",
                    "source",
                    "destination",
                    "departure_date",
                ],
                name="unique_transport_route",
            )
        ]


class SearchHistory(models.Model):
    SEARCH_TYPE_CHOICES = (
        ("all", "All"),
        ("air", "Air"),
        ("sea", "Sea"),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="search_history",
    )

    source = models.CharField(
        max_length=255,
    )

    destination = models.CharField(
        max_length=255,
    )

    transport_type = models.CharField(
        max_length=10,
        choices=SEARCH_TYPE_CHOICES,
    )

    searched_at = models.DateTimeField(
        auto_now=True,
    )

    class Meta:
        ordering = ["-searched_at"]

        constraints = [
            models.UniqueConstraint(
                fields=[
                    "user",
                    "source",
                    "destination",
                    "transport_type",
                ],
                name="unique_user_search",
            )
        ]

    def __str__(self):
        return (
            f"{self.user.username}: "
            f"{self.source} → {self.destination} "
            f"({self.transport_type})"
        )