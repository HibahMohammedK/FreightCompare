from rest_framework import serializers

from .models import Ticket
from users.models import User

class TicketCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for customers to create a new ticket.
    """

    class Meta:
        model = Ticket
        fields = (
            "subject",
            "description",
            "category",
            "priority",
        )

    def validate_subject(self, value):
        value = value.strip()

        if len(value) < 5:
            raise serializers.ValidationError(
                "Subject must be at least 5 characters long."
            )

        return value

    def validate_description(self, value):
        value = value.strip()

        if len(value) < 20:
            raise serializers.ValidationError(
                "Description must be at least 20 characters long."
            )

        return value


class TicketListSerializer(serializers.ModelSerializer):
    """
    Serializer used when listing tickets.
    """

    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()

    assigned_staff = serializers.UUIDField(
        source="assigned_staff.id",
        allow_null=True,
        read_only=True,
    )
    assigned_staff_name = serializers.SerializerMethodField()
    assigned_staff_email = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = (
            "id",
            "ticket_number",
            "subject",
            "category",
            "priority",
            "status",
            "customer_name",
            "customer_email",
            "assigned_staff",
            "assigned_staff_name",
            "assigned_staff_email",
            "created_at",
        )

    def get_customer_name(self, obj):
        full_name = obj.customer.get_full_name().strip()

        return full_name or obj.customer.username

    def get_customer_email(self, obj):
        return obj.customer.email

    def get_assigned_staff_name(self, obj):
        if not obj.assigned_staff:
            return None

        full_name = obj.assigned_staff.get_full_name().strip()

        return full_name or obj.assigned_staff.username

    def get_assigned_staff_email(self, obj):
        if obj.assigned_staff:
            return obj.assigned_staff.email

        return None


class TicketDetailSerializer(serializers.ModelSerializer):
    """
    Serializer for retrieving ticket details.
    """
    conversation_id = serializers.UUIDField(
        source="conversation.id",
        read_only=True,
        allow_null=True,
    )

    customer_name = serializers.SerializerMethodField()

    customer_email = serializers.EmailField(
        source="customer.email",
        read_only=True,
    )

    assigned_staff = serializers.UUIDField(
        source="assigned_staff.id",
        allow_null=True,
        read_only=True,
    )

    assigned_staff_name = serializers.SerializerMethodField()

    assigned_staff_email = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = (
            "id",
            "ticket_number",
            "subject",
            "description",
            "category",
            "priority",
            "status",
            "conversation_id",
            "customer",
            "customer_name",
            "customer_email",
            "assigned_staff",
            "assigned_staff_name",
            "assigned_staff_email",
            "created_at",
            "updated_at",
            "assigned_at",
            "resolved_at",
            "closed_at",
        )
        read_only_fields = fields

    def get_customer_name(self, obj):
        full_name = obj.customer.get_full_name().strip()

        if full_name:
            return full_name

        return obj.customer.username

    def get_assigned_staff_name(self, obj):
        if not obj.assigned_staff:
            return None

        full_name = obj.assigned_staff.get_full_name().strip()

        if full_name:
            return full_name

        return obj.assigned_staff.username

    def get_assigned_staff_email(self, obj):
        if obj.assigned_staff:
            return obj.assigned_staff.email

        return None

class TicketStatusSerializer(serializers.ModelSerializer):
    """
    Serializer for updating ticket status.
    """

    class Meta:
        model = Ticket
        fields = (
            "status",
        )


class TicketAssignSerializer(serializers.Serializer):
    assigned_staff = serializers.UUIDField()

    def validate_assigned_staff(self, value):
        try:
            staff = User.objects.get(
                id=value,
                role="staff",
                is_active=True,
            )
        except User.DoesNotExist:
            raise serializers.ValidationError(
                "Selected staff member does not exist."
            )

        return staff