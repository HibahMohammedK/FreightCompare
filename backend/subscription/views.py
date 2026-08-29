import stripe

from datetime import datetime

from django.conf import settings
from django.db.models import Q
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from notifications.models import Notification
from notifications.utils import send_notification
from users.models import User

from .models import (
    Subscription,
    SubscriptionHistory,
    SubscriptionPlan,
)
from .serializers import (
    AdminSubscriptionSerializer,
    CreateCheckoutSessionSerializer,
    PublicSubscriptionPlanSerializer,
    SubscriptionHistorySerializer,
    SubscriptionPlanSerializer,
    SubscriptionSerializer,
)
from .utils import create_stripe_plan


stripe.api_key = settings.STRIPE_SECRET_KEY


# ============================================================
# CREATE CHECKOUT SESSION
# ============================================================


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateCheckoutSessionSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        plan_id = serializer.validated_data["plan_id"]

        try:
            plan = SubscriptionPlan.objects.get(
                id=plan_id,
                is_active=True,
            )

            if not plan.stripe_price_id:
                return Response(
                    {
                        "detail": (
                            "This subscription plan is not "
                            "configured with Stripe."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            checkout_session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="subscription",
                line_items=[
                    {
                        "price": plan.stripe_price_id,
                        "quantity": 1,
                    }
                ],
                customer_email=request.user.email,
                client_reference_id=str(request.user.id),
                metadata={
                    "user_id": str(request.user.id),
                    "plan_id": str(plan.id),
                },
                success_url=(
                    f"{settings.FRONTEND_URL}/subscription/success"
                    "?session_id={CHECKOUT_SESSION_ID}"
                ),
                cancel_url=(
                    f"{settings.FRONTEND_URL}/subscription/cancel"
                ),
            )

            return Response(
                {
                    "checkout_url": checkout_session.url
                },
                status=status.HTTP_200_OK,
            )

        except SubscriptionPlan.DoesNotExist:
            return Response(
                {
                    "detail": (
                        "Subscription plan not found or inactive."
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        except stripe.error.StripeError as e:
            return Response(
                {
                    "detail": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )


# ============================================================
# CURRENT SUBSCRIPTION
# ============================================================


class CurrentSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            subscription = request.user.subscription

            serializer = SubscriptionSerializer(
                subscription
            )

            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )

        except Subscription.DoesNotExist:
            return Response(
                {
                    "status": "free"
                },
                status=status.HTTP_200_OK,
            )


# ============================================================
# STRIPE WEBHOOK
# ============================================================


@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        payload = request.body

        sig_header = request.META.get(
            "HTTP_STRIPE_SIGNATURE"
        )

        try:
            event = stripe.Webhook.construct_event(
                payload=payload,
                sig_header=sig_header,
                secret=settings.STRIPE_WEBHOOK_SECRET,
            )

            event_type = event["type"]

            if event_type not in [
                "checkout.session.completed",
                "customer.subscription.deleted",
            ]:
                return Response(
                    {"received": True},
                    status=status.HTTP_200_OK,
                )

            session = event["data"]["object"]

            # ------------------------------------------------
            # Subscription Deleted
            # ------------------------------------------------

            if event_type == "customer.subscription.deleted":
                stripe_subscription_id = session["id"]

                history = (
                    SubscriptionHistory.objects
                    .filter(
                        stripe_subscription_id=(
                            stripe_subscription_id
                        ),
                        status="active",
                    )
                    .first()
                )

                if history:
                    history.status = "cancelled"
                    history.end_date = timezone.now()

                    history.save(
                        update_fields=[
                            "status",
                            "end_date",
                            "updated_at",
                        ]
                    )

                subscription = (
                    Subscription.objects
                    .filter(
                        stripe_subscription_id=(
                            stripe_subscription_id
                        )
                    )
                    .first()
                )

                if subscription:
                    subscription.status = "cancelled"
                    subscription.cancel_at_period_end = False

                    subscription.save(
                        update_fields=[
                            "status",
                            "cancel_at_period_end",
                            "updated_at",
                        ]
                    )

                return Response(
                    {"received": True},
                    status=status.HTTP_200_OK,
                )

            # ------------------------------------------------
            # Checkout Completed
            # ------------------------------------------------

            user_id = session["client_reference_id"]
            subscription_id = session["subscription"]

            user = User.objects.get(
                id=user_id
            )

            # Get the plan selected during checkout
            metadata = session["metadata"]

            plan_id = (
                metadata["plan_id"]
                if metadata and "plan_id" in metadata
                else None
            )

            if not plan_id:
                return Response(
                    {
                        "detail": (
                            "Subscription plan not found "
                            "in checkout session."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            plan = SubscriptionPlan.objects.get(
                id=plan_id,
                is_active=True,
            )

            stripe_subscription = stripe.Subscription.retrieve(
                subscription_id
            )

            item = stripe_subscription["items"]["data"][0]

            start_date = timezone.make_aware(
                datetime.fromtimestamp(
                    item["current_period_start"]
                )
            )

            expiry_date = timezone.make_aware(
                datetime.fromtimestamp(
                    item["current_period_end"]
                )
            )

            Subscription.objects.update_or_create(
                user=user,
                defaults={
                    "plan": plan,
                    "stripe_customer_id": session["customer"],
                    "stripe_subscription_id": subscription_id,
                    "status": stripe_subscription["status"],
                    "start_date": start_date,
                    "expiry_date": expiry_date,
                    "cancel_at_period_end": False,
                }
            )

            history_exists = (
                SubscriptionHistory.objects
                .filter(
                    stripe_subscription_id=subscription_id
                )
                .exists()
            )

            if not history_exists:
                SubscriptionHistory.objects.create(
                    user=user,
                    plan=plan,
                    price=plan.price,
                    currency=plan.currency,
                    billing_interval=plan.billing_interval,
                    start_date=start_date,
                    end_date=None,
                    status=stripe_subscription["status"],
                    stripe_subscription_id=subscription_id,
                )

            send_notification(
                user=user,
                title=f"{plan.name} Subscription Activated",
                message=(
                    f"Your {plan.name} subscription has been "
                    "activated successfully. "
                    "You now have access to your subscription "
                    "features."
                ),
                notification_type=Notification.SUBSCRIPTION,
            )

            return Response(
                {
                    "message": (
                        "Subscription activated successfully."
                    )
                },
                status=status.HTTP_200_OK,
            )

        except User.DoesNotExist:
            return Response(
                {
                    "detail": "User not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        except SubscriptionPlan.DoesNotExist:
            return Response(
                {
                    "detail": "Subscription plan not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        except ValueError:
            return Response(
                {
                    "detail": "Invalid payload."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except stripe.error.SignatureVerificationError:
            return Response(
                {
                    "detail": "Invalid signature."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except stripe.error.StripeError as e:
            return Response(
                {
                    "detail": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            print(
                "WEBHOOK ERROR:",
                repr(e),
            )

            return Response(
                {
                    "detail": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ============================================================
# CANCEL SUBSCRIPTION
# ============================================================


class CancelSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            subscription = request.user.subscription

            if subscription.cancel_at_period_end:
                return Response(
                    {
                        "message": (
                            "Your subscription is already "
                            "scheduled to be cancelled at the "
                            "end of the current billing period."
                        )
                    },
                    status=status.HTTP_200_OK,
                )

            stripe.Subscription.modify(
                subscription.stripe_subscription_id,
                cancel_at_period_end=True,
            )

            subscription.cancel_at_period_end = True

            subscription.save(
                update_fields=[
                    "cancel_at_period_end",
                ]
            )

            plan_name = (
                subscription.plan.name
                if subscription.plan
                else "subscription"
            )

            send_notification(
                user=request.user,
                title=(
                    f"{plan_name} Subscription "
                    "Cancellation Scheduled"
                ),
                message=(
                    f"Your {plan_name} subscription has been "
                    "scheduled for cancellation. You will "
                    "continue to enjoy your subscription "
                    "features until "
                    f"{subscription.expiry_date.strftime('%d %b %Y')}."
                ),
                notification_type=Notification.SUBSCRIPTION,
            )

            return Response(
                {
                    "message": (
                        "Your subscription will be cancelled "
                        "at the end of the current billing period."
                    )
                },
                status=status.HTTP_200_OK,
            )

        except Subscription.DoesNotExist:
            return Response(
                {
                    "detail": "No active subscription found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        except stripe.error.StripeError as e:
            return Response(
                {
                    "detail": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        except Exception as e:
            return Response(
                {
                    "detail": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )


# ============================================================
# PUBLIC SUBSCRIPTION PLANS
# ============================================================


class SubscriptionPlanListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        plans = (
            SubscriptionPlan.objects
            .filter(is_active=True)
            .order_by(
                "sort_order",
                "created_at",
            )
        )

        serializer = PublicSubscriptionPlanSerializer(
            plans,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


# ============================================================
# ADMIN SUBSCRIPTION PAGINATION
# ============================================================


class AdminSubscriptionPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = "page_size"
    max_page_size = 100


# ============================================================
# ADMIN SUBSCRIPTION PLAN LIST / CREATE
# ============================================================


class AdminSubscriptionPlanListCreateView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        plans = (
            SubscriptionPlan.objects
            .all()
            .order_by(
                "sort_order",
                "created_at",
            )
        )

        serializer = SubscriptionPlanSerializer(
            plans,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = SubscriptionPlanSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        plan = serializer.save()

        try:
            plan = create_stripe_plan(plan)

        except stripe.error.StripeError as e:
            # Remove the local plan if Stripe creation fails
            plan.delete()

            return Response(
                {
                    "detail": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            SubscriptionPlanSerializer(plan).data,
            status=status.HTTP_201_CREATED,
        )


# ============================================================
# ADMIN SUBSCRIPTION PLAN DETAIL
# ============================================================


class AdminSubscriptionPlanDetailView(APIView):
    permission_classes = [IsAdminUser]

    def get_object(self, pk):
        try:
            return SubscriptionPlan.objects.get(
                pk=pk
            )

        except SubscriptionPlan.DoesNotExist:
            return None

    def get(self, request, pk):
        plan = self.get_object(pk)

        if not plan:
            return Response(
                {
                    "detail": "Subscription plan not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        serializer = SubscriptionPlanSerializer(
            plan
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def patch(self, request, pk):
        plan = self.get_object(pk)

        if not plan:
            return Response(
                {
                    "detail": "Subscription plan not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        old_price = plan.price
        old_interval = plan.billing_interval
        old_currency = plan.currency

        serializer = SubscriptionPlanSerializer(
            plan,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        updated_plan = serializer.save()

        price_changed = (
            old_price != updated_plan.price
            or old_interval != updated_plan.billing_interval
            or old_currency.lower()
            != updated_plan.currency.lower()
        )

        if price_changed:

            if not updated_plan.stripe_product_id:
                return Response(
                    {
                        "detail": (
                            "Plan is not connected to "
                            "a Stripe Product."
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

            try:
                old_stripe_price_id = (
                    updated_plan.stripe_price_id
                )

                new_stripe_price = stripe.Price.create(
                    product=updated_plan.stripe_product_id,
                    unit_amount=int(
                        updated_plan.price * 100
                    ),
                    currency=updated_plan.currency.lower(),
                    recurring={
                        "interval": (
                            updated_plan.billing_interval
                        ),
                    },
                )

                updated_plan.stripe_price_id = (
                    new_stripe_price.id
                )

                updated_plan.save(
                    update_fields=[
                        "stripe_price_id",
                        "updated_at",
                    ]
                )

                if old_stripe_price_id:
                    stripe.Price.modify(
                        old_stripe_price_id,
                        active=False,
                    )

            except stripe.error.StripeError as e:
                return Response(
                    {
                        "detail": str(e)
                    },
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response(
            SubscriptionPlanSerializer(
                updated_plan
            ).data,
            status=status.HTTP_200_OK,
        )


# ============================================================
# ADMIN SUBSCRIPTION LIST
# ============================================================


class AdminSubscriptionListView(ListAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = AdminSubscriptionSerializer
    pagination_class = AdminSubscriptionPagination

    def get_queryset(self):
        queryset = (
            Subscription.objects
            .select_related("user")
            .order_by("-created_at")
        )

        search = self.request.query_params.get(
            "search"
        )

        plan = self.request.query_params.get(
            "plan"
        )

        status = self.request.query_params.get(
            "status"
        )

        if search:
            queryset = queryset.filter(
                Q(user__username__icontains=search)
                | Q(user__email__icontains=search)
            )

        if plan == "premium":
            queryset = queryset.filter(
                status="active"
            )

        elif plan == "basic":
            queryset = queryset.exclude(
                status="active"
            )

        if status and status != "all":
            queryset = queryset.filter(
                status=status
            )

        return queryset


# ============================================================
# SUBSCRIPTION HISTORY
# ============================================================


class SubscriptionHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        history = (
            SubscriptionHistory.objects
            .filter(user=request.user)
            .select_related("plan")
            .order_by("-start_date")
        )

        serializer = SubscriptionHistorySerializer(
            history,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )