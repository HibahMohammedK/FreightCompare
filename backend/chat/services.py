from django.db import transaction
from django.db.models import Q, Prefetch

from .models import Conversation, Message
from notifications.utils import send_notification
from notifications.models import Notification
from realtime.broadcaster import RealtimeBroadcaster
from .serializers import MessageSerializer
from realtime.events import CHAT_MESSAGE



class ConversationService:
    @staticmethod
    @transaction.atomic
    def create_conversation(ticket):
        """
        Create a conversation for a ticket if one doesn't already exist.
        """

        conversation, _ = Conversation.objects.get_or_create(
            ticket=ticket,
            defaults={
                "customer": ticket.customer,
                "staff": ticket.assigned_staff,
            },
        )

        return conversation

    @staticmethod
    def get_conversation(user, conversation_id):
        queryset = Conversation.objects.select_related(
            "ticket",
            "customer",
            "staff",
        ).prefetch_related(
            Prefetch(
                "messages",
                queryset=Message.objects.select_related("sender").order_by("created_at"),
            )
        )
        if user.is_superuser:
            return queryset.get(id=conversation_id)

        return queryset.get(
            Q(customer=user) | Q(staff=user),
            id=conversation_id,
        )

    @staticmethod
    def get_conversations(user):
        queryset = Conversation.objects.select_related(
            "ticket",
            "customer",
            "staff",
        )

        if user.is_superuser:
            return queryset

        return queryset.filter(
            Q(customer=user) | Q(staff=user)
        ).order_by("-updated_at")


    @staticmethod
    @transaction.atomic
    def close_conversation(conversation):
        conversation.status = Conversation.Status.CLOSED
        conversation.save(update_fields=["status", "updated_at"])

        return conversation


class MessageService:

    @staticmethod
    @transaction.atomic
    def send_message(
        conversation,
        sender,
        content,
    ):
        """
        Create a new chat message and broadcast it in realtime.
        """

        chat_message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            message=content,
        )

        if sender == conversation.customer:
            recipient = conversation.staff
        else:
            recipient = conversation.customer

        # Update conversation activity
        conversation.save()

        if recipient:
            send_notification(
                user=recipient,
                title="New message",
                message=f"{sender.username} sent you a message.",
                notification_type=Notification.CHAT,
                ticket=conversation.ticket,
            )
        

        data=MessageSerializer(chat_message).data
    

        RealtimeBroadcaster.broadcast_to_group(
            group_name=f"conversation_{conversation.id}",
            event=CHAT_MESSAGE,
            data=data,
        )

        return chat_message


    @staticmethod
    @transaction.atomic
    def mark_messages_as_read(conversation, user):
        """
        Mark all unread messages from the other participant as read.
        """

        return (
            conversation.messages.exclude(sender=user)
            .filter(is_read=False)
            .update(is_read=True)
        )


    @staticmethod
    def get_messages(conversation):
        return (
            conversation.messages
            .select_related("sender")
            .order_by("created_at")
        )