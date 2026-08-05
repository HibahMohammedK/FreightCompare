from rest_framework import status
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, UpdateAPIView, ListAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from realtime.broadcaster import RealtimeBroadcaster
from realtime.events import TICKET_CREATED

from .models import Ticket
from .serializers import (
    TicketCreateSerializer,
    TicketDetailSerializer,
    TicketListSerializer,
    TicketStatusSerializer,
    TicketAssignSerializer
)
from .services import TicketAssignmentService,TicketStatusService
from .permissions import CanViewTicket, IsCustomer, CanUpdateTicket, IsAdmin


class TicketCreateAPIView(CreateAPIView):
    serializer_class = TicketCreateSerializer
    permission_classes = [IsAuthenticated, IsCustomer]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ticket = serializer.save(
            customer=request.user,
        )

        TicketAssignmentService.assign(ticket)
        ticket.refresh_from_db()

        RealtimeBroadcaster.broadcast_to_group(
            group_name="admins",
            event=TICKET_CREATED,
            data=TicketListSerializer(ticket).data,
        )

        return Response(
            TicketListSerializer(ticket).data,
            status=status.HTTP_201_CREATED,
        )

class TicketListAPIView(ListAPIView):
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



class TicketDetailAPIView(RetrieveAPIView):
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
    

class TicketStatusAPIView(UpdateAPIView):
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

    def update(self, request, *args, **kwargs):

        ticket = self.get_object()

        serializer = self.get_serializer(
            ticket,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        ticket = TicketStatusService.change_status(
            ticket=ticket,
            status=serializer.validated_data["status"],
        )

        return Response(
            TicketDetailSerializer(ticket).data,
            status=status.HTTP_200_OK,
        )
    
class TicketAssignAPIView(UpdateAPIView):
    """
    Assign or reassign a ticket to a staff member.
    Only administrators can perform this action.
    """

    queryset = Ticket.objects.select_related(
        "customer",
        "assigned_staff",
    )
    serializer_class = TicketAssignSerializer
    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    def update(self, request, *args, **kwargs):
        ticket = self.get_object()

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        staff = serializer.validated_data["assigned_staff"]

        ticket = TicketAssignmentService.assign_to_staff(
            ticket=ticket,
            staff=staff,
        )

        return Response(
            TicketDetailSerializer(ticket).data,
            status=status.HTTP_200_OK,
        )