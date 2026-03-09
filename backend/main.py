import os
import subprocess
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers.applications import router as applications_router
from routers.parser import router as parser_router
from routers.ai import router as ai_router
from routers.reminders import router as reminders_router

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Job Tracker AI API",
    description="Job application tracking system with AI-powered insights",
    version="1.0.0"
)

# CORS middleware with dynamic origins
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
frontend_url_2 = os.getenv("FRONTEND_URL_2", "")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    frontend_url,
    frontend_url_2,
]

# Filter out empty strings from origins
allowed_origins = [origin for origin in allowed_origins if origin]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Run migrations on startup (Railway will also run this in Procfile)
@app.on_event("startup")
def startup():
    """Run database migrations on startup."""
    try:
        # Try running migrations (will be no-op if already up to date)
        subprocess.run(["alembic", "upgrade", "head"], check=True)
        print("✅ Database migrations applied successfully")
    except subprocess.CalledProcessError as e:
        print(f"⚠️ Migration warning: {e}")
        # Fallback to create_all for local development without Alembic
        Base.metadata.create_all(bind=engine)
    except FileNotFoundError:
        print("⚠️ Alembic not found, using create_all fallback")
        Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(applications_router)
app.include_router(parser_router)
app.include_router(ai_router)
app.include_router(reminders_router)

@app.get("/")
def root():
    return {
        "message": "Job Tracker AI API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
def health_check():
    """Health check endpoint for Railway and monitoring."""
    return {
        "status": "healthy",
        "version": "1.0.0"
    }
