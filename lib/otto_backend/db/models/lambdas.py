from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON
from ..base import Base

class Lambdas(Base):
    __tablename__ = "lambdas"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), unique=True, index=True)
    code = Column(Text, nullable=True)
    timeout = Column(Integer, nullable=True)
    runs = Column(Text, nullable=True)
    deployment_url = Column(Text, nullable=True)
    container_id = Column(String(255), nullable=True)
    image_id = Column(String(255), nullable=True)

