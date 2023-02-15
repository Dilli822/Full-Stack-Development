from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response

class UsernameList(APIView):
    def get(self, request):
        usernames = User.objects.values_list('username', flat=True)
        return Response(usernames)
