from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON, Float
from ..base import Base

class Tracer(Base):
    __tablename__ = "tracer"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer)
    start_timestamp = Column(DateTime, index=True, nullable=False)
    end_timestamp = Column(DateTime, index=True, nullable=False)
    template_id = Column(Integer)
    execution_time = Column(Float)
    log = Column(JSON)
