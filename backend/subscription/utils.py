from .models import Subscription
import stripe
from django.conf import settings
from .models import SubscriptionPlan


def is_premium(user):
    try:
        return user.subscription.status == "active"
    except Subscription.DoesNotExist:
        return False

stripe.api_key = settings.STRIPE_SECRET_KEY


def create_stripe_plan(plan):
    """
    Create a Stripe Product and Price for a SubscriptionPlan.
    """

    product = stripe.Product.create(
        name=plan.name,
        description=plan.description or None,
    )

    stripe_price = stripe.Price.create(
        product=product.id,
        unit_amount=int(plan.price * 100),
        currency=plan.currency.lower(),
        recurring={
            "interval": plan.billing_interval,
        },
    )

    plan.stripe_product_id = product.id
    plan.stripe_price_id = stripe_price.id
    plan.save(
        update_fields=[
            "stripe_product_id",
            "stripe_price_id",
            "updated_at",
        ]
    )

    return plan