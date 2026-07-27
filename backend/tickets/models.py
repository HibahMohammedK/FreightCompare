import uuid

from django.conf import settings
from django.db import models


class Ticket(models.Model):

    STATUS_CHOICES = (
        ("open", "Open"),
        ("assigned", "Assigned"),
        ("in_progress", "In Progress"),
        ("waiting_customer", "Waiting for Customer"),
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

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    ticket_number = models.CharField(
        max_length=20,
        unique=True,
        blank=True,
        null=True,
    )

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

    def __str__(self):
        return f"{self.subject} ({self.status})"
    
    class Meta:
        ordering = ["-created_at"]