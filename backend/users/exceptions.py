from rest_framework import status
from rest_framework.response import Response


def handle_exception(exception, message):
    print(exception)

    return Response(
        {
            "error": message,
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR,
    )