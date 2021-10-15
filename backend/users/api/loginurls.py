from django.urls import path, include
from users.api.loginviews import LoginAPI

urlpatterns = [
    path('', LoginAPI.as_view())
]