from django.shortcuts import get_object_or_404

from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Conversation
from .permissions import (
    CanSendMessage,
    IsConversationParticipant,
)
from .serializers import (
    ConversationDetailSerializer,
    ConversationListSerializer,
    MessageSerializer,
    SendMessageSerializer,
)
from .services import ConversationService, MessageService


class ConversationListAPIView(generics.ListAPIView):
    serializer_class = ConversationListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ConversationService.get_conversations(self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class ConversationDetailAPIView(generics.RetrieveAPIView):
    serializer_class = ConversationDetailSerializer
    permission_classes = [
        permissions.IsAuthenticated,
        IsConversationParticipant,
    ]
    lookup_field = "id"

    def get_object(self):
        conversation = ConversationService.get_conversation(
            self.request.user,
            self.kwargs["id"],
        )

        self.check_object_permissions(
            self.request,
            conversation,
        )

        return conversation


class SendMessageAPIView(APIView):
    permission_classes = [
                permissions.IsAuthenticated,
                CanSendMessage,
            ]

    def post(self, request):
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        conversation = ConversationService.get_conversation(
            request.user,
            serializer.validated_data["conversation"],
        )

        self.check_object_permissions(request, conversation)

        message = MessageService.send_message(
            conversation=conversation,
            sender=request.user,
            content=serializer.validated_data["message"],
        )

        return Response(
            MessageSerializer(message).data,
            status=status.HTTP_201_CREATED,
        )


class MarkMessagesReadAPIView(APIView):
    permission_classes = [
        permissions.IsAuthenticated,
        IsConversationParticipant,
    ]

    def post(self, request, id):
        conversation = ConversationService.get_conversation(
            request.user,
            id,
        )

        self.check_object_permissions(request, conversation)

        updated = MessageService.mark_messages_as_read(
            conversation,
            request.user,
        )

        return Response(
            {
                "messages_marked_read": updated
            },
            status=status.HTTP_200_OK,
        )