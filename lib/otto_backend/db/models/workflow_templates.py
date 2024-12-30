from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON
from ..base import Base
import datetime

class WorkflowTemplates(Base):
    __tablename__ = "workflow_templates"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(255), index=True)
    description = Column(Text, nullable=True)
    backend_template = Column(Text, nullable=True)
    frontend_template = Column(Text, nullable=True)
    dockerfile_template = Column(Text, nullable=True)
    deployment_url = Column(Text, nullable=True)
    container_id = Column(String(255), nullable=True)
    image_id = Column(String(255), nullable=True)