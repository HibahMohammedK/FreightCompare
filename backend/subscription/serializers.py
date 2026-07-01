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

class AdminSubscriptionSerializer(serializers.ModelSerializer):

    user_id = serializers.UUIDField(
        source="user.id",
        read_only=True,
    )

    user_name = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    email = serializers.EmailField(
        source="user.email",
        read_only=True,
    )

    plan = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = [
            "id",
            "user_id",
            "user_name",
            "email",
            "plan",
            "status",
            "start_date",
            "expiry_date",
            "cancel_at_period_end",
        ]

    def get_plan(self, obj):

        return (
            "premium"
            if obj.status == "active"
            else "basic"
        )