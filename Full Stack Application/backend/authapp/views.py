from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework_jwt.settings import api_settings

from .serializers import UserSerializer

jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER


class LoginView(generics.CreateAPIView):
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            payload = jwt_payload_handler(user)
            token = jwt_encode_handler(payload)
            response_data = {
                "token": token,
                "username": user.username
            }
            return Response(response_data)
        return Response(status=status.HTTP_401_UNAUTHORIZED)


class RegisterUsersView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

# from rest_framework.response import Response
# from rest_framework import status, generics, authentication, permissions
# from note_api.models import NoteModel
# from note_api.serializers import NoteSerializer, UserSerializer
# import math
# from datetime import datetime

# from rest_framework.permissions import IsAuthenticated
# from rest_framework.authtoken.models import Token
# from django.contrib.auth.models import User
# from rest_framework.authentication import TokenAuthentication


# class UserSignup(generics.GenericAPIView):
#     serializer_class = UserSerializer

#     def post(self, request):
#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid():
#             user = User.objects.create_user(**serializer.validated_data)
#             token, created = Token.objects.get_or_create(user=user)
#             return Response({"status": "success", "token": token.key}, status=status.HTTP_201_CREATED)
#         else:
#             return Response({"status": "fail", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# class UserLogin(generics.GenericAPIView):
#     serializer_class = UserSerializer

#     def post(self, request):
#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid():
#             user = authenticate(username=serializer.validated_data['username'], password=serializer.validated_data['password'])
#             if user is not None:
#                 token, created = Token.objects.get_or_create(user=user)
#                 return Response({"status": "success", "token": token.key}, status=status.HTTP_200_OK)
#             else:
#                 return Response({"status": "fail", "message": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
#         else:
#             return Response({"status": "fail", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# class Notes(generics.GenericAPIView):
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated]
#     serializer_class = NoteSerializer
#     queryset = NoteModel.objects.all()

#     def get(self, request):
#         page_num = int(request.GET.get("page", 1))
#         limit_num = int(request.GET.get("limit", 10))
#         start_num = (page_num - 1) * limit_num
#         end_num = limit_num * page_num
#         search_param = request.GET.get("search")
#         notes = NoteModel.objects.all()
#         total_notes = notes.count()
#         if search_param:
#             # here double underscore for forieng key relation with db and icontains means incase sensitive for search_param
#             notes = notes.filter(title__icontains=search_param)
#             # here many flag will take not only single object but list of objects 
#         serializer = self.serializer_class(notes[start_num:end_num], many=True)
#         return Response({
#             "status": "success",
#             "total": total_notes,
#             "page": page_num,
#             "last_page": math.ceil(total_notes / limit_num),
#             "notes": serializer.data
#         })

#     def post(self, request):
#         serializer = self.serializer_class(data=request.data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response({"status": "success", "note": serializer.data}, status=status.HTTP_201_CREATED)
#         else:
#             return Response({"status": "fail", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


# class NoteDetail(generics.GenericAPIView):
#     authentication_classes = [TokenAuthentication]
#     permission_classes = [IsAuthenticated]
#     queryset = NoteModel.objects.all()
#     serializer_class = NoteSerializer


#     def get_note(self, pk):
#         try:
#             return NoteModel.objects.get(pk=pk)
#         except NoteModel.DoesNotExist:
#             return None
            
#     def get(self, request, pk):
#         note = self.get_note(pk)
#         if note == None:
#             return Response({"status": "fail", "message": f"Note with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)
        
#         serializer = self.serializer_class(note)
#         return Response({"status": "success", "note": serializer.data})
        
#     def patch(self, request, pk):
#         note = self.get_note(pk)
#         if note == None:
#             return Response({"status": "fail", "message": f"Note with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)
            
#         serializer = self.serializer_class(
#             note, data=request.data, partial=True)
        
#         if serializer.is_valid():
#             serializer.validated_data['updatedAt'] = datetime.now()
#             serializer.save()
#             return Response({"status": "success", "note": serializer.data})
#         return Response({"status": "fail", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        
#     def delete(self, request, pk):
#         note = self.get_note(pk)
#         if note == None:
#             return Response({"status": "fail", "message": f"Note with Id: {pk} not found"}, status=status.HTTP_404_NOT_FOUND)
        
#         note.delete()
#         return Response({"status": "deleted", "message": f"Successfully Deleted Id: {pk}"}, status=status.HTTP_204_NO_CONTENT)

           
