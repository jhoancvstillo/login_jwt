# users/views.py

from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import RegisterSerializer, UserSerializer
from .models import CustomUser
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken, OutstandingToken  # Añade esto



User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    Endpoint de registro de usuarios.
    """
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]


class MyTokenObtainPairView(TokenObtainPairView):
    """
    Personalizamos la obtención del token para almacenar
    el refresh token en una cookie.
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            # Obtenemos el refresh token del body de la respuesta
            refresh = response.data.get('refresh', None)
            if refresh:
                # Guardamos el refresh token en la cookie
                # Las propiedades Secure, HttpOnly, SameSite ya están definidas en SIMPLE_JWT
                response.set_cookie(
                    'refresh_token',
                    refresh,
                    httponly=True,
                    samesite='Lax',
                    secure=False  # En local podemos ponerlo False, en producción True
                )

        return response


class MyTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        
        if not refresh_token:
            return Response(
                {"detail": "Refresh token missing"},
                status=status.HTTP_401_UNAUTHORIZED  # Mejor usar 401 para que el frontend redirija
            )
        # Sobrescribimos el 'refresh' en el request.data para que TokenRefreshView lo procese
        data = {'refresh': refresh_token}
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        # Si todo va bien, devolvemos el nuevo access token
        return Response(serializer.validated_data, status=status.HTTP_200_OK)




class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Has accedido a un endpoint protegido con éxito!"})


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        """
        Retorna la información del usuario autenticado (request.user),
        usando un serializer para serializar el modelo.
        """
        serializer = UserSerializer(request.user)
        return Response(serializer.data)



class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.COOKIES.get('refresh_token')
            
            if refresh_token:
                token = RefreshToken(refresh_token)
                token.blacklist()  # Ahora funcionará

            response = Response(
                {"detail": "Logout exitoso"},
                status=status.HTTP_200_OK
            )
            response.delete_cookie('refresh_token')
            return response

        except Exception as e:
            return Response(
                {"detail": f"Error: {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST
            )
