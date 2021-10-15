"""tw URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
# from django.contrib import admin
# from django.urls import path

# urlpatterns = [
#     path('admin/', admin.site.urls),
# ]

from django.conf.urls import url, include
from django.contrib import admin
from django.conf import settings
from django.views import static

urlpatterns = [
    url(r'^django-admin/', admin.site.urls),
    url(r'^api/clients/', include('clients.api.urls')),
    url(r'^api/countries/', include('clients.api.countriesurls')),
    url(r'^api/projects/', include('projects.api.urls')),
    url(r'^api/users/', include('users.api.urls')),
    url(r'^api/login/', include('users.api.loginurls')),
    url(r'^api/tasks/', include('tasks.api.urls')),
    url(r'^api/main/', include('main.api.urls')),
    url(
        r'^media/(?P<path>.*)$',
        static.serve,
        {'document_root': settings.MEDIA_ROOT}
    ),
    url(r'^', include('react.urls')),
]
