# from django.urls import path, include
# from .views import BlogPostList, BlogPostDetail, BlogLists, Login, Register

# urlpatterns = [
#     path('api-auth/', include('rest_framework.urls')),
#     path('blog/create/', BlogPostList.as_view(), name='blogpost-list'),
#     path('blog/list/', BlogLists.as_view(), name='blogpost-list'),
#     path('blog/<int:pk>/', BlogPostDetail.as_view(), name='blogpost-detail'),
#     path('login/', Login.as_view(), name='login'),
#     path('register/', Register.as_view(), name='register'),
# ]

from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from .views import RegisterAPIView, BlogAPIView

urlpatterns = [
    path('register/', RegisterAPIView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('blog/', BlogAPIView.as_view(), name='blog-list'),
    path('blog/<int:pk>/', BlogAPIView.as_view(), name='blog-detail'),
]

