import os
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.config import settings
from app.database import engine, Base
from app.routers import (
    auth,
    cases,
    cctv,
    evidence,
    coc,
    events,
    ai,
    correlation,
    reports,
    recovery,
    audit,
    notifications,
    diagnostics,
)

# Initialize FastAPI App
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    description="Judicial & Forensic Video Intelligence Platform Backend API",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Configure CORS for Frontend Integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Static File Directories
app.mount(
    "/evidence_files",
    StaticFiles(directory=str(settings.EVIDENCE_DIR)),
    name="evidence_files",
)

app.mount(
    "/thumbnails",
    StaticFiles(directory=str(settings.THUMBNAIL_DIR)),
    name="thumbnails",
)

app.mount(
    "/reports_vault",
    StaticFiles(directory=str(settings.REPORT_DIR)),
    name="reports_vault",
)

# Include Routers
app.include_router(auth.router)
app.include_router(cases.router)
app.include_router(cctv.router)
app.include_router(evidence.router)
app.include_router(coc.router)
app.include_router(events.router)
app.include_router(ai.router)
app.include_router(correlation.router)
app.include_router(reports.router)
app.include_router(recovery.router)
app.include_router(audit.router)
app.include_router(notifications.router)
app.include_router(diagnostics.router)


@app.on_event("startup")
def on_startup():
    """
    Initialize database tables only.

    Demo/seed records are NOT created automatically.
    Real investigators can create their own cases,
    CCTV devices, and evidence through the application.
    """
    Base.metadata.create_all(bind=engine)

    print(
        "[CCTV Forensic Platform] Database tables initialized."
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
    )