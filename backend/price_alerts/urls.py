from django.urls import path

from .views import (
    PriceAlertListCreateView,
    PriceAlertDetailView,
)


urlpatterns = [
    path("", PriceAlertListCreateView.as_view(), name="price-alert-list-create" ),
    path("<int:pk>/", PriceAlertDetailView.as_view(), name="price-alert-detail" ),
]