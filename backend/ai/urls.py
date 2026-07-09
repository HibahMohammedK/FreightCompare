from django.urls import path

from .views import SearchTransportAPIView

urlpatterns = [
    path("search-transport/", SearchTransportAPIView.as_view(), name="search-transport"),
]