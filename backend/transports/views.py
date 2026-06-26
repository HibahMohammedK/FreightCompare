from rest_framework import viewsets, filters, status
from rest_framework.permissions import IsAuthenticated, SAFE_METHODS
from .models import Transport, SearchHistory
from .serializers import TransportSerializer, SearchHistorySerializer
from .permissions import IsAdminUserCustom
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import get_object_or_404


class TransportViewSet(viewsets.ModelViewSet):
    serializer_class = TransportSerializer

    def get_queryset(self):
        queryset = Transport.objects.all().order_by("-created_at")

        source = self.request.query_params.get("source")
        destination = self.request.query_params.get("destination")
        transport_type = self.request.query_params.get("transport_type")
        departure_date = self.request.query_params.get("departure_date")

        if source:
            queryset = queryset.filter(source__iexact=source)

        if destination:
            queryset = queryset.filter(destination__iexact=destination)

        if transport_type:
            queryset = queryset.filter(
                transport_type__iexact=transport_type
            )

        if departure_date:
            queryset = queryset.filter(
                departure_date=departure_date
            )

        return queryset

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

class TransportLocationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        locations = (
            Transport.objects
            .values_list("source", flat=True)
            .union(
                Transport.objects.values_list(
                    "destination",
                    flat=True
                )
            )
        )

        return Response({
            "locations": sorted(locations)
        })
    
class SearchHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = SearchHistorySerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        SearchHistory.objects.update_or_create(
            user=request.user,
            source=serializer.validated_data["source"],
            destination=serializer.validated_data["destination"],
            transport_type=serializer.validated_data["transport_type"],
            defaults={}
        )

        return Response(
            {"message": "Search saved"}
        )

    def get(self, request):

        history = SearchHistory.objects.filter(
            user=request.user
        )

        serializer = SearchHistorySerializer(
            history,
            many=True
        )

        return Response(serializer.data)
    
class SearchHistoryDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, pk):
        history = get_object_or_404(SearchHistory, id=pk, user = request.user)
        history.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

class ClearSearchHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        history = SearchHistory.objects.filter(user = request.user)
        history.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)