from rest_framework import serializers

from .models import Notification


class NotificationSerializer(
    serializers.ModelSerializer
):
    
    transport_id = serializers.IntegerField(
        source="transport.id",
        read_only=True,
    )

    ticket_id = serializers.UUIDField(
        source="ticket.id",
        read_only=True,
    )

    source = serializers.CharField(
        source="transport.source",
        read_only=True,
    )

    destination = serializers.CharField(
        source="transport.destination",
        read_only=True,
    )

    transport_type = serializers.CharField(
        source="transport.transport_type",
        read_only=True,
    )

    class Meta:

        model = Notification

        fields = [
            "id",
            "title",
            "message",
            "type",
            "is_read",
            "created_at",
            "transport_id",
            "ticket_id",
            "source",
            "destination",
            "transport_type",

        ]