from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Notification
from .serializers import NotificationSerializer


# ============================================================
# NOTIFICATION LIST
# ============================================================


class NotificationListView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request):

        notifications = (
            Notification.objects.filter(
                user=request.user
            )
        )

        serializer = NotificationSerializer(
            notifications,
            many=True,
        )

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


# ============================================================
# MARK NOTIFICATION AS READ
# ============================================================


class MarkNotificationReadView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):

        notification = get_object_or_404(
            Notification,
            pk=pk,
            user=request.user,
        )

        if not notification.is_read:

            notification.is_read = True

            notification.save(
                update_fields=[
                    "is_read",
                ]
            )

        return Response(
            {
                "message": "Notification marked as read."
            },
            status=status.HTTP_200_OK,
        )


# ============================================================
# MARK ALL NOTIFICATIONS AS READ
# ============================================================


class MarkAllNotificationsReadView(APIView):

    permission_classes = [IsAuthenticated]

    def patch(self, request):

        Notification.objects.filter(
            user=request.user,
            is_read=False,
        ).update(
            is_read=True,
        )

        return Response(
            {
                "message": "All notifications marked as read."
            },
            status=status.HTTP_200_OK,
        )


# ============================================================
# DELETE NOTIFICATION
# ============================================================


class DeleteNotificationView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):

        notification = get_object_or_404(
            Notification,
            pk=pk,
            user=request.user,
        )

        notification.delete()

        return Response(
            {
                "message": "Notification deleted."
            },
            status=status.HTTP_200_OK,
        )


# ============================================================
# CLEAR ALL NOTIFICATIONS
# ============================================================


class ClearNotificationsView(APIView):

    permission_classes = [IsAuthenticated]

    def delete(self, request):

        Notification.objects.filter(
            user=request.user
        ).delete()

        return Response(
            {
                "message": "Notifications cleared."
            },
            status=status.HTTP_200_OK,
        )