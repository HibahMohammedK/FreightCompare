from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .serializers import TransportSearchSerializer
from .services import search_transport_ai

class SearchTransportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TransportSearchSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        result = search_transport_ai(
            serializer.validated_data
        )

        return Response(result)