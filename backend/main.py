from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers.applications import router as applications_router
from routers.parser import router as parser_router
from routers.ai import router as ai_router

app = FastAPI(title="Job Tracker AI API")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Create database tables
@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)

# Include routers
app.include_router(applications_router)
app.include_router(parser_router)
app.include_router(ai_router)

@app.get("/")
def root():
    return {"message": "Job Tracker AI API is running"}
