from django.urls import path
from .views import BlogAPI, register

urlpatterns = [
    path('blog/', BlogAPI.as_view(), name='blog-list'),
    # path('blog/<int:pk>/', BlogAPI.as_view(), name='blog-detail'),
    # path('register/', register, name='register'),
]