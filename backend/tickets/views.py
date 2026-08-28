from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    ListAPIView,
    RetrieveAPIView,
    UpdateAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from realtime.broadcaster import RealtimeBroadcaster
from realtime.events import TICKET_CREATED
from subscription.utils import has_feature

from .models import Ticket
from .permissions import (
    CanUpdateTicket,
    CanViewTicket,
    IsAdmin,
    IsCustomer,
)
from .serializers import (
    TicketAssignSerializer,
    TicketBulkReassignSerializer,
    TicketCreateSerializer,
    TicketDetailSerializer,
    TicketListSerializer,
    TicketStatusSerializer,
)
from .services import (
    TicketAssignmentService,
    TicketStatusService,
)


# ============================================================
# TICKET CREATION
# ============================================================


class TicketCreateAPIView(CreateAPIView):
    serializer_class = TicketCreateSerializer

    permission_classes = [
        IsAuthenticated,
        IsCustomer,
    ]

    def create(self, request, *args, **kwargs):
        if not has_feature(
            request.user,
            "support_tickets",
        ):
            return Response(
                {
                    "code": "FEATURE_NOT_AVAILABLE",
                    "detail": (
                        "Support tickets are not available "
                        "on your current subscription plan."
                    ),
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

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


# ============================================================
# TICKET LIST
# ============================================================


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
            staff_id = self.request.query_params.get(
                "assigned_staff"
            )

            if staff_id == "unassigned":
                return queryset.filter(
                    assigned_staff__isnull=True
                )

            if staff_id:
                return queryset.filter(
                    assigned_staff_id=staff_id
                )

            return queryset

        if user.role == "staff":
            return queryset.filter(
                assigned_staff=user,
            )

        return queryset.filter(
            customer=user,
        )


# ============================================================
# TICKET DETAIL
# ============================================================


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


# ============================================================
# TICKET STATUS
# ============================================================


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


# ============================================================
# TICKET ASSIGNMENT
# ============================================================


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

        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        staff = serializer.validated_data[
            "assigned_staff"
        ]

        ticket = TicketAssignmentService.assign_to_staff(
            ticket=ticket,
            staff=staff,
        )

        return Response(
            TicketDetailSerializer(ticket).data,
            status=status.HTTP_200_OK,
        )


# ============================================================
# BULK TICKET REASSIGNMENT
# ============================================================


class TicketBulkReassignAPIView(APIView):
    """
    Reassign all tickets from one staff member to another.
    Only administrators can perform this action.
    """

    permission_classes = [
        IsAuthenticated,
        IsAdmin,
    ]

    def patch(self, request):
        serializer = TicketBulkReassignSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        source_staff = serializer.validated_data[
            "source_staff"
        ]

        target_staff = serializer.validated_data[
            "target_staff"
        ]

        updated_count = (
            Ticket.objects
            .filter(
                assigned_staff=source_staff
            )
            .exclude(
                status="closed"
            )
            .update(
                assigned_staff=target_staff
            )
        )

        return Response(
            {
                "message": (
                    f"{updated_count} ticket(s) "
                    "reassigned successfully."
                ),
                "updated_count": updated_count,
            },
            status=status.HTTP_200_OK,
        )