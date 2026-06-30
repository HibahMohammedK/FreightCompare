from rest_framework import serializers
from .models import Subscription


class CreateCheckoutSessionSerializer(serializers.Serializer):
    pass




class SubscriptionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Subscription
        fields = [
            "status",
            "start_date",
            "expiry_date",
            "cancel_at_period_end"
        ]