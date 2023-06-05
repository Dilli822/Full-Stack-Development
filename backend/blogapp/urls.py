from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import *
from .views import CommentDetailAPIView,CommentListAPIView,UserAPIView,CurrentUserAPIView
from .api import BlogCommentAPIView

urlpatterns = [
    path('blogsurls/', BlogURLListAPIView.as_view(), name='blog-list'),
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('blog/list/', BlogAPIList.as_view(), name='blog-list'),
    path('blog/lists/', BlogAPIList.as_view(), name='blog-list'),
    path('blog/create/', BlogAPIView.as_view(), name='blog-detail'),
    path('blog/update/<int:pk>/', BlogAPIView.as_view(), name='blog-detail'),
    path('blog/delete/<int:pk>/', BlogAPIView.as_view(), name='blog-detail'),
    path('blog/<int:pk>/', BlogPostAPIView.as_view(), name='blog-detail'),
    path('user/', UserAPIView.as_view(), name='current_user_detail'),
    path('user/<int:pk>/', CurrentUserAPIView.as_view(), name='current_user_detail'),
    path('blog/likes/', BlogLikesAPIView.as_view(), name='blog_likes'),
    path('blog/likes/update/<int:pk>/', BlogLikesUpdateView.as_view(), name='blog_updatelikes'),
    path('blog-link/<int:pk>/', BlogLinkAPIView.as_view(), name='blog-link'),
    path('blog/comments/', CommentListAPIView.as_view(), name='comment_list_create'),
    path('blog/comments/<int:pk>/', CommentDetailAPIView.as_view(), name='comment_detail'),
    path('blog-comments/', BlogCommentAPIView.as_view(), name='blog-comment-api'),

]