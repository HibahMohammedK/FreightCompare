from .models import Subscription

def is_premium(user):
    try:
        return user.subscription.status == "active"
    except Subscription.DoesNotExist:
        return False