from rest_framework import serializers


class TransportSearchSerializer(serializers.Serializer):
    source = serializers.CharField(max_length=255)
    destination = serializers.CharField(max_length=255)

    transport_type = serializers.ChoiceField(
        choices=[
            ("air", "Air"),
            ("sea", "Sea"),
        ]
    )