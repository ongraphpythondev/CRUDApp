from django.urls import path
from . import views

urlpatterns = [

    path('', views.index, name='index'),
    path('cruds/', views.Crud.as_view(), name='crud'),
    path('edit/<int:pk>/', views.UserDetail.as_view(), name='edit'),
    path('log/', views.logs, name='log'),
    path('user-update/', views.UserUpdate.as_view(), name='user-update'),
    path('users/', views.UserList.as_view(), name='user-list')
]
