from rest_framework.permissions import BasePermission

from .models import Conversation


class IsConversationParticipant(BasePermission):
    """
    Allows access only to the conversation participants or admin.
    """

    message = "You do not have permission to access this conversation."

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.role == "admin":
            return True

        return (
            obj.customer_id == user.id
            or obj.staff_id == user.id
        )


class CanSendMessage(BasePermission):
    """
    Allows sending messages only in active conversations by participants.
    """

    message = "You cannot send messages in this conversation."

    def has_object_permission(self, request, view, obj):
        user = request.user

        if obj.status != Conversation.Status.ACTIVE:
            return False

        return (
            obj.customer_id == user.id
            or obj.staff_id == user.id
        )