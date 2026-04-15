from rest_framework.routers import DefaultRouter
from .views import SavedTransportViewSet

router = DefaultRouter()
router.register(r"saved-transports", SavedTransportViewSet, basename="saved-transports")

urlpatterns = router.urls