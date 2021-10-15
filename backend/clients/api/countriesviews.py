from django_filters.rest_framework import DjangoFilterBackend
from clients.models import Countries
from .countriesserializers import CountriesSerializer
from rest_framework import viewsets


class CountriesViewSet(viewsets.ModelViewSet):
    queryset = Countries.objects.all()
    serializer_class = CountriesSerializer