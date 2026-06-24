from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TransportViewSet, TransportLocationsView

router = DefaultRouter()
router.register("", TransportViewSet, basename="transport")

urlpatterns = [
    path("locations/", TransportLocationsView.as_view()),
    path("", include(router.urls)),
]