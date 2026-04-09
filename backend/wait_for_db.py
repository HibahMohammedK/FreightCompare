import time
import os
import django
import psycopg2

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "config.settings")
django.setup()

from django.conf import settings

while True:
    try:
        conn = psycopg2.connect(
            dbname=settings.DATABASES['default']['NAME'],
            user=settings.DATABASES['default']['USER'],
            password=settings.DATABASES['default']['PASSWORD'],
            host=settings.DATABASES['default']['HOST'],
            port=settings.DATABASES['default']['PORT'],
        )
        conn.close()
        print("✅ Database is ready!")
        break
    except psycopg2.OperationalError:
        print("⏳ Waiting for database...")
        time.sleep(2)