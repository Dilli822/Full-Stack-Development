
from rest_framework import serializers, status
from django.contrib.auth.models import User
from .models import Blog
from rest_framework import serializers
from django.urls import reverse
from .models import *

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # Check if username already exists
        if User.objects.filter(username=validated_data['username']).exists():
            raise serializers.ValidationError({"username": "Username already taken"})
        elif User.objects.filter(email=validated_data['email']).exists():
            raise serializers.ValidationError({"email": "Email is already registered!"})
        
        user = User(
            email=validated_data['email'],
            username=validated_data['username']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')

class BlogSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)

    class Meta:
        model = Blog
        fields = ['id', 'author', 'author_id', 'title', 'content', 'author', 'authorName', 'created_at', 'updated_at', 'image', 'likes', 'liked_state', 'liked_by_current_user','liked_by','url']
        read_only_fields = ['id','author']
        extra_kwargs = {
            'author': {'required': False},
            'id': {'required': False},
            'image': {'required': False},
            'likes': {'required': False},
            'liked_by': {'required': False},
            
        }
        
class CurrentUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class BlogLikesSerializer(serializers.ModelSerializer):
    id = serializers.ReadOnlyField()
    author_id = serializers.ReadOnlyField(source='author.id')
    blog_name = serializers.ReadOnlyField(source='title')
    likes = serializers.IntegerField(required=False)
    liked_state = serializers.SerializerMethodField()
    liked_by_current_user = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = ('id','author_id', 'blog_name', 'likes', 'liked_state', 'liked_by_current_user', 'liked_by',  'updated_at', 'created_at', 'image', 'url')

    def get_liked_state(self, obj):
        user = self.context['request'].user
        return user in obj.liked_by.all()

    def get_liked_by_current_user(self, obj):
        user = self.context['request'].user
        return user.id in obj.liked_by.values_list('id', flat=True)


class BlogLinkSerializer(serializers.ModelSerializer):
    url = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = ['id', 'title', 'author', 'created_at', 'updated_at',  'url']

    def get_url(self, obj):
        request = self.context.get('request')
        if request is not None:
            return reverse('blog-detail', kwargs={'pk': obj.pk})
        return None

class ShareUrlSerializer(serializers.ModelSerializer):
    slug = serializers.SlugField(read_only=True)

    class Meta:
        model = Blog
        fields = '__all__'



class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'blog', 'author', 'comment_content', 'comment_created_at')