from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (TransportViewSet,
                    TransportLocationsView, 
                    SearchHistoryView, 
                    SearchHistoryDetailView,
                    ClearSearchHistoryView)

router = DefaultRouter()
router.register("", TransportViewSet, basename="transport")

urlpatterns = [
    path("locations/", TransportLocationsView.as_view()),
    path("search-history/", SearchHistoryView.as_view(),),
    path("search-history/<int:pk>/", SearchHistoryDetailView.as_view(),),
    path("search-history/clear", ClearSearchHistoryView.as_view(),),
    path("", include(router.urls)),
]