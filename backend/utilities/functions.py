from datetime import datetime
from django.conf import settings
from main.models import Logs
import secrets
import string


def generate_characters(num_characters):
    characters = string.ascii_letters + string.digits
    return ''.join(secrets.choice(characters) for i in range(num_characters))


def save_log(user, activity):
    logs_path = settings.MEDIA_ROOT + '/logs.txt'
    date_time = datetime.now().strftime("%m/%d/%y %H:%I:%S")
    with open(logs_path, 'a') as logs_txt:
        print(
            f"{ date_time }\t\t{ activity }\t\t{ user }",
            file=logs_txt
        )
