from django.shortcuts import render
from django.urls import reverse_lazy
from django.contrib.auth.models import User
from django.views.generic import TemplateView, View, DeleteView
from django.core import serializers
from django.http import JsonResponse
from .serializers import UserSerializer,UserSerializer1
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import *
from django.db.models import Q
from functools import reduce
import operator

from drf_api_logger.models import APILogsModel

def index(request):
    if request.method == 'GET':
        user=User.objects.all()
        return render(request, 'Crudapp/index.html',
                      {'user':user})

class Crud(generics.GenericAPIView):
    serializer_class = UserSerializer
    def get(self, request, *args, **kwargs):
        id=request.GET.get('id')
        if id:
            try:
                user=User.objects.get(id=id)
                return Response({
                    "data": self.serializer_class(user).data,
                })
            except:
                return Response(
                    data={
                        "message": "Please pass a valid id",
                        "success": False
                    }, status=status.HTTP_403_FORBIDDEN
                )
        else:
            return Response(
                data={
                    "message": "Please pass id",
                    "success": False
                }, status=status.HTTP_403_FORBIDDEN
            )
    def post(self, request, *args):
        user_serializer = self.serializer_class(data=request.data)
        if user_serializer.is_valid():
            user_serializer.save()
            return Response(
                data={
                    "data": user_serializer.data,
                    "message": "User saved successfully.",
                    "success": True,
                }, status=status.HTTP_201_CREATED
            )
        return Response(
            data={
                "error":user_serializer.errors,
                "success": False,
            }, status=status.HTTP_404_NOT_FOUND
        )

    def put(self, request, *args):
        try:
            id = request.data['id']
            snippet = self.get_object(id)
            qs=User.objects.get(id=id)
            serializer = UserSerializer1(snippet,data=request.data)
            try:
                if serializer.is_valid():
                    serializer.save()
                    return Response(
                        data={
                            "data": UserSerializer1(User.objects.get(id=id)).data,
                            "message": "User update successfully.",
                            "success": True,
                        }, status=status.HTTP_200_OK
                    )
            except:
                return Response(
                    data={
                        "message": "You didn't update any value.",
                        "success": False,
                    }, status=status.HTTP_404_NOT_FOUND
                )
        except Exception as e:
            return Response(
                data={
                    "message": "Please pass a valid id",
                    "success": False
                }, status=status.HTTP_403_FORBIDDEN
            )
    def delete(self, request, *args):

            id = request.data['id']
            if id:
                try:
                    user = User.objects.get(id=id)
                    user.delete()
                    return Response(
                        data={
                         "message": "User deleted successfully",
                    })
                except:
                    return Response(
                        data={
                            "message": "Please pass a valid id",
                            "success": False
                        }, status=status.HTTP_403_FORBIDDEN
                    )
            else:
                return Response(
                    data={
                        "message": "Please pass id",
                        "success": False
                    }, status=status.HTTP_403_FORBIDDEN
                )

class UserUpdate(generics.GenericAPIView):
    serializer_class = UserSerializer

    def get(self, request, *args, **kwargs):


        id = request.GET.get('id')
        if id:
            try:
                user = User.objects.get(id=id)
                return Response({
                    "data": self.serializer_class(user).data,
                })
            except:
                return Response(
                    data={
                        "message": "Please pass a valid id",
                        "success": False
                    }, status=status.HTTP_403_FORBIDDEN
                )
        else:
            return Response(
                data={
                    "message": "Please pass id",
                    "success": False
                }, status=status.HTTP_403_FORBIDDEN
            )

class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer1

def logs(request):
    q_list = [Q(method='PUT'), Q(method='POST'),Q(method='DELETE'),Q(method='GET')]
    result = APILogsModel.objects.filter(reduce(operator.or_, q_list),~Q(api='http://127.0.0.1:8000/'),~Q(api='http://127.0.0.1:8000/log/'))
    return render(request, 'Crudapp/log.html',
                  {'log': result})