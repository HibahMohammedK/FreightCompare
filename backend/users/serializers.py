from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from django.core.exceptions import ValidationError
from subscription.models import Subscription
from .validators import validate_name


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [ 
            'email',
            'username',
            'first_name',
            'last_name', 
            'password', 
            'confirm_password'
            ]

    def validate_first_name(self, value):
        value = value.strip()

        if value:
            validate_name(value, "First name")

        return value


    def validate_last_name(self, value):
        value = value.strip()

        if value:
            validate_name(value, "Last name")

        return value
    
    def validate(self, attrs):

        if attrs["password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password":
                "Passwords do not match."
            })

        try:
            validate_password(
                attrs["password"]
            )

        except ValidationError as e:

            raise serializers.ValidationError({
                "password": e.messages
            })

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        user = User.objects.create_user(**validated_data)
        return user



class UserProfileSerializer(serializers.ModelSerializer):
    force_password_change = serializers.BooleanField(read_only=True)
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "first_name",
            "last_name",
            "role",
            "status",
            "is_verified",
            "profile_image",
            "is_staff",
            "created_at",
            "force_password_change",
        ]
    
class UpdateProfileSerializer(serializers.ModelSerializer):

    remove_profile_image = serializers.BooleanField(
        write_only=True,
        required=False,
    )
    

    class Meta:
        model = User
        fields = ["username", "first_name", "last_name", "profile_image", "remove_profile_image"]

    def validate_first_name(self, value):
        value = value.strip()

        if value:
            validate_name(value, "First name")

        return value


    def validate_last_name(self, value):
        value = value.strip()

        if value:
            validate_name(value, "Last name")

        return value

class AdminUserListSerializer(serializers.ModelSerializer):
    is_premium = serializers.SerializerMethodField()
    ticket_count = serializers.IntegerField(read_only=True)
    active_ticket_count = serializers.IntegerField(read_only=True)
    plan_name = serializers.SerializerMethodField()
        
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "username",
            "profile_image",
            "role",
            "status",
            "plan_name",
            "is_active",
            "is_verified",
            "created_at",
            "is_premium",
            "ticket_count",
            "active_ticket_count"
        ]

    def get_is_premium(self, obj):
        try:
            return obj.subscription.status == "active"
        except Subscription.DoesNotExist:
            return False

    def get_plan_name(self, obj):

        if (
            hasattr(obj, "subscription")
            and obj.subscription
            and obj.subscription.status == "active"
            and obj.subscription.plan
        ):
            return obj.subscription.plan.name

        return None


from .utils import send_staff_credentials_email


class CreateStaffSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            "email",
            "username",
            "first_name",
            "last_name",
            "password",
            "force_password_change",
        ]

    def validate_email(self, value):
        if User.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "Email already exists."
            )

        return value


    def create(self, validated_data):

        raw_password = validated_data["password"]

        user = User.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            first_name=validated_data.get(
                "first_name",
                ""
            ),
            last_name=validated_data.get(
                "last_name",
                ""
            ),
            password=raw_password,
            role="staff",
            is_verified=True,
            is_active=True,
            force_password_change=True,
        )

        send_staff_credentials_email(
            email=user.email,
            username=user.username,
            password=raw_password
        )

        return user

class ChangeEmailSerializer(serializers.Serializer):
    new_email = serializers.EmailField()

    def validate_new_email(self, value):

        if User.objects.filter(
            email=value
        ).exists():

            raise serializers.ValidationError(
                "Email already exists."
            )

        return value


class VerifyEmailChangeSerializer(serializers.Serializer):
    verification_id = serializers.CharField()
    otp = serializers.CharField()

class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    confirm_password = serializers.CharField()

    def validate(self, attrs):
        user = self.context["request"].user

        # 🔴 Current password check
        if not user.check_password(attrs["current_password"]):
            raise serializers.ValidationError({
                "current_password": "Current password is incorrect"
            })

        # 🔴 Match check
        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match"
            })

        # 🔴 Django password validators (VERY IMPORTANT)
        try:
            validate_password(attrs["new_password"], user)
        except Exception as e:
            raise serializers.ValidationError({
                "new_password": list(e.messages)
            })

        return attrs
    
class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

from .models import PasswordResetToken
from .utils import hash_token

class ResetPasswordSerializer(serializers.Serializer):
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    confirm_password = serializers.CharField()

    def validate(self, attrs):

        if attrs["new_password"] != attrs["confirm_password"]:
            raise serializers.ValidationError({
                "confirm_password": "Passwords do not match"
            })

        try:
            validate_password(attrs["new_password"])
        except Exception as e:
            raise serializers.ValidationError({
                "new_password": list(e.messages)
            })

        token_hash = hash_token(attrs["token"])

        try:
            reset_obj = PasswordResetToken.objects.get(token_hash=token_hash)
        except PasswordResetToken.DoesNotExist:
            raise serializers.ValidationError({
                "token": "Invalid or expired token"
            })

        if not reset_obj.is_valid():
            raise serializers.ValidationError({
                "token": "Token expired or already used"
            })

        attrs["reset_obj"] = reset_obj
        return attrs