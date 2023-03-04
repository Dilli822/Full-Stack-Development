# from django.db import models

# # Create your models here.
# from django.db import models

# # Create your models here.
# from django.db import models
# from django.contrib.auth.models import User

# class BlogPost(models.Model):
#     title = models.CharField(max_length=255)
#     body = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     updated_at = models.DateTimeField(auto_now=True)
#     author = models.ForeignKey(User, on_delete=models.CASCADE)
#     authorName = models.CharField(max_length=100)

#     objects = models.Manager()


# blog/models.py
from django.db import models
from django.contrib.auth.models import User

class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    authorName = models.CharField(max_length=100)

    def __str__(self):
        return str(self.title)
