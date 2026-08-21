from django.urls import path

from .views import ( CreateCheckoutSessionView,
                     StripeWebhookView,
                     CurrentSubscriptionView, 
                     CancelSubscriptionView,
                     AdminSubscriptionListView,
                     AdminSubscriptionPlanListCreateView,
                     AdminSubscriptionPlanDetailView,
                     SubscriptionPlanListView,
                     SubscriptionHistoryView)

urlpatterns = [
    path("create-checkout-session/", CreateCheckoutSessionView.as_view(), name="create-checkout-session"),
    path("webhook/", StripeWebhookView.as_view(), ),
    path("me/",CurrentSubscriptionView.as_view(), name="current-subscription"),
    path("cancel/", CancelSubscriptionView.as_view(), name="cancel-subscription"),
    path("plans/", SubscriptionPlanListView.as_view(), name="subscription-plan-list"),
    path("admin/plans/", AdminSubscriptionPlanListCreateView.as_view(), name="admin-subscription-plan-list-create"),
    path("admin/subscriptions/", AdminSubscriptionListView.as_view(), name="admin-subscriptions"),
    path("admin/plans/<int:pk>/", AdminSubscriptionPlanDetailView.as_view(), name="admin-subscription-plan-detail"),
    path("history/", SubscriptionHistoryView.as_view(), name="subscription-history"),
]