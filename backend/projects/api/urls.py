from projects.api.views import ProjectsViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import multiProjectDelete, getAllProject, exportProject

router = DefaultRouter()
router.register(r'', ProjectsViewSet, basename='projects')

urlpatterns = [
    path('multiDelete/', multiProjectDelete),
    # path('update/', updateProject),
    path('get-project', getAllProject),
    path('exportProject', exportProject),

    path('', include(router.urls)),
]