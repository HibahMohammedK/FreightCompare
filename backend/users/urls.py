from django.urls import path
from .views import (
    RegisterView,
    ProfileView,
    UpdateProfileView,
    LoginView,
    CookieTokenRefreshView,
    LogoutView,
    VerifyOTPView,
    ResendOTPView,

    AdminDashboardView,
    AdminUserListView,
    CreateStaffView,
    StaffListView,
    UpdateStaffStatusView,
    ToggleUserBlockView,
    ChangePasswordView,
    ValidateResetTokenView,

    ForgotPasswordView,
    ResetPasswordView,
    GoogleLoginView,
    ChangeEmailView,
    VerifyEmailChangeView,
   
    
    StaffUpdateOwnStatusView

)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view()),
    path('resend-otp/', ResendOTPView.as_view()),

    path('login/', LoginView.as_view(), name='login'),
    path('google-login/', GoogleLoginView.as_view(), name='google-login'),

    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),

    path('logout/', LogoutView.as_view(), name='logout'),

    path('profile/', ProfileView.as_view(), name='profile'),
    path("profile/update/",UpdateProfileView.as_view(), name="update_profile"),
    path("change-email/",ChangeEmailView.as_view(),name="change_email"),

    path("verify-email-change/",VerifyEmailChangeView.as_view(),name="verify_email_change"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot_password"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset_password"),
    path("reset-password/validate/", ValidateResetTokenView.as_view(), name="validate-reset-token"),
    
    path("admin/dashboard/", AdminDashboardView.as_view(), name ="admin_dashboard"),
    path("admin/users/", AdminUserListView.as_view(), name='admin_users'),
    path("admin/staff/",StaffListView.as_view(),name="staff_list"),
    path("admin/staff/create/", CreateStaffView.as_view(), name='create_staff'),
    path("admin/staff/<uuid:user_id>/status/",UpdateStaffStatusView.as_view(),name="update_staff_status"),
    path("admin/users/<uuid:user_id>/block/", ToggleUserBlockView.as_view(), name = 'block_user'),

    path("staff/status/", StaffUpdateOwnStatusView.as_view(), name="staff_update_status"),
]