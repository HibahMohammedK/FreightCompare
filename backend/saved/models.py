from django.db import models
from django.conf import settings
from transports.models import Transport


class SavedTransport(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="saved_transports"
    )
    transport = models.ForeignKey(
        Transport,
        on_delete=models.CASCADE,
        related_name="saved_by_users"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "transport")
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.user} saved {self.transport}"