from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import UserSignupView, UserLoginView, PasswordResetView, PasswordResetConfirmView, PasswordResetCompleteView, BlogListView, BlogCreateView, BlogDetailView

urlpatterns = [
    path('signup/', UserSignupView.as_view(), name='signup'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('password_reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password_reset_confirm/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('password_reset_complete/', PasswordResetCompleteView.as_view(), name='password_reset_complete'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('blogs/', BlogListView.as_view(), name='blog_list'),
    path('blogs/create/', BlogCreateView.as_view(), name='blog_create'),
    path('blogs/<int:pk>/', BlogDetailView.as_view(), name='blog_detail'),
]
