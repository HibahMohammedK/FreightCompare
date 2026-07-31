from django.urls import path

from .views import (
    ConversationDetailAPIView,
    ConversationListAPIView,
    MarkMessagesReadAPIView,
    SendMessageAPIView,
)

urlpatterns = [
    path(
        "conversations/",
        ConversationListAPIView.as_view(),
        name="conversation-list",
    ),
    path(
        "conversations/<uuid:id>/",
        ConversationDetailAPIView.as_view(),
        name="conversation-detail",
    ),
    path(
        "messages/",
        SendMessageAPIView.as_view(),
        name="send-message",
    ),
    path(
        "conversations/<uuid:id>/read/",
        MarkMessagesReadAPIView.as_view(),
        name="mark-messages-read",
    ),
]