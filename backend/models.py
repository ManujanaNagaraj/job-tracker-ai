from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean
from datetime import datetime, date
from database import Base

class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    company = Column(String, nullable=False)
    job_title = Column(String, nullable=False)
    job_url = Column(String)
    job_description = Column(Text)
    status = Column(String, default="Applied")
    applied_date = Column(DateTime, default=datetime.now)
    salary_range = Column(String)
    location = Column(String)
    notes = Column(Text)
    resume_version = Column(String)
    ai_tips = Column(Text)
    reminder_sent = Column(Boolean, default=False)
    follow_up_date = Column(DateTime)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)
