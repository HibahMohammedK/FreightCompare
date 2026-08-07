from rest_framework import serializers

from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    conversation = serializers.UUIDField(
        source="conversation.id",
        read_only=True,
    )
    sender = serializers.UUIDField(source="sender.id", read_only=True)
    sender_name = serializers.CharField(source="sender.full_name", read_only=True)
    sender_email = serializers.EmailField(source="sender.email", read_only=True)

    class Meta:
        model = Message
        fields = [
            "id",
            "conversation",
            "sender",
            "sender_name",
            "sender_email",
            "message",
            "is_read",
            "created_at",
        ]
        read_only_fields = fields


class SendMessageSerializer(serializers.Serializer):
    conversation = serializers.UUIDField()
    message = serializers.CharField(
        max_length=5000,
        trim_whitespace=True,
    )

    def validate_message(self, value):
        if not value.strip():
            raise serializers.ValidationError(
                "Message cannot be empty."
            )
        return value


class ConversationListSerializer(serializers.ModelSerializer):
    ticket_id = serializers.UUIDField(source="ticket.id", read_only=True)
    ticket_number = serializers.CharField(source="ticket.ticket_number", read_only=True)

    customer_name = serializers.SerializerMethodField()
    staff_name = serializers.SerializerMethodField()

    last_message = serializers.SerializerMethodField()
    last_message_at = serializers.SerializerMethodField()
    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id",
            "ticket_id",
            "ticket_number",
            "customer_name",
            "staff_name",
            "status",
            "last_message",
            "last_message_at",
            "unread_count",
            "updated_at",
        ]

    def get_customer_name(self, obj):
            return obj.customer.first_name or obj.customer.username
    
    def get_staff_name(self, obj):
        if not obj.staff:
            return None

        return obj.staff.first_name or obj.staff.username

    def get_last_message(self, obj):
        message = obj.messages.order_by("-created_at").first()
        return message.message if message else None

    def get_last_message_at(self, obj):
        message = obj.messages.order_by("-created_at").first()
        return message.created_at if message else None

    def get_unread_count(self, obj):
        request = self.context.get("request")

        if not request:
            return 0

        return (
            obj.messages.exclude(sender=request.user)
            .filter(is_read=False)
            .count()
        )


class ConversationDetailSerializer(serializers.ModelSerializer):
    ticket_id = serializers.UUIDField(source="ticket.id", read_only=True)
    ticket_number = serializers.CharField(source="ticket.ticket_number", read_only=True)

    customer_name = serializers.SerializerMethodField()
    staff_name = serializers.SerializerMethodField()
    
    messages = MessageSerializer(
        many=True,
        read_only=True,
    )

    customer_profile_image = serializers.ImageField(
        source="customer.profile_image",
        read_only=True,
    )

    staff_profile_image = serializers.ImageField(
        source="staff.profile_image",
        read_only=True,
        allow_null=True,
    )

    class Meta:
        model = Conversation
        fields = [
            "id",
            "ticket_id",
            "ticket_number",
            "customer",
            "customer_name",
            "staff",
            "staff_name",
            "status",
            "messages",
            "customer_profile_image",
            "staff_profile_image",
            "created_at",
            "updated_at",
        ]
        
    def get_customer_name(self, obj):
                return obj.customer.first_name or obj.customer.username
        
    def get_staff_name(self, obj):
        if not obj.staff:
            return None

        return obj.staff.first_name or obj.staff.username