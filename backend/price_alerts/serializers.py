from rest_framework import serializers

from .models import PriceAlert


class PriceAlertSerializer(serializers.ModelSerializer):

    class Meta:

        model = PriceAlert

        fields = [
            "id",
            "transport",
            "source",
            "destination",
            "departure_date",
            "transport_type",
            "target_price",
            "is_active",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "is_active",
            "created_at",
            "updated_at",
        ]

    def validate(self, attrs):

        request = self.context.get("request")

        if not request:
            return attrs

        transport = attrs.get(
            "transport",
            self.instance.transport if self.instance else None,
        )

        source = attrs.get(
            "source",
            self.instance.source if self.instance else None,
        )

        destination = attrs.get(
            "destination",
            self.instance.destination if self.instance else None,
        )

        departure_date = attrs.get(
            "departure_date",
            self.instance.departure_date if self.instance else None,
        )

        transport_type = attrs.get(
            "transport_type",
            self.instance.transport_type if self.instance else None,
        )

        target_price = attrs.get(
            "target_price",
            self.instance.target_price if self.instance else None,
        )

        queryset = PriceAlert.objects.filter(
            user=request.user,
            transport=transport,
            source=source,
            destination=destination,
            departure_date=departure_date,
            transport_type=transport_type,
            target_price=target_price,
            is_active=True,
        )

        if self.instance:
            queryset = queryset.exclude(
                pk=self.instance.pk,
            )

        if queryset.exists():

            raise serializers.ValidationError(
                "You already have an active price alert with this target price."
            )

        return attrs