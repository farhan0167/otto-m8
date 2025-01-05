from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey, JSON, Float
from ..base import Base

class DraftTemplate(Base):
    """Table to store any temporary workflow.
    Essentially anything in edit stage and not deployed."""
    __tablename__ = "draft_templates"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String(255), index=True)
    description = Column(Text, nullable=True)
    frontend_template = Column(Text, nullable=True)
    # Reference to a template already deployed. This will constrain only 1 edit at any given time.
    reference_template_id = Column(Integer, unique=True, nullable=True)
    date_created = Column(DateTime)
    date_modified = Column(DateTime)