from clients.api.views import ClientsViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', ClientsViewSet, basename='clients')
urlpatterns = router.urls
