from rest_framework import serializers
from .models import Transport
from companies.models import Company


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
            "company",          # read-only
            "company_name",     # write-only
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

    def create(self, validated_data):
        company_name = validated_data.pop("company_name")

        # 🔥 get or create company
        company, _ = Company.objects.get_or_create(
            name__iexact=company_name,
            defaults={"name": company_name}
        )

        validated_data["company"] = company

        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        company_name = validated_data.pop("company_name", None)

        if company_name:
            company, _ = Company.objects.get_or_create(
                name__iexact=company_name,
                defaults={"name": company_name}
            )
            instance.company = company

        # update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance