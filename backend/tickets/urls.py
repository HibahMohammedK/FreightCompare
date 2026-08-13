from django.urls import path

from .views import (
    TicketCreateAPIView,
    TicketDetailAPIView,
    TicketListAPIView,
    TicketStatusAPIView,
    TicketAssignAPIView,
    TicketBulkReassignAPIView
)

urlpatterns = [
    path("", TicketListAPIView.as_view(), name="ticket-list"),
    path("create/", TicketCreateAPIView.as_view(), name="ticket-create"),
    path("<uuid:pk>/", TicketDetailAPIView.as_view(), name="ticket-detail"),
    path("<uuid:pk>/status/", TicketStatusAPIView.as_view(), name="ticket-status"),
    path("<uuid:pk>/assign/", TicketAssignAPIView.as_view(), name="ticket-assign"),
    path("reassign-staff/", TicketBulkReassignAPIView.as_view(), name="ticket-bulk-reassign"),
]