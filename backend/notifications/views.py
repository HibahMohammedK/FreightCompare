from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Notification
from .serializers import NotificationSerializer

class NotificationListView(APIView):

    permission_classes = [ IsAuthenticated ]

    def get(self, request,):

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
    

class MarkNotificationReadView(APIView):

    permission_classes = [ IsAuthenticated ]

    def patch(self, request, pk):

        notification = Notification.objects.get(
            pk=pk,
            user=request.user,
        )

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
    

class MarkAllNotificationsReadView(APIView):

    permission_classes = [ IsAuthenticated ]

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