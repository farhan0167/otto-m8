import os

from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

def get_credentials(
    token_path: str = "./.cache/gcloud/token.json"
):
    """Loads credentials from token.json or starts OAuth flow."""
    creds = None

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path)

    # If no valid credentials exist, user must log in again
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            print("🔄 Access token expired, refreshing...")
            creds.refresh(Request())  # 🔄 This gets a new access token!
            with open(token_path, "w") as token:
                token.write(creds.to_json())  # Save the new token data
        else:
            print("❌ No refresh token available, user must log in again.")
            return None  # Or redirect to login

    return creds