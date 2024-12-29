from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON
from ..base import Base

class Users(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)
    email = Column(String(255), unique=True, index=True)
    password = Column(String(255))

