from clients.api.countriesviews import CountriesViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'', CountriesViewSet, basename='countries')
urlpatterns = router.urls
