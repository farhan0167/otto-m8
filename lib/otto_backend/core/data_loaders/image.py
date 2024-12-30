import base64
from io import BytesIO
import requests
from PIL import Image

class ImageLoader:
    
    @staticmethod
    def load_image_from_url(url):
        is_valid_url = is_image_url(url)
        if is_valid_url:
            response = requests.get(url)
            if response.status_code == 200:
                return response.content
        return None
    
    @staticmethod
    def load_image_from_bytes(image_bytes: bytes):
        image_bytes_decoded = base64.b64decode(image_bytes)
        if is_image_bytes(image_bytes_decoded):
            return image_bytes_decoded
        return None
        
    
    

def is_image_url(url):
    try:
        response = requests.get(url)
        if response.status_code == 200 and response.headers['Content-Type'].startswith('image/'):
            return True
    except requests.exceptions.RequestException as e:
        print(f"Error validating image URL: {e}")
    return False

def is_image_bytes(image_bytes: bytes):
    try:
        image = Image.open(BytesIO(image_bytes))
        return image
    except Exception as e:
        print(f"Error validating image bytes: {e}")
    return None