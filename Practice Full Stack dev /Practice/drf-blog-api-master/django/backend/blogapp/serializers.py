
from rest_framework import serializers, status
from django.contrib.auth.models import User
from .models import Blog

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


class BlogSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(max_length=None, use_url=True, allow_null=True, required=False)

    class Meta:
        model = Blog
        fields = ['id', 'title', 'content', 'author', 'authorName', 'created_at', 'updated_at', 'image']
        read_only_fields = ['id','author']
        extra_kwargs = {
            'author': {'required': False},
            'id': {'required': False},
            'image': {'required': False},
        }
