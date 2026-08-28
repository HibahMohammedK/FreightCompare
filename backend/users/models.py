import uuid

from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone


class User(AbstractUser):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("staff", "Staff"),
        ("customer", "Customer"),
    )

    STATUS_CHOICES = (
        ("online", "Online"),
        ("busy", "Busy"),
        ("offline", "Offline"),
    )

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False,
    )

    email = models.EmailField(
        unique=True,
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="customer",
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="offline",
    )

    manual_status = models.BooleanField(
        default=False,
    )

    last_seen = models.DateTimeField(
        null=True,
        blank=True,
    )

    is_verified = models.BooleanField(
        default=False,
    )

    profile_image = models.ImageField(
        upload_to="profile_images/",
        null=True,
        blank=True,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    updated_at = models.DateTimeField(
        auto_now=True,
    )

    force_password_change = models.BooleanField(
        default=False,
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    def __str__(self):
        return self.email

    def save(self, *args, **kwargs):
        if self.is_superuser:
            self.role = "admin"
            self.is_verified = True
            self.is_active = True

        super().save(*args, **kwargs)


class PasswordResetToken(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
    )

    token_hash = models.CharField(
        max_length=255,
    )

    created_at = models.DateTimeField(
        auto_now_add=True,
    )

    expires_at = models.DateTimeField()

    is_used = models.BooleanField(
        default=False,
    )

    def is_valid(self):
        return (
            not self.is_used
            and self.expires_at > timezone.now()
        )