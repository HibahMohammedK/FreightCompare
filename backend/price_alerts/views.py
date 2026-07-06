from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import PriceAlert
from .serializers import PriceAlertSerializer
from django.shortcuts import get_object_or_404


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

        if serializer.is_valid():

            serializer.save(
                user=request.user,
            )

            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
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

        if serializer.is_valid():

            serializer.save()

            return Response(
                serializer.data,
                status=status.HTTP_200_OK,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
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