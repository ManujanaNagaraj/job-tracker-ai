from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import applications

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
app.include_router(applications.router)

@app.get("/")
def root():
    return {"message": "Job Tracker AI API is running"}
