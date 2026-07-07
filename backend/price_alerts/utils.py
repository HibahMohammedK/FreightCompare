from .models import PriceAlert
from notifications.utils import send_notification
from django.utils import timezone

def check_price_alerts(
    transport,
):

    price_alerts = PriceAlert.objects.filter(
        transport=transport,
        is_active=True,
    )

    for price_alert in price_alerts:

        if transport.price <= price_alert.target_price:

            price_alert.is_active = False
            price_alert.status = "triggered"
            price_alert.triggered_at = timezone.now()
            price_alert.triggered_price = transport.price

            price_alert.save(
                update_fields=[
                    "is_active",
                    "status",
                    "triggered_at",
                    "triggered_price",
                ]
            )

            send_notification(
                user=price_alert.user,
                title="Price Alert Triggered",
                message=(
                    f"Your tracked route "
                    f"{transport.source} → {transport.destination} "
                    f"on {transport.departure_date.strftime('%d %b %Y')} "
                    f"is now available for AED {transport.price}."
                ),
                notification_type="price_alert",
            )