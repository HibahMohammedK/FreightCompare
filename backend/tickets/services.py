from django.db import transaction
from django.db.models import Count, Min, Q
from django.utils import timezone

from chat.services import ConversationService
from notifications.models import Notification
from notifications.utils import send_notification
from realtime.broadcaster import RealtimeBroadcaster
from realtime.events import (
    TICKET_ASSIGNED,
    TICKET_STATUS_CHANGED,
)
from users.models import User

from .models import Ticket
from .serializers import TicketListSerializer


# ============================================================
# TICKET ASSIGNMENT SERVICE
# ============================================================


class TicketAssignmentService:
    """
    Handles automatic assignment of tickets to support staff
    using workload balancing and round-robin selection.
    """

    ACTIVE_STATUSES = (
        "assigned",
        "in_progress",
        "resolved",
    )

    @classmethod
    def assign(cls, ticket):
        """
        Assign a newly created ticket to the most suitable
        staff member.
        """

        available_staff = cls._get_available_staff()

        if not available_staff.exists():
            return ticket

        candidates = cls._get_least_loaded_staff(
            available_staff
        )

        staff = cls._select_round_robin(
            candidates
        )

        return cls._apply_assignment(
            ticket,
            staff,
        )

    @classmethod
    def _apply_assignment(
        cls,
        ticket,
        staff,
    ):
        """
        Apply a ticket assignment, notify the assignee,
        and broadcast the assignment event.
        """

        with transaction.atomic():
            ticket.assigned_staff = staff

            if ticket.assigned_at is None:
                ticket.assigned_at = timezone.now()

            if ticket.status == "open":
                ticket.status = "assigned"

            ticket.save(
                update_fields=[
                    "assigned_staff",
                    "assigned_at",
                    "status",
                    "updated_at",
                ]
            )

            ConversationService.create_conversation(
                ticket
            )

        send_notification(
            user=staff,
            title="New Ticket Assigned",
            message=(
                f"Ticket #{ticket.ticket_number} "
                "has been assigned to you."
            ),
            notification_type=Notification.TICKET,
            ticket=ticket,
        )

        data = TicketListSerializer(ticket).data

        RealtimeBroadcaster.broadcast_to_group(
            group_name=f"staff_{staff.id}",
            event=TICKET_ASSIGNED,
            data=data,
        )

        RealtimeBroadcaster.broadcast_to_group(
            group_name="admins",
            event=TICKET_ASSIGNED,
            data=data,
        )

        return ticket

    @staticmethod
    def _get_available_staff():
        """
        Prefer online staff.
        If none are online, fall back to busy staff.
        """

        online_staff = User.objects.filter(
            role="staff",
            status="online",
        )

        if online_staff.exists():
            return online_staff

        return User.objects.filter(
            role="staff",
            status="busy",
        )

    @staticmethod
    def _get_least_loaded_staff(staff_queryset):
        staff_with_load = staff_queryset.annotate(
            active_ticket_count=Count(
                "assigned_tickets",
                filter=Q(
                    assigned_tickets__status__in=(
                        TicketAssignmentService.ACTIVE_STATUSES
                    )
                ),
            )
        )

        minimum_load = staff_with_load.aggregate(
            Min("active_ticket_count")
        )["active_ticket_count__min"]

        return staff_with_load.filter(
            active_ticket_count=minimum_load
        ).order_by("email")

    @staticmethod
    def _select_round_robin(candidates):
        candidates = list(candidates)

        if len(candidates) == 1:
            return candidates[0]

        last_ticket = (
            Ticket.objects.filter(
                assigned_staff__in=candidates,
                assigned_at__isnull=False,
            )
            .order_by("-assigned_at")
            .first()
        )

        if not last_ticket:
            return candidates[0]

        candidate_ids = [
            staff.id
            for staff in candidates
        ]

        if last_ticket.assigned_staff.id not in candidate_ids:
            return candidates[0]

        current_index = candidate_ids.index(
            last_ticket.assigned_staff.id
        )

        next_index = (
            current_index + 1
        ) % len(candidates)

        return candidates[next_index]

    @classmethod
    def assign_to_staff(cls, ticket, staff):
        """
        Manually assign or reassign a ticket to a staff member.
        """

        return cls._apply_assignment(
            ticket=ticket,
            staff=staff,
        )

    @classmethod
    def assign_pending_tickets(cls):
        """
        Assign all pending unassigned tickets when staff
        become available.
        Returns the number of tickets assigned.
        """

        pending_tickets = (
            Ticket.objects
            .filter(
                assigned_staff__isnull=True,
                status="open",
            )
            .order_by("created_at")
        )

        assigned_count = 0

        for ticket in pending_tickets:
            updated_ticket = cls.assign(ticket)

            if updated_ticket.assigned_staff is None:
                break

            assigned_count += 1

        return assigned_count


# ============================================================
# TICKET STATUS SERVICE
# ============================================================


class TicketStatusService:

    @classmethod
    def change_status(
        cls,
        ticket,
        status,
    ):
        """
        Update ticket status, manage status timestamps,
        notify the customer when necessary,
        and broadcast the change in realtime.
        """

        with transaction.atomic():
            ticket.status = status

            if (
                status == "resolved"
                and ticket.resolved_at is None
            ):
                ticket.resolved_at = timezone.now()

            if (
                status == "closed"
                and ticket.closed_at is None
            ):
                ticket.closed_at = timezone.now()

            ticket.save(
                update_fields=[
                    "status",
                    "resolved_at",
                    "closed_at",
                    "updated_at",
                ]
            )

            # Close the conversation when the ticket is closed
            if status == "closed":
                conversation = getattr(
                    ticket,
                    "conversation",
                    None,
                )

                if conversation:
                    ConversationService.close_conversation(
                        conversation
                    )

        # Customer notification
        if status == "resolved":
            send_notification(
                user=ticket.customer,
                title="Ticket Resolved",
                message=(
                    f"Your ticket #{ticket.ticket_number} "
                    "has been resolved."
                ),
                notification_type=Notification.TICKET,
                ticket=ticket,
            )

        elif status == "closed":
            send_notification(
                user=ticket.customer,
                title="Ticket Closed",
                message=(
                    f"Your ticket #{ticket.ticket_number} "
                    "has been closed."
                ),
                notification_type=Notification.TICKET,
                ticket=ticket,
            )

        # Realtime update
        data = TicketListSerializer(ticket).data

        if ticket.assigned_staff:
            RealtimeBroadcaster.broadcast_to_group(
                group_name=(
                    f"staff_{ticket.assigned_staff.id}"
                ),
                event=TICKET_STATUS_CHANGED,
                data=data,
            )

        RealtimeBroadcaster.broadcast_to_group(
            group_name=f"customer_{ticket.customer.id}",
            event=TICKET_STATUS_CHANGED,
            data=data,
        )

        RealtimeBroadcaster.broadcast_to_group(
            group_name="admins",
            event=TICKET_STATUS_CHANGED,
            data=data,
        )

        return ticket