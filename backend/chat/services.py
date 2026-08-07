from django.db import transaction
from django.db.models import Q, Prefetch

from .models import Conversation, Message
from notifications.utils import send_notification
from notifications.models import Notification
from realtime.broadcaster import RealtimeBroadcaster
from .serializers import MessageSerializer
from realtime.events import CHAT_MESSAGE, CHAT_READ, TICKET_UPDATED
from tickets.serializers import TicketListSerializer




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
    def _serialize_ticket(ticket, user=None):
        return TicketListSerializer(
            ticket,
            context={"request_user": user} if user else {},
        ).data

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



        ticket = conversation.ticket

        if ticket.assigned_staff:
            RealtimeBroadcaster.broadcast_to_group(
                group_name=f"staff_{ticket.assigned_staff.id}",
                event=TICKET_UPDATED,
                data=MessageService._serialize_ticket(
                    ticket,
                    ticket.assigned_staff,
                ),
            )

        RealtimeBroadcaster.broadcast_to_group(
            group_name=f"customer_{ticket.customer.id}",
            event=TICKET_UPDATED,
            data=MessageService._serialize_ticket(
                ticket,
                ticket.customer,
            ),
        )

        RealtimeBroadcaster.broadcast_to_group(
            group_name="admins",
            event=TICKET_UPDATED,
            data=MessageService._serialize_ticket(ticket),
        )

        return chat_message


    @staticmethod
    @transaction.atomic
    def mark_messages_as_read(conversation, user):
        """
        Mark all unread messages from the other participant as read
        and notify the sender in realtime.
        """

        messages = (
            conversation.messages
            .exclude(sender=user)
            .filter(is_read=False)
        )

        message_ids = list(
            messages.values_list("id", flat=True)
        )

        updated = messages.update(is_read=True)

        if updated:
            RealtimeBroadcaster.broadcast_to_group(
                group_name=f"conversation_{conversation.id}",
                event=CHAT_READ,
                data={
                    "conversation": str(conversation.id),
                    "message_ids": [
                        str(message_id)
                        for message_id in message_ids
                    ],
                    "reader": str(user.id),
                },
            )

        ticket = conversation.ticket

        if ticket.assigned_staff:
            RealtimeBroadcaster.broadcast_to_group(
                group_name=f"staff_{ticket.assigned_staff.id}",
                event=TICKET_UPDATED,
                data=MessageService._serialize_ticket(
                    ticket,
                    ticket.assigned_staff,
                ),
            )

        RealtimeBroadcaster.broadcast_to_group(
            group_name=f"customer_{ticket.customer.id}",
            event=TICKET_UPDATED,
            data=MessageService._serialize_ticket(
                ticket,
                ticket.customer,
            ),
        )

        return updated
    


    @staticmethod
    def get_messages(conversation):
        return (
            conversation.messages
            .select_related("sender")
            .order_by("created_at")
        )