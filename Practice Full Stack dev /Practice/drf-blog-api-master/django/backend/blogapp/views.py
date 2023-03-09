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