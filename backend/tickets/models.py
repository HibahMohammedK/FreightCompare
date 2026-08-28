import uuid

from django.conf import settings
from django.db import models, transaction
from django.db.models import Max


class Ticket(models.Model):

    STATUS_CHOICES = (
        ("open", "Open"),
        ("assigned", "Assigned"),
        ("in_progress", "In Progress"),
        ("resolved", "Resolved"),
        ("closed", "Closed"),
    )

    PRIORITY_CHOICES = (
        ("low", "Low"),
        ("medium", "Medium"),
        ("high", "High"),
        ("urgent", "Urgent"),
    )

    CATEGORY_CHOICES = (
        ("transport", "Transport"),
        ("subscription", "Subscription"),
        ("payment", "Payment"),
        ("technical", "Technical"),
        ("ai", "AI Assistant"),
        ("company", "Company"),
        ("general", "General"),
    )

    # ========================================================
    # IDENTIFICATION
    # ========================================================

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    ticket_sequence = models.PositiveIntegerField(
        unique=True,
        editable=False,
        null=True,
    )

    ticket_number = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True,
    )

    # ========================================================
    # USERS
    # ========================================================

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tickets",
    )

    assigned_staff = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        related_name="assigned_tickets",
        null=True,
        blank=True,
    )

    # ========================================================
    # TICKET INFORMATION
    # ========================================================

    subject = models.CharField(
        max_length=255,
    )

    description = models.TextField()

    category = models.CharField(
        max_length=30,
        choices=CATEGORY_CHOICES,
        default="general",
    )

    priority = models.CharField(
        max_length=20,
        choices=PRIORITY_CHOICES,
        default="medium",
    )

    status = models.CharField(
        max_length=30,
        choices=STATUS_CHOICES,
        default="open",
    )

    # ========================================================
    # TIMESTAMPS
    # ========================================================

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    assigned_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    resolved_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    closed_at = models.DateTimeField(
        null=True,
        blank=True,
    )

    # ========================================================
    # METHODS
    # ========================================================

    def save(self, *args, **kwargs):
        if self.ticket_sequence is None:
            with transaction.atomic():
                last_sequence = (
                    Ticket.objects
                    .select_for_update()
                    .aggregate(
                        max_sequence=Max(
                            "ticket_sequence"
                        )
                    )
                    .get("max_sequence")
                )

                self.ticket_sequence = (
                    last_sequence or 0
                ) + 1

        if not self.ticket_number:
            self.ticket_number = (
                f"FC-{self.ticket_sequence:06d}"
            )

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.subject} ({self.status})"

    class Meta:
        ordering = ["-created_at"]