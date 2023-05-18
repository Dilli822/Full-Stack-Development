from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Blog
from .serializers import UserSerializer, BlogSerializer, CurrentUserSerializer,BlogLikesSerializer
from django.http import Http404
from rest_framework import status
from django.http import Http404
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.http import Http404
from .models import Blog
from .serializers import BlogLikesSerializer

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import Blog
from .models import Blog
from .serializers import BlogSerializer

from .serializers import *

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Blog
from .serializers import UserSerializer, BlogSerializer, CurrentUserSerializer, BlogLikesSerializer, BlogLinkSerializer
from django.http import Http404
from rest_framework import status
from django.shortcuts import get_object_or_404



class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer

    
class LoginAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        user = User.objects.filter(username=username).first()
 
        if user is None:
            return Response({'error': 'Invalid Credentials'})


        if not user.check_password(password):
            return Response({'error': 'Invalid Credentials'})

        refresh = RefreshToken.for_user(user)

        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })

class BlogAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        blogs = Blog.objects.filter(author=request.user)
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        serializer = BlogSerializer(data=request.data)
        if serializer.is_valid():
            if 'image' not in request.FILES:
                serializer.validated_data['image'] = None  # Use default value if image not uploaded
            serializer.save(author=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    

    def put(self, request, pk):
        blog = Blog.objects.get(pk=pk)
        serializer = BlogSerializer(blog, data=request.data)
        if serializer.is_valid():
            if 'image' not in request.FILES:
                serializer.validated_data['image'] = blog.image  # Use previously uploaded image if not uploaded
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        blog = Blog.objects.get(author=request.user,pk=pk)
        blog.delete()
        return Response("Sucessfully Deleted",status=204)
    


class BlogAPIList(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        blogs = Blog.objects.all()
        serializer = BlogSerializer(blogs, many=True)
        return Response(serializer.data)
    
class CurrentUserAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        serializer = CurrentUserSerializer(request.user)
        return Response(serializer.data)

class BlogLikesAPIView(APIView):
    def get(self, request):
        blogs = Blog.objects.all()
        data = []
        for blog in blogs:
            liked_by_current_user = request.user.id in blog.liked_by.values_list('id', flat=True)
            liked_state = True if liked_by_current_user else False
            likes = blog.liked_by.count()
            blog_data = {
                'id': blog.id,
                'author_id': blog.author.id,
                'title': blog.title,
                'authorName': blog.authorName,
                'image': blog.image.url if blog.image else None,
                'content': blog.content,
                'updated_at': blog.updated_at,
                'created_at': blog.created_at,
                'likes': likes,
                'liked_state': liked_state,
                'liked_by_current_user': liked_by_current_user,
                'liked_by': list(blog.liked_by.values_list('id', flat=True)),
  
            }
            data.append(blog_data)
        return Response(data, status=status.HTTP_200_OK)


class BlogLikesUpdateView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self, pk):
        try:
            return Blog.objects.get(pk=pk)
        except Blog.DoesNotExist:
            raise Http404
        
    def put(self, request, pk):
        blog = self.get_object(pk)
        user = request.user
        liked = request.data.get('liked', False)
        if liked:
            blog.liked_by.add(user)
        else:
            blog.liked_by.remove(user)
        blog.likes = blog.liked_by.count()
        blog.save()
        serializer = BlogLikesSerializer(blog, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class BlogLinkAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, pk):
        blog = get_object_or_404(Blog, pk=pk)
        serializer = BlogLinkSerializer(blog, context={'request': request})
        return Response(serializer.data)

class BlogURLListAPIView(generics.ListCreateAPIView):
    queryset = Blog.objects.all()
    serializer_class = BlogSerializer


class BlogPostAPIView(APIView):
    def get(self, request, pk):
        try:
            blog = Blog.objects.get(pk=pk)
            serializer = BlogSerializer(blog)
            return Response(serializer.data)
        except Blog.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        



# Comment
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CommentSerializer
from .models import Comment

class CommentListAPIView(APIView):
    def get(self, request):
        comments = Comment.objects.all()
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class CommentDetailAPIView(APIView):
    def get_comment(self, pk):
        try:
            return Comment.objects.get(pk=pk)
        except Comment.DoesNotExist:
            raise Http404

    def get(self, request, pk):
        comment = self.get_comment(pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)

    def put(self, request, pk):
        comment = self.get_comment(pk)
        serializer = CommentSerializer(comment, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        comment = self.get_comment(pk)
        comment.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
