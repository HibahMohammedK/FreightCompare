from rest_framework import serializers
from .models import SavedTransport


class SavedTransportSerializer(serializers.ModelSerializer):
    transport_details = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = SavedTransport
        fields = [
            "id",
            "transport",
            "transport_details",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]

    def get_transport_details(self, obj):
        t = obj.transport
        return {
            "id": t.id,
            "company": str(t.company),
            "transport_type": t.transport_type,
            "source": t.source,
            "destination": t.destination,
            "price": t.price,
            "duration": t.duration,
            "departure_date": t.departure_date,
        }

    def validate(self, data):
        user = self.context["request"].user
        transport = data.get("transport")

        if SavedTransport.objects.filter(user=user, transport=transport).exists():
            raise serializers.ValidationError("Already saved.")

        return data

    def create(self, validated_data):
        user = self.context["request"].user
        return SavedTransport.objects.create(user=user, **validated_data)