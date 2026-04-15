from rest_framework import serializers
from .models import Transport
from companies.models import Company
from django.utils import timezone


class TransportSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(write_only=True)
    company = serializers.StringRelatedField(read_only=True)

    created_by = serializers.HiddenField(
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = Transport
        fields = [
            "id",
            "company",
            "company_name",
            "transport_type",
            "source",
            "destination",
            "price",
            "duration",
            "departure_date",
            "booking_url",
            "created_by",
            "created_at",
            "updated_at",
        ]

    # 🔥 FIELD VALIDATIONS

    def validate_departure_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError(
                "Departure date cannot be in the past."
            )
        return value

    def validate_price(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Price must be greater than 0."
            )
        return value

    def validate_duration(self, value):
        if value <= 0:
            raise serializers.ValidationError(
                "Duration must be greater than 0."
            )
        return value

    # 🔥 OBJECT LEVEL VALIDATION

    def validate(self, data):
        source = data.get("source")
        destination = data.get("destination")

        if source and destination and source.lower() == destination.lower():
            raise serializers.ValidationError(
                "Source and destination cannot be the same."
            )

        return data

    # 🔥 CREATE

    def create(self, validated_data):
        company_name = validated_data.pop("company_name")

        company, _ = Company.objects.get_or_create(
            name__iexact=company_name,
            defaults={"name": company_name}
        )

        validated_data["company"] = company

        return super().create(validated_data)

    # 🔥 UPDATE

    def update(self, instance, validated_data):
        company_name = validated_data.pop("company_name", None)

        if company_name:
            company, _ = Company.objects.get_or_create(
                name__iexact=company_name,
                defaults={"name": company_name}
            )
            instance.company = company

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance