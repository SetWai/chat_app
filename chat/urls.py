from django.urls import path
from . import views

urlpatterns = [
    path('api/rooms/', views.room_list, name='room-list'),
    path('api/messages/<str:room_name>/', views.message_history, name='message-history'),
]