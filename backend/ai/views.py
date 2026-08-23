from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .serializers import TransportSearchSerializer
from .services import search_transport_ai
from subscription.utils import has_feature


class SearchTransportAPIView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role == "customer":
            if not has_feature(
                request.user,
                "ai_search",
            ):
                return Response(
                    {
                        "code": "FEATURE_NOT_AVAILABLE",
                        "detail": (
                            "AI Transport Assistant is not available "
                            "on your current subscription plan."
                        ),
                    },
                    status=status.HTTP_403_FORBIDDEN,
                )

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