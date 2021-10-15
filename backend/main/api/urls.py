from main.api.views import LogsViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', LogsViewSet, basename='logs')
urlpatterns = router.urls