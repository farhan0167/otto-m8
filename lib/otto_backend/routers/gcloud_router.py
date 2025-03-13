import os
import json
import uuid

from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter
from fastapi import Request, Depends, HTTPException, Response
from fastapi.responses import RedirectResponse, HTMLResponse

from routers.dependency import token_store
from google_auth_oauthlib.flow import Flow
from integrations.gcloud.auth_flow import get_credentials


router = APIRouter()


# Google OAuth Client Secrets File (Must be in project root)
CLIENT_SECRET_FILE = "./.cache/gcloud/credentials.json"
GCLOUD_PATH = "./.cache/gcloud"

class GCloudLoginRequest(BaseModel):
    scopes: List[str]
    service: str

@router.post("/gcloud/auth/is_logged_in", tags=["Google Cloud"])
async def is_logged_in(request: GCloudLoginRequest):
    """Checks if user is logged in."""
    scopes, service = request.scopes, request.service
    token_path = f"{GCLOUD_PATH}/{service}_token.json"
    creds = get_credentials(scopes, token_path)
    return Response(
        status_code=200,
        content=json.dumps({
            "is_logged_in": creds is not None
        })
    )

@router.post("/gcloud/auth/login", tags=["Google Cloud"])
async def login(request: GCloudLoginRequest):
    """Redirects user to Google OAuth login page."""
    scopes, service = request.scopes, request.service
    
    # Generate a random state token
    state_token = str(uuid.uuid4())
    redis_key = f"tokens:{state_token}"
    # Store in redis
    token_store.hset(
        name=redis_key, 
        mapping={
            "service": service,
            "scopes": json.dumps(scopes)
        }
    )
    token_store.expire(redis_key, 3600)
    
    flow = Flow.from_client_secrets_file(CLIENT_SECRET_FILE, scopes, redirect_uri="http://localhost:8000/gcloud/auth/callback")
    auth_url, _ = flow.authorization_url(prompt="consent", state=redis_key)
    print(auth_url)
    #return RedirectResponse(auth_url)
    return Response(
        status_code=307,
        content=json.dumps({
            "redirect_uri": auth_url
        })
    )

@router.get("/gcloud/auth/callback", tags=["Google Cloud"])
async def auth_callback(code: str, state: Optional[str] = None):
    """Handles OAuth2 callback and stores tokens."""
    if not state:
        raise HTTPException(status_code=400, detail="Missing state parameter")

    # Get tokens
    auth_state = token_store.hgetall(state)
    service, scopes = auth_state["service"], json.loads(auth_state["scopes"])
    
    flow = Flow.from_client_secrets_file(CLIENT_SECRET_FILE, scopes, redirect_uri="http://localhost:8000/gcloud/auth/callback")
    flow.fetch_token(code=code)

    # Save credentials
    creds = flow.credentials
    with open(f"{GCLOUD_PATH}/{service}_token.json", "w") as token:
        token.write(creds.to_json())

    html_content = """
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Google Authentication Complete</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                text-align: center;
                background-color: #f4f4f9;
                padding: 50px;
            }
            .container {
                background: white;
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
                display: inline-block;
            }
            h1 {
                color: #4CAF50;
            }
            p {
                font-size: 18px;
                color: #555;
            }
            .close-btn {
                margin-top: 20px;
                padding: 10px 20px;
                font-size: 16px;
                color: white;
                background-color: #4CAF50;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                transition: background 0.3s ease-in-out;
            }
            .close-btn:hover {
                background-color: #45a049;
            }
        </style>
        <script>
            window.opener.postMessage({ status: "success", is_logged_in: true }, "*");
            setTimeout(() => window.close(), 2000);  // Auto-close the window after 2 seconds
        </script>
    </head>
    <body>
        <div class="container">
            <h1>Google Authentication Complete</h1>
            <p>You can now close this window and return to Otto_M8.</p>
            <button class="close-btn" onclick="window.close();">Close Window</button>
        </div>
    </body>
    </html>
    """
    
    return HTMLResponse(content=html_content, status_code=200)