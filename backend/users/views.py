from .models import User
from .serializers import RegisterSerializer, UserProfileSerializer

from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.generics import RetrieveAPIView
from rest_framework.response import Response
from rest_framework.views import APIView

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from django.core.cache import cache
from django.contrib.auth import authenticate
from django.db.models import Q

import uuid

from .utils import generate_otp, hash_otp, send_otp_email

from rest_framework.permissions import BasePermission
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView
from rest_framework.pagination import PageNumberPagination

from .serializers import (
    AdminUserListSerializer,
    CreateStaffSerializer,
)


# =========================
# REGISTER
# =========================
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.save(is_active=False, is_verified=False)

        otp = generate_otp()
        otp_hash = hash_otp(otp)
        verification_id = uuid.uuid4().hex

        cache.set(
            f"verify:{verification_id}",
            {
                "email": user.email,
                "otp_hash": otp_hash,
                "attempts": 0,
            },
            timeout=300
        )

        send_otp_email(user.email, otp)

        return Response({
            "message": "OTP sent",
            "verification_id": verification_id
        })


# =========================
# VERIFY OTP + AUTO LOGIN
# =========================
class VerifyOTPView(APIView):
    def post(self, request):
        verification_id = request.data.get("verification_id")
        otp = request.data.get("otp")

        data = cache.get(f"verify:{verification_id}")

        if not data:
            return Response({"error": "OTP expired"}, status=400)

        if data["attempts"] >= 5:
            return Response({"error": "Too many attempts"}, status=400)

        if hash_otp(otp) != data["otp_hash"]:
            data["attempts"] += 1
            cache.set(f"verify:{verification_id}", data, timeout=300)
            return Response({"error": "Invalid OTP"}, status=400)

        # ✅ success
        user = User.objects.get(email=data["email"])
        user.is_verified = True
        user.is_active = True
        user.save()

        cache.delete(f"verify:{verification_id}")

        # 🔐 AUTO LOGIN (JWT)
        refresh = RefreshToken.for_user(user)

        res = Response({
            "message": "Verified successfully",
            "access": str(refresh.access_token),
        })

        # ✅ store refresh token in cookie
        res.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,  # 🔥 True in production (HTTPS)
            samesite="Lax",
        )

        return res


# =========================
# RESEND OTP
# =========================
class ResendOTPView(APIView):
    def post(self, request):
        email = request.data.get("email")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        otp = generate_otp()
        otp_hash = hash_otp(otp)
        verification_id = uuid.uuid4().hex

        cache.set(
            f"verify:{verification_id}",
            {
                "email": user.email,
                "otp_hash": otp_hash,
                "attempts": 0,
            },
            timeout=300
        )

        send_otp_email(user.email, otp)

        return Response({
            "message": "OTP resent",
            "verification_id": verification_id
        })


# =========================
# LOGIN
# =========================
class LoginView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        password = request.data.get("password")

        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response(
                {"error": "Invalid credentials"},
                status=status.HTTP_401_UNAUTHORIZED
            )

        if not user.is_verified and user.role == "customer":
            return Response(
                {"error": "Please verify your email first"},
                status=status.HTTP_403_FORBIDDEN
            )

        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            refresh = response.data.get("refresh")
            access = response.data.get("access")

            res = Response({"access": access}, status=status.HTTP_200_OK)

            res.set_cookie(
                key="refresh_token",
                value=refresh,
                httponly=True,
                secure=False,  
                samesite="Lax",
            )

            return res

        return response


# =========================
# LOGOUT
# =========================
class LogoutView(APIView):

    def post(self, request):
        res = Response({"message": "Logged out"})
        res.delete_cookie("refresh_token")
        return res


# =========================
# REFRESH TOKEN (COOKIE)
# =========================
class CookieTokenRefreshView(TokenRefreshView):

    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh_token")

        if not refresh:
            return Response({"error": "No refresh token"}, status=400)

        request.data["refresh"] = refresh
        return super().post(request, *args, **kwargs)


# =========================
# PROFILE
# =========================
class ProfileView(RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
# ========================================================================================================
# ================  ADMIN VIEWS =============================
# ========================================================================================================

class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "admin"
        )
    
class AdminUserPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100

class AdminUserListView(ListAPIView):
    serializer_class = AdminUserListSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    pagination_class = AdminUserPagination

    def get_queryset(self):

        queryset = User.objects.all().order_by("-created_at")

        role = self.request.query_params.get("role")
        search = self.request.query_params.get("search")

        if role and role != "all":
            queryset = queryset.filter(role=role)

        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search)
            )

        return queryset


class CreateStaffView(CreateAPIView):
    serializer_class = CreateStaffSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]


class ToggleUserBlockView(APIView):
    permission_classes = [IsAuthenticated, IsAdminRole]

    def patch(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=404
            )

        if user.role == "admin":
            return Response(
                {"error": "Admin cannot be blocked"},
                status=400
            )

        user.is_active = not user.is_active
        user.save()

        return Response({
            "message": "User updated",
            "is_active": user.is_active
        })