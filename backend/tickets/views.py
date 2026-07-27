from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone

from .models import Ticket
from .serializers import (
    TicketCreateSerializer,
    TicketDetailSerializer,
    TicketListSerializer,
    TicketStatusSerializer
)
from .services import TicketAssignmentService
from .permissions import CanViewTicket, IsCustomer, CanUpdateTicket


class TicketCreateAPIView(generics.CreateAPIView):
    """
    Create a new support ticket.
    """

    serializer_class = TicketCreateSerializer
    permission_classes = [IsAuthenticated, IsCustomer]

    def perform_create(self, serializer):
        ticket = serializer.save(
            customer=self.request.user,
        )

        TicketAssignmentService.assign(ticket)



class TicketListAPIView(generics.ListAPIView):
    """
    List tickets based on user role.
    """

    serializer_class = TicketListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        queryset = Ticket.objects.select_related(
            "customer",
            "assigned_staff",
        )

        if user.role == "admin":
            return queryset

        if user.role == "staff":
            return queryset.filter(
                assigned_staff=user,
            )

        return queryset.filter(
            customer=user,
        )



class TicketDetailAPIView(generics.RetrieveAPIView):
    """
    Retrieve a single ticket.
    """

    serializer_class = TicketDetailSerializer
    
    permission_classes = [
        IsAuthenticated,
        CanViewTicket,
    ]

    def get_queryset(self):
        return Ticket.objects.select_related(
            "customer",
            "assigned_staff",
        )
    


class TicketStatusAPIView(generics.UpdateAPIView):
    """
    Update ticket status.
    """

    serializer_class = TicketStatusSerializer

    permission_classes = [
        IsAuthenticated,
        CanUpdateTicket,
    ]

    def get_queryset(self):
        return Ticket.objects.select_related(
            "customer",
            "assigned_staff",
        )

    def perform_update(self, serializer):
        ticket = serializer.save()

        if (
            ticket.status == "resolved"
            and ticket.resolved_at is None
        ):
            ticket.resolved_at = timezone.now()

        if (
            ticket.status == "closed"
            and ticket.closed_at is None
        ):
            ticket.closed_at = timezone.now()

        ticket.save(
            update_fields=[
                "resolved_at",
                "closed_at",
            ]
        )