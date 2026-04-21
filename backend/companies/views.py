from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated, BasePermission
from .models import Company
from .serializers import CompanySerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.filters import SearchFilter



class IsAdminRole(BasePermission):
    def has_permission(
        self,
        request,
        view
    ):
        return (
            request.user.is_authenticated
            and request.user.role == "admin"
        )
    
    
class CompanyPagination(
    PageNumberPagination
):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all().order_by("name")
    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    pagination_class = CompanyPagination

    filter_backends = [SearchFilter]

    search_fields = ["name"]