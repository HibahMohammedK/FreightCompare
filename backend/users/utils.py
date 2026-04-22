import random
import hashlib
import secrets
from django.core.mail import EmailMultiAlternatives

from google.oauth2 import id_token
from google.auth.transport import requests
import os


def generate_otp():
    return str(random.randint(100000, 999999))

def hash_otp(otp: str):
    return hashlib.sha256(otp.encode()).hexdigest()


def send_otp_email(email, otp):
    subject = "Verify your FreightCompare account"

    text_content = f"Your OTP is {otp}"

    html_content = f"""
    <html>
      <body style="font-family: Arial; background:#f9f9f9; padding:20px;">
        <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:10px;">
          
          <h2 style="color:#1e40af;">Verify Your Email</h2>

          <p>Use the OTP below:</p>

          <h1 style="letter-spacing:5px; text-align:center;">
            {otp}
          </h1>

          <p>This OTP expires in 5 minutes.</p>

        </div>
      </body>
    </html>
    """

    email_msg = EmailMultiAlternatives(
        subject,
        text_content,
        None,
        [email],
    )

    email_msg.attach_alternative(html_content, "text/html")
    email_msg.send()


def send_staff_credentials_email(
    email,
    username,
    password
):
    subject = "Your Frieght Compare Staff Account Has Been Created"

    text_content = f"""
Hello {username},

An administrator created your Write Compiler staff account.

Login Email: {email}

Temporary Password: {password}

Please log in and change your password after first login.

Regards,
Frieght Compare Team
"""

    html_content = f"""
    <html>
      <body style="font-family: Arial; background:#f9f9f9; padding:20px;">
        <div style="
            max-width:500px;
            margin:auto;
            background:white;
            padding:30px;
            border-radius:10px;
        ">

          <h2 style="color:#1e40af;">
            Welcome to Frieght Compare
          </h2>

          <p>
            Your staff account has been created.
          </p>

          <p>
            Use the credentials below to log in:
          </p>

          <div style="
            background:#f3f4f6;
            padding:20px;
            border-radius:8px;
            margin-top:20px;
            margin-bottom:20px;
          ">

            <p>
              <strong>Email:</strong> {email}
            </p>

            <p>
              <strong>Username:</strong> {username}
            </p>

            <p>
              <strong>Temporary Password:</strong> {password}
            </p>

          </div>

          <p style="color:#b91c1c;">
            Please change your password after first login.
          </p>

          <p>
            Regards,<br/>
            Frieght Compare Team
          </p>

        </div>
      </body>
    </html>
    """

    email_msg = EmailMultiAlternatives(
        subject,
        text_content,
        None,
        [email],
    )

    email_msg.attach_alternative(
        html_content,
        "text/html"
    )

    email_msg.send()



def generate_reset_token():
    return secrets.token_urlsafe(32)


def hash_token(token: str):
    return hashlib.sha256(token.encode()).hexdigest()


def send_password_reset_email(email, token):
    reset_link = f"http://localhost:5173/reset-password?token={token}"

    subject = "Reset your FreightCompare password"

    text_content = f"Click the link to reset your password: {reset_link}"

    html_content = f"""
    <html>
      <body style="font-family: Arial; background:#f9f9f9; padding:20px;">
        <div style="max-width:500px; margin:auto; background:white; padding:30px; border-radius:10px;">
          
          <h2 style="color:#1e40af;">Reset Your Password</h2>

          <p>Click the button below to reset your password:</p>

          <a href="{reset_link}" style="display:inline-block; padding:10px 20px; background:#1e40af; color:white; text-decoration:none; border-radius:6px;">
            Reset Password
          </a>

          <p style="margin-top:20px;">This link expires in 15 minutes.</p>

        </div>
      </body>
    </html>
    """

    email_msg = EmailMultiAlternatives(
        subject,
        text_content,
        None,
        [email],
    )

    email_msg.attach_alternative(html_content, "text/html")
    email_msg.send()


def verify_google_token(token):
    try:
        idinfo = id_token.verify_oauth2_token(
            token,
            requests.Request(),
            os.getenv("GOOGLE_CLIENT_ID")
        )
        return idinfo
    except Exception:
        return None