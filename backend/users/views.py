from .models import User
from .serializers import RegisterSerializer, UserProfileSerializer, UpdateProfileSerializer

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

from realtime.broadcaster import RealtimeBroadcaster
from realtime.events import STAFF_STATUS_CHANGED

from .serializers import (
    AdminUserListSerializer,
    CreateStaffSerializer,
    ChangePasswordSerializer,
    ForgotPasswordSerializer,
    ResetPasswordSerializer,
    ChangeEmailSerializer,
    VerifyEmailChangeSerializer
)
from .utils import verify_google_token
from .exceptions import handle_exception
from tickets.services import TicketAssignmentService
from subscription.models import Subscription
from tickets.models import Ticket

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
# Change Password
# =========================
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        user = request.user
        user.set_password(serializer.validated_data["new_password"])

        if user.role == "staff":
            user.force_password_change = False

        user.save()

        return Response({
            "message": "Password changed successfully"
        })

from .models import PasswordResetToken
from .utils import generate_reset_token, hash_token, send_password_reset_email
from django.utils import timezone
from datetime import timedelta

class ForgotPasswordView(APIView):

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # 🔐 NEVER reveal user existence
            return Response({
                "message": "If an account exists, a reset link has been sent."
            })

        token = generate_reset_token()
        token_hash = hash_token(token)

        PasswordResetToken.objects.create(
            user=user,
            token_hash=token_hash,
            expires_at=timezone.now() + timedelta(minutes=15)
        )

        send_password_reset_email(user.email, token)

        return Response({
            "message": "If an account exists, a reset link has been sent."
        })

class ResetPasswordView(APIView):

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        reset_obj = serializer.validated_data["reset_obj"]
        user = reset_obj.user

        user.set_password(serializer.validated_data["new_password"])
        user.save()

        reset_obj.is_used = True
        reset_obj.save()

        return Response({
            "message": "Password reset successful"
        })

class ValidateResetTokenView(APIView):

    permission_classes = []

    def get(self, request):
        token = request.query_params.get("token")

        if not token:
            return Response(
                {"valid": False},
                status=400
            )

        token_hash = hash_token(token)

        try:
            reset_obj = PasswordResetToken.objects.get(
                token_hash=token_hash
            )
        except PasswordResetToken.DoesNotExist:
            return Response({"valid": False})

        return Response({
            "valid": reset_obj.is_valid()
        })

class GoogleLoginView(APIView):
    def post(self, request):
        token = request.data.get("token")

        idinfo = verify_google_token(token)

        if not idinfo:
            return Response(
                {"error": "Invalid Google token"},
                status=400
            )

        email = idinfo.get("email")
        name = idinfo.get("name")

        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                "username": name,
                "is_verified": True,
            }
        )

        refresh = RefreshToken.for_user(user)

        res = Response({
            "access": str(refresh.access_token)
        })

        res.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=True,
            secure=False,
            samesite="Lax",
        )

        return res
    
# =========================
# PROFILE
# =========================
class ProfileView(RetrieveAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]
    

    def get_object(self):
        return self.request.user
    
class UpdateProfileView(UpdateAPIView):

    serializer_class = UpdateProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
    def perform_update(self, serializer):

        user = serializer.instance

        if serializer.validated_data.get(
            "remove_profile_image"
        ):

            if user.profile_image:
                user.profile_image.delete(
                    save=False
                )

            user.profile_image = None

        serializer.save()
    
class ChangeEmailView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = ChangeEmailSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        new_email = serializer.validated_data[
            "new_email"
        ]

        otp = generate_otp()

        verification_id = uuid.uuid4().hex

        cache.set(
            f"email_change:{verification_id}",
            {
                "user_id": str(request.user.id),
                "new_email": new_email,
                "otp_hash": hash_otp(otp),
                "attempts": 0,
            },
            timeout=300
        )

        send_otp_email(
            new_email,
            otp
        )

        return Response({
            "message": "OTP sent",
            "verification_id": verification_id
        })
    
class VerifyEmailChangeView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = VerifyEmailChangeSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        verification_id = serializer.validated_data[
            "verification_id"
        ]

        otp = serializer.validated_data[
            "otp"
        ]

        data = cache.get(
            f"email_change:{verification_id}"
        )

        if not data:
            return Response(
                {
                    "error": "OTP expired"
                },
                status=400
            )

        if data["attempts"] >= 5:
            return Response(
                {
                    "error": "Too many attempts"
                },
                status=400
            )

        if hash_otp(otp) != data["otp_hash"]:

            data["attempts"] += 1

            cache.set(
                f"email_change:{verification_id}",
                data,
                timeout=300
            )

            return Response(
                {
                    "error": "Invalid OTP"
                },
                status=400
            )

        request.user.email = data[
            "new_email"
        ]

        request.user.save()

        cache.delete(
            f"email_change:{verification_id}"
        )

        return Response({
            "message": "Email updated successfully",
            "email": request.user.email,
        })
    
# ========================================================================================================
# ================  ADMIN VIEWS =============================
# ========================================================================================================
class IsAdminRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "admin"
        )
    
class AdminDashboardView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsAdminRole
    ]

    def get(self, request):

        total_users = User.objects.filter(
            role="customer"
        ).count()

        active_staff = User.objects.filter(
            role="staff"
        ).exclude(
            status="offline"
        ).count()

        premium_users = Subscription.objects.filter(
            status="active"
        ).count()

        open_tickets = Ticket.objects.filter(
            status__in=[
                "open",
                "assigned",
                "in_progress",
            ]
        ).count()

        return Response({
            "total_users": total_users,
            "premium_users": premium_users,
            "active_staff": active_staff,
            "open_tickets": open_tickets,
            "active_chats": 0
        })
        
class AdminUserPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = "page_size"
    max_page_size = 100

class AdminUserListView(ListAPIView):
    serializer_class = AdminUserListSerializer
    permission_classes = [IsAuthenticated, IsAdminRole]
    pagination_class = AdminUserPagination

    def get_queryset(self):

        queryset = User.objects.filter(role='customer').order_by("-created_at")
        search = self.request.query_params.get("search")
 
        if search:
            queryset = queryset.filter(
                Q(username__icontains=search) |
                Q(email__icontains=search)
            )

        return queryset

from django.db.models import Count
    
class StaffListView(ListAPIView):
    serializer_class = AdminUserListSerializer
    permission_classes = [
        IsAuthenticated,
        IsAdminRole
    ]
    pagination_class = AdminUserPagination

    def get_queryset(self):

        queryset = ( User.objects.filter(role="staff")
            .annotate(
                ticket_count=Count("assigned_tickets"),

                active_ticket_count=Count(
                    "assigned_tickets",
                    filter=Q(
                        assigned_tickets__status__in=[
                            "assigned",
                            "in_progress",
                            "resolved",
                        ]
                    ),
                ),
            )
            .order_by("-created_at")
        )
        
        search = self.request.query_params.get("search")
        status = self.request.query_params.get("status")

        if status and status != "all":
            queryset = queryset.filter(
                status=status
            )

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

class UpdateStaffStatusView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsAdminRole
    ]

    def patch(self, request, user_id):

        try:
            user = User.objects.get(
                id=user_id,
                role="staff"
            )

        except User.DoesNotExist:
            return Response(
                {"error": "Staff not found"},
                status=404
            )

        status_value = request.data.get(
            "status"
        )

        if status_value not in [
            "online",
            "busy",
            "offline"
        ]:
            return Response(
                {"error": "Invalid status"},
                status=400
            )

        old_status = user.status

        user.status = status_value
        user.save()

        RealtimeBroadcaster.broadcast(
            event=STAFF_STATUS_CHANGED,
            data={
                "user_id": str(user.id),
                "status": user.status,
            },
        )

        if (
            old_status != "online"
            and user.status == "online"
        ):
            TicketAssignmentService.assign_pending_tickets()

        return Response(
            {
                "message": "Status updated",
                "status": user.status,
            }
        )


# ===================================================================================
# ======================== STAFF VIEWS ==================================
# ===================================================================================
class IsStaffRole(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role == "staff"
        )

class StaffUpdateOwnStatusView(APIView):
    permission_classes = [
        IsAuthenticated,
        IsStaffRole
    ]

    def patch(self, request):

        try:

            status_value = request.data.get(
                "status"
            )

            if status_value not in [
                "online",
                "busy",
                "offline"
            ]:
                return Response(
                    {"error": "Invalid status"},
                    status=400
                )
            
            old_status = request.user.status

            request.user.status = status_value
            request.user.save()

            RealtimeBroadcaster.broadcast(
                event=STAFF_STATUS_CHANGED,
                data={
                    "user_id": str(request.user.id),
                    "status": request.user.status,
                },
            )

            if (
                old_status != "online"
                and request.user.status == "online"
            ):
                TicketAssignmentService.assign_pending_tickets()

            return Response({
                "message": "Status updated",
                "status": request.user.status,
            })

        except Exception as e:

            return handle_exception(
                e,
                "Failed to update staff status"
            )