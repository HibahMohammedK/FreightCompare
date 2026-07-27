from django.db import transaction
from django.db.models import Count, Min, Q
from django.utils import timezone

from users.models import User

from .models import Ticket


class TicketAssignmentService:
    """
    Handles automatic assignment of tickets to support staff
    using workload balancing and round-robin selection.
    """

    ACTIVE_STATUSES = (
            "assigned",
            "in_progress",
            "waiting_customer",
            "resolved",
        )

    @staticmethod
    def assign(ticket):
        """
        Assign a newly created ticket to the most suitable staff member.
        """

        available_staff = TicketAssignmentService._get_available_staff()

        if not available_staff.exists():
            return ticket

        candidates = TicketAssignmentService._get_least_loaded_staff(
            available_staff
        )

        staff = TicketAssignmentService._select_round_robin(
            candidates
        )

        with transaction.atomic():
            ticket.assigned_staff = staff
            ticket.status = "assigned"
            ticket.assigned_at = timezone.now()

            ticket.save(
                update_fields=[
                    "assigned_staff",
                    "status",
                    "assigned_at",
                ]
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
                    assigned_tickets__status__in=TicketAssignmentService.ACTIVE_STATUSES
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

        candidate_ids = [staff.id for staff in candidates]

        if last_ticket.assigned_staff.id not in candidate_ids:
            return candidates[0]

        current_index = candidate_ids.index(
            last_ticket.assigned_staff.id
        )

        next_index = (current_index + 1) % len(candidates)

        return candidates[next_index]