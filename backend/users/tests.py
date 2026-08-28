from django.test import TestCase

from .models import User


class UserModelTests(TestCase):

    def test_create_customer_user(self):
        user = User.objects.create_user(
            username="customer1",
            email="customer@example.com",
            password="TestPassword123!",
            role="customer",
        )

        self.assertEqual(user.email, "customer@example.com")
        self.assertEqual(user.role, "customer")
        self.assertTrue(user.check_password("TestPassword123!"))
        self.assertTrue(user.is_active)

    def test_create_staff_user(self):
        user = User.objects.create_user(
            username="staff1",
            email="staff@example.com",
            password="TestPassword123!",
            role="staff",
        )

        self.assertEqual(user.role, "staff")
        self.assertEqual(user.email, "staff@example.com")

    def test_create_admin_user(self):
        user = User.objects.create_superuser(
            username="admin1",
            email="admin@example.com",
            password="TestPassword123!",
        )

        self.assertEqual(user.role, "admin")
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_verified)
        self.assertTrue(user.is_active)

    def test_user_string_representation(self):
        user = User.objects.create_user(
            username="customer1",
            email="customer@example.com",
            password="TestPassword123!",
        )

        self.assertEqual(str(user), "customer@example.com")