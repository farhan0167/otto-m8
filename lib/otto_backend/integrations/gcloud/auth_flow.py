import os
from typing import List
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request

GCLOUD_PATH = "./.cache/gcloud"

def get_credentials(
    scopes: List[str],
    service: str,
):
    """Loads credentials from token.json or starts OAuth flow."""
    creds = None
    token_path = f"{GCLOUD_PATH}/{service}_token.json"

    if os.path.exists(token_path):
        creds = Credentials.from_authorized_user_file(token_path, scopes=scopes)

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

def create_credential_file(service: str, creds: Credentials):
    token_path = f"{GCLOUD_PATH}/{service}_token.json"
    with open(token_path, "w") as token:
        token.write(creds.to_json())