from rest_framework import serializers
from django.contrib.auth.models import User
from drf_api_logger.models import APILogsModel


class UserSerializer(serializers.ModelSerializer):
    # for checking validation at the time of user creation
    password1 = serializers.CharField(style={'input_type': 'password'}, write_only=True, source='password')
    class Meta:
        model = User
        fields = ('id','username','first_name','last_name','email','password1')

    def validate_password1(self, attrs):
        a = super().validate(attrs)
        if attrs == '':
            # raise AuthenticationFailed(json_data)
            raise serializers.ValidationError('Password is required')
        if len(attrs) < 8:
            # raise AuthenticationFailed(json_data)
            raise serializers.ValidationError('password is too short')
        return attrs
    def validate_first_name(self, attrs):

        a=super().validate(attrs)
        if attrs =='':
            # raise AuthenticationFailed(json_data)
            raise serializers.ValidationError('Firstname is required')
        return attrs
    def validate_last_name(self, attrs):

        a=super().validate(attrs)
        if attrs =='':
            # raise AuthenticationFailed(json_data)
            raise serializers.ValidationError('Lastname is required')
        return attrs
    def validate_email(self, attrs):
        a=super().validate(attrs)
        if attrs =='':
            # raise AuthenticationFailed(json_data)
            raise serializers.ValidationError('Email is required')
        return attrs


class UserSerializer1(serializers.ModelSerializer):
    # for Retrieve ,Update,Destroy Users
    class Meta:
        model = User
        fields = ('id','username','first_name','last_name','email')


class APILogsModelSerializer(serializers.ModelSerializer):
    # for fetching logs
    class Meta:
        model = APILogsModel
        fields = '__all__'