from django.urls import path

from .views import RegisterUsersView, LoginView

urlpatterns = [
path('signup/', RegisterUsersView.as_view(), name='signup'),
path('login/', LoginView.as_view(), name='login'),
]