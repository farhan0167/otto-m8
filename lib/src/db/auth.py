from typing import Optional
from datetime import timedelta, datetime

import secrets
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from db.db_engine import get_session
from db.models.users import Users
from app.routers.dependency import token_store

# Password hashing configuration
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    """Hash a plaintext password."""
    return pwd_context.hash(password)

def verify_password(plain_password: str, password: str) -> bool:
    """Verify a password against its hash."""
    return pwd_context.verify(plain_password, password)

def create_token(email: str) -> str:
    """Generate a simple token with 1-hour expiry."""
    token = secrets.token_hex(16)
    expires = int((datetime.utcnow() + timedelta(hours=1)).timestamp())
    redis_key = f"tokens:{token}"
    
    # Store the token data as a hash
    token_store.hset(
        name=redis_key, 
        mapping={"email": email, "expires": expires}
    )
    
    # Set expiration for the token key
    token_store.expire(redis_key, 3600)  # Expires in 1 hour
    
    return token

def authenticate_user(email: str, password: str, db: Session = get_session()) -> Optional[Users]:
    """Check if user exists and password is correct."""
    user = db.query(Users).filter_by(email=email).first()
    if not user or not verify_password(password, user.password):
        return None
    return user