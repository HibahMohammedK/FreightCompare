from notifications.models import Notification
from notifications.utils import send_notification

from .models import SearchHistory


def check_route_matches(transport):
    """
    Notify users whose previous searches match
    a newly created transport.
    """

    matching_searches = SearchHistory.objects.filter(
        source__iexact=transport.source,
        destination__iexact=transport.destination,
        transport_type__in=[
            "all",
            transport.transport_type,
        ],
    ).select_related("user")

    for search in matching_searches:

        # Prevent duplicate notification for the same transport
        if Notification.objects.filter(
            user=search.user,
            transport=transport,
            type=Notification.ROUTE_MATCH,
        ).exists():
            continue

        send_notification(
            user=search.user,
            transport=transport,
            title="New Route Available",
            message=(
                f"A new {transport.transport_type.title()} transport "
                f"from {transport.source} → {transport.destination} "
                f"is now available."
            ),
            notification_type=Notification.ROUTE_MATCH,
        )