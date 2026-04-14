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