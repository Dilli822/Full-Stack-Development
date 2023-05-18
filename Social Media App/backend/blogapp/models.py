# blogapp/models.py
from django.db import models
from django.contrib.auth.models import User
from django.utils.text import slugify

class Blog(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    authorName = models.CharField(max_length=100)
    image = models.ImageField(upload_to='blog_images', null=True, blank=True)
    likes = models.IntegerField(default=0)
    liked_by = models.ManyToManyField(User, related_name='liked_blogs', blank=True)
    liked_state = models.BooleanField(default=False)
    liked_by_current_user = models.ForeignKey(User, related_name='liked_by_current_user', on_delete=models.CASCADE, null=True, blank=True)
    slug = models.SlugField(unique=True, null=True, blank=True)
    url = models.URLField(unique=True, null=True, blank=True)

    def __str__(self):
        return str(self.title)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        if not self.url:
            self.url = f'http://localhost:8000/api/blog/{self.slug}'
        super().save(*args, **kwargs)
        


# Comments section
class Comment(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE, related_name='comments')
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    comment_content = models.TextField()
    comment_created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.author} on {self.blog}"
    

