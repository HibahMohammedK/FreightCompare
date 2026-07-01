from django.urls import path

from .views import ( CreateCheckoutSessionView,
                     StripeWebhookView,
                     CurrentSubscriptionView, 
                     CancelSubscriptionView,
                     AdminSubscriptionListView)

urlpatterns = [
    path("create-checkout-session/", CreateCheckoutSessionView.as_view(), name="create-checkout-session",),
    path("webhook/", StripeWebhookView.as_view(), ),
    path("me/",CurrentSubscriptionView.as_view(), name="current-subscription",),
    path("cancel/", CancelSubscriptionView.as_view(), name="cancel-subscription",),
    path("admin/subscriptions/", AdminSubscriptionListView.as_view(), name="admin-subscriptions", ),
]