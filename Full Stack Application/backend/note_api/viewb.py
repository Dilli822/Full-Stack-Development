from rest_framework.response import Response
from rest_framework import status, generics
from note_api.models import NoteModel
from note_api.serializers import NoteSerializer
import math
from datetime import datetime
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework import generics, authentication, permissions
from rest_framework_jwt.authentication import JSONWebTokenAuthentication
from django.shortcuts import redirect

class Notes(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = NoteSerializer
    queryset = NoteModel.objects.all()

    def get(self, request):
        page_num = int(request.GET.get("page", 1))
        limit_num = int(request.GET.get("limit", 10))
        start_num = (page_num - 1) * limit_num
        end_num = limit_num * page_num
        search_param = request.GET.get("search")
        notes = NoteModel.objects.all()
        total_notes = notes.count()
        if search_param:
            # here double underscore for forieng key relation with db and icontains means incase sensitive for search_param
            notes = notes.filter(title__icontains=search_param)
            # here many flag will take not only single object but list of objects 
        serializer = self.serializer_class(notes[start_num:end_num], many=True)
        return Response({
            "status": "success",
            "total": total_notes,
            "page": page_num,
            "last_page": math.ceil(total_notes / limit_num),
            "notes": serializer.data
        })

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"status": "success", "note": serializer.data}, status=status.HTTP_201_CREATED)
        else:
            return Response({"status": "fail", "message": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


class NoteDetail(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    queryset = NoteModel.objects.all()
    serializer_class = NoteSerializer

    def get_note(self, pk):
        try:
            return NoteModel.objects.get(pk=pk)
        except:
            return None

    def get(self, request, pk):
        note = self.get_note(pk=pk)
