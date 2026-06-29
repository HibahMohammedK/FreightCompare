from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (TransportViewSet,
                    TransportLocationsView, 
                    SearchHistoryView, 
                    SearchHistoryDetailView,
                    ClearSearchHistoryView,
                    CsvUploadView)

router = DefaultRouter()
router.register("", TransportViewSet, basename="transport")

urlpatterns = [
    path("locations/", TransportLocationsView.as_view()),
    path("search-history/", SearchHistoryView.as_view(),),
    path("search-history/<int:pk>/", SearchHistoryDetailView.as_view(),),
    path("search-history/clear", ClearSearchHistoryView.as_view(),),
    path("csv-upload/", CsvUploadView.as_view(), name="csv-upload"),
    path("", include(router.urls)),
]