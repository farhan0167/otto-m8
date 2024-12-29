
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from db.base import Base
from db.db_engine import engine, get_session
from db.models.users import Users
from db.auth import hash_password
from routers import (
    template_router, 
    workflow_router, 
    block_types_router,
    function_call_router,
    auth_router,
    lambdas_router,
    instant_run_router
)

# TODO Refactor code so that things that do not need to be here, arent here.
# Need to have their own files, modules and abstraction. This is a hack.
def create_tables():
    """Create all tables in the database if they don't already exist."""
    Base.metadata.create_all(bind=engine)
    
# Function to create a new user at startup if they don't already exist
def create_default_user(db_session: Session):
    """
    Create a default user in the database if they don't already exist.

    The default user is given the username 'default_user' and the email 'default_user@example.com'.

    This function is used at startup to create a default user if no users exist in the database.
    """
    default_username = "default_user"
    default_email = "default_user@example.com.admin"
    default_password = "admin12345"

    # Check if the user already exists
    user = db_session.query(Users).filter_by(name=default_username).first()
    if not user:
        # User does not exist, so create a new one
        new_user = Users(name=default_username, email=default_email, password=hash_password(default_password))
        db_session.add(new_user)
        try:
            db_session.commit()
            print(f"User '{default_username}' created successfully.")
        except IntegrityError:
            db_session.rollback()
            print(f"User '{default_username}' already exists.")
    else:
        print(f"User '{default_username}' already exists.")
    
create_tables()

create_default_user(db_session=get_session())

app = FastAPI()

origins = [
    "http://localhost:3000"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(template_router.router)
app.include_router(workflow_router.router)
app.include_router(block_types_router.router)
app.include_router(function_call_router.router)
app.include_router(auth_router.router)
app.include_router(lambdas_router.router)
app.include_router(instant_run_router.router)