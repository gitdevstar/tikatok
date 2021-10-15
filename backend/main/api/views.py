from main.models import Logs
from .serializers import LogsSerializer
from rest_framework import viewsets


class LogsViewSet(viewsets.ModelViewSet):
    serializer_class = LogsSerializer
    queryset = Logs.objects.all()