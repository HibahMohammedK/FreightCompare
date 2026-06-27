from rest_framework import serializers
from .models import SavedTransport, Transport


class SavedTransportSerializer(serializers.ModelSerializer):
    transport = serializers.PrimaryKeyRelatedField(
        queryset=Transport.objects.all(),
        write_only=True,
    )
    saved_id = serializers.IntegerField(source="id", read_only=True)

    id = serializers.IntegerField(source="transport.id", read_only=True)
    company = serializers.CharField(source="transport.company", read_only=True)
    transport_type = serializers.CharField(source="transport.transport_type", read_only=True)
    source = serializers.CharField(source="transport.source", read_only=True)
    destination = serializers.CharField(source="transport.destination", read_only=True)
    price = serializers.DecimalField(
        source="transport.price",
        max_digits=10,
        decimal_places=2,
        read_only=True,
    )
    duration = serializers.IntegerField(source="transport.duration", read_only=True)
    departure_date = serializers.DateField(source="transport.departure_date", read_only=True)
    booking_url = serializers.URLField(source="transport.booking_url", read_only=True)

    class Meta:
        model = SavedTransport
        fields = [
            "transport",
            "saved_id",
            "id",
            "company",
            "transport_type",
            "source",
            "destination",
            "price",
            "duration",
            "departure_date",
            "booking_url",
            "created_at",
        ]
        read_only_fields = [
            "saved_id",
            "id",
            "created_at",
        ]

    def validate(self, data):
        user = self.context["request"].user
        transport = data.get("transport")

        if SavedTransport.objects.filter(user=user, transport=transport).exists():
            raise serializers.ValidationError("Already saved.")

        return data

    def create(self, validated_data):
        user = self.context["request"].user
        return SavedTransport.objects.create(
            user=user,
            **validated_data,
        )