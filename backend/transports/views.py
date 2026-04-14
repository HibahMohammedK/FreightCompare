from rest_framework import viewsets, filters
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from .models import Transport
from .serializers import TransportSerializer
from .permissions import IsAdminUserCustom


class TransportViewSet(viewsets.ModelViewSet):
    queryset = Transport.objects.all().order_by("-created_at")
    serializer_class = TransportSerializer

    # 🔥 Dynamic permission handling
    def get_permissions(self):
        if self.request.method in SAFE_METHODS:
            return [IsAuthenticated()]  # ✅ Users can view
        return [IsAuthenticated(), IsAdminUserCustom()]  # ❌ Only admin can modify

    # 🔍 Filtering + search
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["source", "destination"]
    ordering_fields = ["price", "duration", "departure_date"]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)