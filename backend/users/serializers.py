from rest_framework import serializers
from .models import User
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'confirm_password']

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                "password": "Passwords do not match."
            })

        validate_password(attrs["password"])

        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        user = User.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "role",
            "is_verified",
            "is_staff",
            "created_at",
        ]

class UpdateProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ["username"]

class AdminUserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "username",
            "role",
            "is_active",
            "is_verified",
            "created_at",
        ]


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
            "password",
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
            password=raw_password,
            role="staff",
            is_verified=True,
            is_active=True,
        )

        send_staff_credentials_email(
            email=user.email,
            username=user.username,
            password=raw_password
        )

        return user


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