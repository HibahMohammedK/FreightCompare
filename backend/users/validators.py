import re
from django.core.exceptions import ValidationError
from rest_framework import serializers

class StrongPasswordValidator:
    def validate(self, password, user=None):
        if not re.search(r"[A-Z]", password):
            raise ValidationError("Password must contain at least one uppercase letter")

        if not re.search(r"[0-9]", password):
            raise ValidationError("Password must contain at least one number")

        if not re.search(r"[!@#$%^&*(),.?\":{}|<>]", password):
            raise ValidationError("Password must contain at least one special character")

    def get_help_text(self):
        return "Password must contain uppercase, number and special character"


NAME_REGEX = re.compile(
    r"^[A-Za-z]+(?:[ '-][A-Za-z]+)*$"
)


def validate_name(value: str, field_name: str):
    value = value.strip()

    if len(value) < 2:
        raise serializers.ValidationError(
            f"{field_name} must be at least 2 characters."
        )

    if len(value) > 50:
        raise serializers.ValidationError(
            f"{field_name} cannot exceed 50 characters."
        )

    if not NAME_REGEX.fullmatch(value):
        raise serializers.ValidationError(
            f"{field_name} may only contain letters, spaces, hyphens (-) and apostrophes (')."
        )

    return value