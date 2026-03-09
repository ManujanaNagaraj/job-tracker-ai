from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, date
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False, index=True)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationship to job applications
    applications = relationship("JobApplication", back_populates="owner")
    
    def __repr__(self):
        return f"<User {self.email}>"


class JobApplication(Base):
    __tablename__ = "job_applications"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=True)
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
    
    # Relationships
    owner = relationship("User", back_populates="applications")
    notes_history = relationship("ApplicationNote", back_populates="application", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<JobApplication {self.company} - {self.job_title}>"


class ApplicationNote(Base):
    __tablename__ = "application_notes"
    
    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("job_applications.id"), nullable=False)
    content = Column(Text, nullable=False)
    note_type = Column(String, default="general")  # general, interview, followup, offer, rejection
    created_at = Column(DateTime, default=datetime.now)
    
    # Relationship to job application
    application = relationship("JobApplication", back_populates="notes_history")
    
    def __repr__(self):
        return f"<ApplicationNote {self.note_type} for App {self.application_id}>"
