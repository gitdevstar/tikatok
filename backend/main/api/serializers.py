from rest_framework import serializers
from main.models import Logs
from users.models import Users

class LogsSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(queryset=Users.objects.all())
    class Meta:
        model = Logs
        fields = ('id', 'activity', 'date_time', 'user')
