
# blogapp/models.py
from django.db import models
from django.contrib.auth.models import User

class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    authorName = models.CharField(max_length=100)
    image = models.ImageField(upload_to='blog_images', null=True, blank=True)

    def __str__(self):
        return str(self.title)
