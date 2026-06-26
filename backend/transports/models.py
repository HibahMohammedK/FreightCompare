from django.db import models
from django.conf import settings
from companies.models import Company


class Transport(models.Model):
    TRANSPORT_TYPE_CHOICES = (
        ("air", "Air"),
        ("sea", "Sea"),
    )

    company = models.ForeignKey(Company, on_delete=models.CASCADE)
    transport_type = models.CharField(max_length=10, choices=TRANSPORT_TYPE_CHOICES)

    source = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)

    price = models.DecimalField(max_digits=10, decimal_places=2)
    duration = models.IntegerField(help_text="Duration in hours")

    departure_date = models.DateField()
    booking_url = models.URLField()

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.source} → {self.destination}"
    

class SearchHistory(models.Model):
    SEARCH_TYPE_CHOICES = (
        ("all", "All"),
        ("air", "Air"),
        ("sea", "Sea"),
    )
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="search_history")
    source = models.CharField(max_length=255)
    destination = models.CharField(max_length=255)
    transport_type = models.CharField(max_length=10, choices=SEARCH_TYPE_CHOICES)
    searched_at = models.DateTimeField(auto_now=True)

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
                name="unique_user_search"
            )
        ]

    def __str__(self):
        return f"{self.user.username}: {self.source} → {self.destination} ({self.transport_type})"
   