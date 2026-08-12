from rest_framework import serializers
from .models import Company
from django.db.models.functions import Lower

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = [
            "id",
            "name",
            "website",
            "created_at",
            "is_active"
            ]

    def validate_name(self, value):
        value = " ".join(value.split()).strip()

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