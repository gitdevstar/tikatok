from django_filters.rest_framework import DjangoFilterBackend
from clients.models import Clients
from .serializers import ClientsSerializer
from rest_framework import viewsets


class ClientsViewSet(viewsets.ModelViewSet):
    queryset = Clients.objects.all()
    serializer_class = ClientsSerializer

    """ print(queryset[0].country.id)
    print(queryset[0].country.name) """
