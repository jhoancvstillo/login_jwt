
from django.contrib import admin
from django.urls import path
# myproject/urls.py

from django.contrib import admin
from django.urls import path
from users.views import RegisterView, MyTokenObtainPairView, MyTokenRefreshView, ProtectedView, ProfileView, LogoutView
from rest_framework_simplejwt.views import TokenVerifyView

urlpatterns = [
    path('admin/', admin.site.urls),

    # Endpoints de autenticación
    path('api/register/', RegisterView.as_view(), name='register'),
    path('api/login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/refresh/', MyTokenRefreshView.as_view(), name='token_refresh'),
    path('api/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/protected/', ProtectedView.as_view(), name='protected_view'),
    path('api/profile/', ProfileView.as_view(), name='profile'),  # <-- Nueva ruta
    path('api/logout/', LogoutView.as_view(), name='logout'),  # <-- Nueva ruta
]
