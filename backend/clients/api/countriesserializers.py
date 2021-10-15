from rest_framework import serializers
from clients.models import Countries
   

class CountriesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Countries
        fields = '__all__'
