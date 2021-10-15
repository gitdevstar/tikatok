from rest_framework import serializers
from users.models import Users

class UsersSerializer(serializers.ModelSerializer):
    user_id = serializers.CharField(required=False)
    password = serializers.CharField(required=False)

    class Meta:
        model = Users
        fields = ('id', 'username', 'password', 'first_name', 'last_name', 'email', 'user_id', 'type_user', 'is_superuser')
        ordering = ['id']
