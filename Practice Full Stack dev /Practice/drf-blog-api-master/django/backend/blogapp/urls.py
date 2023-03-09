from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterAPIView, BlogAPIView, BlogAPIList

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('blog/list/', BlogAPIList.as_view(), name='blog-list'),
    path('blog/create/', BlogAPIView.as_view(), name='blog-detail'),
    path('blog/update/<int:pk>/', BlogAPIView.as_view(), name='blog-detail'),
    path('blog/delete/<int:pk>/', BlogAPIView.as_view(), name='blog-detail'),
    path('blog/<int:pk>/', BlogAPIView.as_view(), name='blog-detail'),
]