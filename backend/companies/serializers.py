from rest_framework import serializers
from django.db.models.functions import Lower

from .models import Company


class CompanySerializer(serializers.ModelSerializer):

    # ========================================================
    # META
    # ========================================================

    class Meta:
        model = Company

        fields = [
            "id",
            "name",
            "website",
            "created_at",
            "is_active",
        ]

    # ========================================================
    # NAME VALIDATION
    # ========================================================

    def validate_name(self, value):
        value = " ".join(
            value.split()
        ).strip()

        queryset = Company.objects.annotate(
            name_lower=Lower("name")
        ).filter(
            name_lower=value.lower()
        )

        # Allow the existing company to keep its own name when editing
        if self.instance:
            queryset = queryset.exclude(
                pk=self.instance.pk
            )

        if queryset.exists():
            raise serializers.ValidationError(
                "A company with this name already exists."
            )

        return value