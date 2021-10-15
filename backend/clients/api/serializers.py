from rest_framework import serializers
from clients.models import Clients, Countries
   

class ClientsSerializer(serializers.ModelSerializer):
    country = serializers.PrimaryKeyRelatedField(queryset=Countries.objects.all())
    class Meta:
        model = Clients
        fields = ('id', 'name', 'year', 'address', 'country', 'no_of_projects')
