# # from rest_framework.views import APIView
# # from rest_framework.response import Response
# # from rest_framework_simplejwt.tokens import RefreshToken
# # from rest_framework.authentication import TokenAuthentication
# # from rest_framework.decorators import api_view, authentication_classes, permission_classes
# # from rest_framework.permissions import IsAuthenticated
# # from rest_framework import status
# # from django.contrib.auth.models import User

# # from .models import Blog
# # from .serializers import BlogSerializer
# # from django. shortcuts import redirect
# # from django.urls import reverse
# # from django.shortcuts import redirect
# # from django.contrib.auth.models import User
# # from rest_framework import status
# # from rest_framework.decorators import api_view, permission_classes
# # from rest_framework.permissions import AllowAny
# # from rest_framework.response import Response

# # class BlogAPI(APIView):
# #     authentication_classes = [TokenAuthentication]
# #     permission_classes = [IsAuthenticated]

# #     def post(self, request):
# #         username = request.data.get('username')
# #         password = request.data.get('password')
# #         user = User.objects.filter(username=username).first()
# #         if user and user.check_password(password):
# #             refresh = RefreshToken.for_user(user)
# #             return Response({
# #                 'refresh': str(refresh),
# #                 'access': str(refresh.access_token),
# #             })
# #              # Redirect to the registration page if the username and password are not valid
# #         registration_url = reverse('register')
# #         return redirect(registration_url)
        
# #         serializer = BlogSerializer(data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data, status=status.HTTP_201_CREATED)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #     def get(self, request):
# #         blogs = Blog.objects.all()
# #         serializer = BlogSerializer(blogs, many=True)
# #         return Response(serializer.data)

# #     def put(self, request, pk):
# #         try:
# #             blog = Blog.objects.get(pk=pk)
# #         except Blog.DoesNotExist:
# #             return Response(status=status.HTTP_404_NOT_FOUND)

# #         serializer = BlogSerializer(blog, data=request.data)
# #         if serializer.is_valid():
# #             serializer.save()
# #             return Response(serializer.data)
# #         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# #     def delete(self, request, pk):
# #         try:
# #             blog = Blog.objects.get(pk=pk)
# #         except Blog.DoesNotExist:
# #             return Response(status=status.HTTP_404_NOT_FOUND)

# #         blog.delete()
# #         return Response(status=status.HTTP_204_NO_CONTENT)



# # @api_view(['POST'])
# # @permission_classes([AllowAny])
# # def register(request):
# #     username = request.data.get('username')
# #     password = request.data.get('password')
# #     if serializer.is_valid():
# #         serializer.save()
# #         return Response(serializer.data, status=status.HTTP_201_CREATED)
# #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# from django.db import models
# from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
# from rest_framework_simplejwt.tokens import RefreshToken

# class CustomUserManager(BaseUserManager):
#     def create_user(self, email, password=None, **extra_fields):
#         if not email:
#             raise ValueError('The Email field must be set')
#         email = self.normalize_email(email)
#         user = self.model(email=email, **extra_fields)
#         user.set_password(password)
#         user.save(using=self._db)
#         return user

#     def create_superuser(self, email, password=None, **extra_fields):
#         extra_fields.setdefault('is_staff', True)
#         extra_fields.setdefault('is_superuser', True)
#         return self.create_user(email, password, **extra_fields)

# class CustomUser(AbstractBaseUser, PermissionsMixin):
#     email = models.EmailField(unique=True, db_index=True)
#     first_name = models.CharField(max_length=30, blank=True)
#     last_name = models.CharField(max_length=30, blank=True)
#     is_active = models.BooleanField(default=True)
#     is_staff = models.BooleanField(default=False)
#     created_at = models.DateTimeField(auto_now_add=True)

#     USERNAME_FIELD = 'email'

#     objects = CustomUserManager()

#     def __str__(self):
#         return self.email

# class LoginAPI(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')

#         # Check if the email and password are valid
#         user = authenticate(request, email=email, password=password)

#         if user is not None:
#             # Generate a token for the user
#             refresh = RefreshToken.for_user(user)
#             return Response({
#                 'refresh': str(refresh),
#                 'access': str(refresh.access_token),
#             })
#         else:
#             # Redirect to the registration page if the email and password are not valid
#             registration_url = reverse('register')
#             return redirect(registration_url)

# class RegisterAPI(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         password = request.data.get('password')

#         # Create a new user with the email as the username
#         user = CustomUser.objects.create_user(email=email, password=password)

#         # Generate a token for the new user
#         refresh = RefreshToken.for_user(user)
#         return Response({
#             'refresh': str(refresh),
#             'access': str(refresh.access_token),
#         })

# class ResetPasswordAPI(APIView):
#     def post(self, request):
#         email = request.data.get('email')
#         new_password = request.data.get('new_password')

#         # Find the user with the given email
#         user = CustomUser.objects.filter(email=email).first()

#         if user is not None:
#             # Set the user's password to the new password
#             user.set_password(new_password)
#             user.save()
#             return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
#         else:
#             return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
