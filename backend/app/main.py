import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import lesson, translate, tutor, voice

load_dotenv()

app = FastAPI(
    title="VernacAI API",
    description="AI-powered vernacular learning platform",
    version="1.0.0",
)


# ---------------------------------------------------------
# CORS
# ---------------------------------------------------------

frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173",
)

allowed_origins = [
    origin.strip()
    for origin in frontend_url.split(",")
    if origin.strip()
]

# Always allow the local Vite development server.
if "http://localhost:5173" not in allowed_origins:
    allowed_origins.append("http://localhost:5173")


app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------------------------------------
# Routes
# ---------------------------------------------------------

app.include_router(lesson.router)
app.include_router(translate.router)
app.include_router(tutor.router)
app.include_router(voice.router)


# ---------------------------------------------------------
# Root
# ---------------------------------------------------------

@app.get("/")
def root():
    return {
        "message": "VernacAI API is running",
        "status": "online",
        "version": "1.0.0",
    }


# ---------------------------------------------------------
# Health Check
# ---------------------------------------------------------

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "VernacAI backend",
    }