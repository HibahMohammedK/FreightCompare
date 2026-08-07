from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import TransportSearchSerializer
from .services import search_transport_ai
from subscription.utils import is_premium

class SearchTransportAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = TransportSearchSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        if not is_premium(request.user):
            return Response(
                            {
                                "detail": (
                                    "This feature is available only for Premium users. "
                                    "Please upgrade your subscription to continue."
                                )
                            },
                            status=status.HTTP_403_FORBIDDEN,
                            )
            

        result = search_transport_ai(
            serializer.validated_data
        )

        return Response(result)