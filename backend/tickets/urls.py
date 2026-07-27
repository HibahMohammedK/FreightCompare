from django.urls import path

from .views import (
    TicketCreateAPIView,
    TicketDetailAPIView,
    TicketListAPIView,
    TicketStatusAPIView,
)

urlpatterns = [
    path("", TicketListAPIView.as_view(), name="ticket-list"),
    path("create/", TicketCreateAPIView.as_view(), name="ticket-create"),
    path("<uuid:pk>/", TicketDetailAPIView.as_view(), name="ticket-detail"),
    path("<uuid:pk>/status/", TicketStatusAPIView.as_view(), name="ticket-status"),
]