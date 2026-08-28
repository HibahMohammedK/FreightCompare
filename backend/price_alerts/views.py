from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from subscription.utils import get_plan_limit

from .models import PriceAlert
from .serializers import PriceAlertSerializer


# ============================================================
# PRICE ALERT LIST / CREATE
# ============================================================


class PriceAlertListCreateView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        price_alerts = PriceAlert.objects.filter(
            user=request.user,
        )

        serializer = PriceAlertSerializer(
            price_alerts,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def post(self, request):

        serializer = PriceAlertSerializer(
            data=request.data,
        )

        serializer.is_valid(
            raise_exception=True
        )

        limit = get_plan_limit(
            request.user,
            "price_alerts",
            default=1,
        )

        active_alerts = PriceAlert.objects.filter(
            user=request.user,
            is_active=True,
        ).count()

        # -1 means unlimited
        if limit != -1 and active_alerts >= limit:

            return Response(
                {
                    "code": "PRICE_ALERT_LIMIT_REACHED",
                    "detail": (
                        f"You can have up to {limit} "
                        "active price alert(s) on your current plan."
                    ),
                    "limit": limit,
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer.save(
            user=request.user,
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    def delete(self, request):

        PriceAlert.objects.filter(
            user=request.user,
        ).delete()

        return Response(
            {
                "message": "All price alerts deleted."
            },
            status=status.HTTP_200_OK,
        )


# ============================================================
# PRICE ALERT DETAIL
# ============================================================


class PriceAlertDetailView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        price_alert = get_object_or_404(
            PriceAlert,
            pk=pk,
            user=request.user,
        )

        serializer = PriceAlertSerializer(
            price_alert,
            data=request.data,
            partial=True,
        )

        serializer.is_valid(
            raise_exception=True
        )

        serializer.save()

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )

    def delete(self, request, pk):

        price_alert = get_object_or_404(
            PriceAlert,
            pk=pk,
            user=request.user,
        )

        price_alert.delete()

        return Response(
            {
                "message": "Price alert deleted."
            },
            status=status.HTTP_200_OK,
        )