# from django.shortcuts import render
# from rest_framework import generics
# from .serializers import BlogPostSerializer
# from rest_framework.permissions import IsAuthenticated
# from .models import BlogPost
# from rest_framework import permissions

# class IsAuthor(permissions.BasePermission):
#     def has_object_permission(self, request, view, obj):
#         if request.method in permissions.SAFE_METHODS:
#             return True
#         return obj.author.id == request.user.id

# class BlogLists(generics.ListAPIView):
#     queryset = BlogPost.objects.all()
#     serializer_class = BlogPostSerializer
#     permission_classes = [IsAuthenticated]

# class BlogPostList(generics.ListCreateAPIView):
#     queryset = BlogPost.objects.all()
#     serializer_class = BlogPostSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         return BlogPost.objects.filter(author=self.request.user)
    
#     def perform_create(self, serializer):
#         serializer.save(author=self.request.user, authorName=self.request.user.username)
        
# class BlogPostDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = BlogPost.objects.all()
#     serializer_class = BlogPostSerializer
#     permission_classes = [IsAuthenticated, IsAuthor]

from rest_framework import generics, permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import Blog
from .serializers import UserSerializer, BlogSerializer


class RegisterAPIView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserSerializer


class LoginAPIView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

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
            serializer.save(author=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
    def put(self, request, pk):
        blog = Blog.objects.get(pk=pk)
        serializer = BlogSerializer(blog, data=request.data)
        if serializer.is_valid():
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