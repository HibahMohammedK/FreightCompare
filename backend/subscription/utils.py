import stripe

from django.conf import settings

from .models import Subscription, SubscriptionPlan


# ============================================================
# USER SUBSCRIPTION
# ============================================================


def get_user_subscription(user):
    try:
        subscription = user.subscription

        if subscription.status != "active":
            return None

        return subscription

    except Subscription.DoesNotExist:
        return None


def get_user_plan(user):
    subscription = get_user_subscription(user)

    if not subscription:
        return None

    return subscription.plan


def has_feature(user, feature):
    plan = get_user_plan(user)

    if not plan:
        return False

    return feature in plan.features


def get_plan_limit(user, limit_name, default=0):
    plan = get_user_plan(user)

    if not plan:
        return default

    return plan.limits.get(
        limit_name,
        default,
    )


def is_premium(user):
    try:
        return user.subscription.status == "active"

    except Subscription.DoesNotExist:
        return False


# ============================================================
# STRIPE
# ============================================================


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