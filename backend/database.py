import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Load environment variables
load_dotenv()

# Get DATABASE_URL from environment, default to SQLite
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./job_tracker.db")

# Railway fix: replace postgres:// with postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite needs check_same_thread=False, PostgreSQL needs pool settings
connect_args = {}
engine_kwargs = {"connect_args": connect_args}

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
elif DATABASE_URL.startswith("postgresql"):
    # PostgreSQL connection pool settings
    engine_kwargs.update({"pool_size": 5, "max_overflow": 10})

engine = create_engine(DATABASE_URL, **engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
