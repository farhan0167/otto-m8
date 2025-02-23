import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String

DB_HOST = os.getenv("DB_HOST", "postgres")
SQLALCHEMY_DATABASE_URL = f"postgresql://postgres:123456@{DB_HOST}:5432/postgres"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, 
    pool_size=20, 
    max_overflow=0
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    
# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
def get_session():
    return SessionLocal()