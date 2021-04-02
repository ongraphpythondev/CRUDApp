from rest_framework import serializers
from django.contrib.auth.models import User
from drf_api_logger.models import APILogsModel

class UserSerializer(serializers.ModelSerializer):
    password1 = serializers.CharField(style={'input_type': 'password'}, write_only=True, source='password')
    class Meta:
        model = User
        fields = ('id','username','first_name','last_name','email','password1')



class UserSerializer1(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id','username','first_name','last_name','email')

class APILogsModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = APILogsModel
        fields = '__all__'