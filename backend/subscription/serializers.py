from rest_framework import serializers
from .models import Subscription, SubscriptionPlan


class CreateCheckoutSessionSerializer(serializers.Serializer):
    plan_id = serializers.IntegerField()


class PublicSubscriptionPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = SubscriptionPlan
        fields = [
            "id",
            "name",
            "description",
            "price",
            "currency",
            "billing_interval",
            "features",
            "sort_order",
        ]

class SubscriptionSerializer(serializers.ModelSerializer):
    plan = PublicSubscriptionPlanSerializer(read_only=True)
    class Meta:
        model = Subscription
        fields = [
            "plan",
            "status",
            "start_date",
            "expiry_date",
            "cancel_at_period_end"
        ]

class SubscriptionPlanSerializer(serializers.ModelSerializer):

    class Meta:
        model = SubscriptionPlan
        fields = [
            "id",
            "name",
            "description",
            "price",
            "currency",
            "billing_interval",
            "features",
            "is_active",
            "sort_order",
            "stripe_product_id",
            "stripe_price_id",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "id",
            "stripe_product_id",
            "stripe_price_id",
            "created_at",
            "updated_at",
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