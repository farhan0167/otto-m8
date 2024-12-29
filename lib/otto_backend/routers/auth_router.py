from fastapi import Depends, HTTPException, status, APIRouter
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from datetime import datetime
from pydantic import BaseModel

from db.db_engine import get_db
from db.models.users import Users
from db.auth import authenticate_user, hash_password, create_token
from routers.dependency import token_store, get_current_user

router = APIRouter()

class SignupUser(BaseModel):
    name: str
    email: str
    password: str

@router.post("/register", status_code=status.HTTP_201_CREATED, tags=["users"])
def register_user(user_info: SignupUser, db: Session = Depends(get_db)):
    name, email, password = user_info.name, user_info.email, user_info.password
    print(name, email, password)
    """Register a new user."""
    # Query the user table
    users = db.query(Users).all()
    user_emails = [user.email for user in users]
    if email in user_emails:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    
    hashed_pw = hash_password(password)
    new_user = Users(name=name, email=email, password=hashed_pw)
    db.add(new_user)
    db.commit()
    return {"message": f"User {name} registered successfully"}

@router.post("/login", tags=["users"])
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    """Login user and generate token."""
    user = authenticate_user(email=form_data.username, password=form_data.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token = create_token(email=user.email)
    return {"access_token": token, "token_type": "bearer"}


@router.get("/protected-resource")
def protected_route(user: Users = Depends(get_current_user)):
    """Access protected route."""
    return {"message": f"Hello {user.name}, welcome to the protected route!"}
