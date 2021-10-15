from django.conf.urls import *
from .views import *

urlpatterns = [
    url(r'^.*$', main_view),

]
