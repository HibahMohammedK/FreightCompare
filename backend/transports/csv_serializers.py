from rest_framework import serializers


class CsvUploadSerializer(serializers.Serializer):
    file = serializers.FileField()


class TransportCsvRowSerializer(serializers.Serializer):
    company = serializers.CharField(max_length=255)
    transport_type = serializers.ChoiceField(
        choices=["air", "sea"]
    )

    source = serializers.CharField(max_length=255)
    destination = serializers.CharField(max_length=255)

    price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
    )

    duration = serializers.IntegerField()

    departure_date = serializers.DateField()

    booking_url = serializers.URLField()