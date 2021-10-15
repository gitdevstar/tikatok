from users.api.views import UsersViewSet
from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import multiDelete, adminDashboardData, getCurrentClientData, updateUser

router = DefaultRouter()
router.register(r'', UsersViewSet, basename='users')
urlpatterns = [
    path('multiDelete/', multiDelete),
    path('admin-dashboard', adminDashboardData),
    path('admin-dashboard-client', getCurrentClientData),
    path('update/', updateUser),

    path('', include(router.urls)),
]