from rest_framework import status, viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import SavedTransport
from .serializers import SavedTransportSerializer


# ============================================================
# SAVED TRANSPORT
# ============================================================


class SavedTransportViewSet(viewsets.ModelViewSet):
    serializer_class = SavedTransportSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return SavedTransport.objects.filter(
            user=self.request.user
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        self.perform_create(serializer)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()

        if instance.user != request.user:
            return Response(
                {"detail": "Not allowed"},
                status=403,
            )

        self.perform_destroy(instance)

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )