from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Blog, Comment
from .serializers import BlogSerializer, CommentSerializer

class BlogCommentAPIView(APIView):
    def get(self, request):
        blogs = Blog.objects.all()
        blog_serializer = BlogSerializer(blogs, many=True)

        comments = Comment.objects.all()
        comment_serializer = CommentSerializer(comments, many=True)

        data = {
            'blogs': blog_serializer.data,
            'comments': comment_serializer.data
        }

        return Response(data)
