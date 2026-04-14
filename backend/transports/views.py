from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated
from .models import Transport
from .serializers import TransportSerializer
from .permissions import IsAdminUserCustom


class TransportViewSet(viewsets.ModelViewSet):
    queryset = Transport.objects.all().order_by("-created_at")
    serializer_class = TransportSerializer

    permission_classes = [IsAuthenticated, IsAdminUserCustom]

    # 🔍 Filtering + search
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["source", "destination"]
    ordering_fields = ["price", "duration", "departure_date"]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)