from django.urls import path
from .views import UsernameList

urlpatterns = [
    path('usernames/', UsernameList.as_view(), name='username-list'),
]
