from django.shortcuts import render
from django.urls import reverse_lazy
from django.contrib.auth.models import User
from django.views.generic import TemplateView, View, DeleteView
from django.core import serializers
from django.http import JsonResponse
from .serializers import UserSerializer,UserSerializer1
from rest_framework import generics, status,pagination
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger

from collections import OrderedDict
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from .models import *
from rest_framework.exceptions import ErrorDetail
from django.db.models import Q
from functools import reduce
import operator


from drf_api_logger.models import APILogsModel
from django.core.paginator import Paginator

def index(request):
    # load the homepage
    if request.method == 'GET':
        user=User.objects.all()
        paginator = Paginator(user,10)
        page_number = request.GET.get('page', 1)
        # page_obj = paginator.get_page(page_number)
        try:
            user = paginator.page(page_number)
        except PageNotAnInteger:
            user = paginator.page(1)
        except EmptyPage:
            user = paginator.page(paginator.num_pages)
        return render(request, 'Crudapp/index.html',
                          {'user': user, 'page': page_number})




class Crud(generics.GenericAPIView):
    serializer_class = UserSerializer
    def post(self, request, *args):
        # create new users
        user_serializer = self.serializer_class(data=request.data)
        user_serializer.is_valid()
        errors = user_serializer.errors

        user=request.data
        if user.get('password1') != user.get('password2'):
            error = ErrorDetail(string='The two password fields didn\'t match.', code='blank')
            if errors.get('password2'):
                errors['password2'].append(error)
            else:
                errors['password2'] = [error]
        if errors:
            return Response(
                data={
                    "error": errors,
                    "success": False,
                }, status=status.HTTP_404_NOT_FOUND
            )
        else:
            user_serializer.save()
            return Response(
                data={
                    "data": user_serializer.data,
                    "message": "User saved successfully.",
                    "success": True,
                }, status=status.HTTP_201_CREATED
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


class CustomPageNumberPagination(pagination.PageNumberPagination):
    page_size_query_param = 'page_size'

    def get_paginated_response(self, data):
        return Response(OrderedDict([
            ('count', self.page.paginator.count),
            ('page_count', self.page.paginator.num_pages),
            ('next', self.get_next_link()),
            ('previous', self.get_previous_link()),
            ('results', data)
        ]))



class UserDetail(generics.RetrieveUpdateDestroyAPIView):
    # for Retrieve ,Update,Destroy Users
    queryset = User.objects.all()
    serializer_class = UserSerializer1
    permission_classes = [AllowAny]
    pagination_class = CustomPageNumberPagination


def logs(request):
    q_list = [Q(method='PUT'), Q(method='POST'),Q(method='DELETE'),Q(method='GET')]
    result = APILogsModel.objects.filter(reduce(operator.or_, q_list),~Q(api='http://127.0.0.1:8000/'),~Q(api='http://127.0.0.1:8000/log/'))
    return render(request, 'Crudapp/log.html',
                  {'log': result})