import random
import hashlib
from django.core.mail import EmailMultiAlternatives

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
