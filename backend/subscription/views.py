import stripe

from datetime import datetime

from django.db.models import Q
from django.conf import settings
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator

from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination

from users.models import User
from .models import Subscription
from .serializers import CreateCheckoutSessionSerializer, SubscriptionSerializer, AdminSubscriptionSerializer
from notifications.utils import send_notification
from notifications.models import Notification




stripe.api_key = settings.STRIPE_SECRET_KEY


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CreateCheckoutSessionSerializer(
            data=request.data
        )
        serializer.is_valid(
            raise_exception=True
        )

        try:
            checkout_session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                mode="subscription",
                line_items=[
                    {
                        "price": settings.STRIPE_PRICE_ID,
                        "quantity": 1,
                    }
                ],

                customer_email=request.user.email,
                client_reference_id=str(request.user.id),
                metadata={
                    "user_id": str(request.user.id),
                },

                success_url=(
                    "http://localhost:5173/subscription/success"
                    "?session_id={CHECKOUT_SESSION_ID}"
                ),

                cancel_url=(
                    "http://localhost:5173/subscription/cancel"
                ),
            )

            return Response(
                {
                    "checkout_url": checkout_session.url
                },
                status=status.HTTP_200_OK,
            )

        except stripe.error.StripeError as e:
            return Response(
                {
                    "detail": str(e)
                },
                status=status.HTTP_400_BAD_REQUEST,
            )
        
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

            if event["type"] != "checkout.session.completed":
                return Response(
                    {
                        "received": True
                    },
                    status=status.HTTP_200_OK,
                )

            session = event["data"]["object"]
            user_id = session["client_reference_id"]
            subscription_id = session["subscription"]


            user = User.objects.get(
                id=user_id
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

                    "stripe_customer_id": session["customer"],

                    "stripe_subscription_id": subscription_id,

                    "status": stripe_subscription["status"],

                    "start_date": start_date,

                    "expiry_date": expiry_date,

                }

            )

            send_notification(
                user=user,
                title="Premium Subscription Activated",
                message=(
                    "Your Premium subscription has been activated successfully. "
                    "You now have access to unlimited price alerts, AI assistant, and premium features."
                ),
                notification_type=Notification.SUBSCRIPTION,
            )

            return Response(
                {
                    "message": "Subscription activated successfully."
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

            return Response(
                {
                    "detail": str(e)
                },
                status=status.HTTP_500_INTERNAL_SERVER_ERROR,
            )
        

class CancelSubscriptionView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        try:

            subscription = request.user.subscription

            if subscription.cancel_at_period_end:
                return Response(
                    {
                        "message": (
                            "Your subscription is already scheduled "
                            "to be cancelled at the end of the current billing period."
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

            send_notification(
                    user=request.user,
                    title="Subscription Cancellation Scheduled",
                    message=(
                        "Your Premium subscription has been scheduled for cancellation. "
                        f"You will continue to enjoy Premium features until "
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
        
       
class AdminSubscriptionPagination(PageNumberPagination):
    page_size = 6
    page_size_query_param = "page_size"
    max_page_size = 100

        
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

        search = self.request.query_params.get("search")
        plan = self.request.query_params.get("plan")
        status = self.request.query_params.get("status")

        if search:
            queryset = queryset.filter(
                Q(user__username__icontains=search)
                |
                Q(user__email__icontains=search)
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