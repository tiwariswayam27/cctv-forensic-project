from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    email = Column(String(120), unique=True, index=True, nullable=False)
    username = Column(String(50), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    name = Column(String(100), nullable=False)
    badgeNumber = Column(String(50), nullable=False)
    role = Column(String(50), default="Forensic Analyst") # Admin, Lead Forensic Investigator, Forensic Analyst, Auditor
    agency = Column(String(150), default="Metropolitan Cyber & Video Forensics Bureau")
    avatar = Column(Text, default="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Case(Base):
    __tablename__ = "cases"

    case_id = Column(String(50), primary_key=True, index=True)
    case_number = Column(String(50), unique=True, index=True, nullable=False)
    case_name = Column(String(200), nullable=False)
    description = Column(Text, default="")
    created_at = Column(String(50), default=lambda: datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"))
    investigator = Column(String(100), nullable=False)
    status = Column(String(50), default="Active") # Active, Under Review, Closed
    priority = Column(String(50), default="High") # Urgent, High, Medium, Low
    incident_location = Column(String(255), default="")
    incident_lat = Column(Float, default=40.7128)
    incident_lng = Column(Float, default=-74.0060)

    evidence_items = relationship("Evidence", back_populates="case_rel", cascade="all, delete-orphan")

class CCTVDevice(Base):
    __tablename__ = "cctv_devices"

    cctv_id = Column(String(50), primary_key=True, index=True)
    name = Column(String(150), nullable=False)
    vendor = Column(String(100), nullable=False)
    model = Column(String(100), default="Commercial IP Surveillance")
    location = Column(String(255), nullable=False)
    latitude = Column(Float, nullable=False, default=40.7128)
    longitude = Column(Float, nullable=False, default=-74.0060)
    ip_address = Column(String(50), default="192.168.1.100")
    channel = Column(Integer, default=1)
    status = Column(String(50), default="Active") # Active, Offline, Maintenance
    direction = Column(Float, default=180.0) # degrees
    coverage_radius = Column(Float, default=50.0) # meters
    created_at = Column(DateTime, default=datetime.utcnow)

    evidence_items = relationship("Evidence", back_populates="cctv_rel")

class Evidence(Base):
    __tablename__ = "evidence"

    evidence_id = Column(String(50), primary_key=True, index=True)
    case_id = Column(String(50), ForeignKey("cases.case_id"), index=True, nullable=False)
    cctv_id = Column(String(50), ForeignKey("cctv_devices.cctv_id"), index=True, nullable=True)
    file_name = Column(String(255), nullable=False) # Original preserved filename
    stored_filename = Column(String(255), nullable=False) # Sanitized vault filename
    file_path = Column(String(500), nullable=False)
    file_size = Column(String(50), default="0 MB")
    file_size_bytes = Column(Integer, default=0)
    sha256_hash = Column(String(64), nullable=False, index=True) # Baseline NIST hash
    current_hash = Column(String(64), nullable=False)
    acquired_at = Column(String(50), default=lambda: datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"))
    acquired_by = Column(String(100), default="Lead Investigator")
    description = Column(Text, default="")
    status = Column(String(50), default="Verified") # Verified, Tampered, Pending
    metadata_json = Column(JSON, default=dict) # duration, fps, resolution, codec, bitrate, audio_codec, container
    thumbnails_json = Column(JSON, default=list) # Base64 or relative URLs
    sample_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    case_rel = relationship("Case", back_populates="evidence_items")
    cctv_rel = relationship("CCTVDevice", back_populates="evidence_items")
    events = relationship("AnalysisEvent", back_populates="evidence_rel", cascade="all, delete-orphan")
    custody_entries = relationship("ChainOfCustody", back_populates="evidence_rel", cascade="all, delete-orphan")
    verifications = relationship("IntegrityVerificationHistory", back_populates="evidence_rel", cascade="all, delete-orphan")

class ChainOfCustody(Base):
    __tablename__ = "chain_of_custody"

    custody_id = Column(String(50), primary_key=True, index=True)
    record_id = Column(String(50), index=True) # for frontend compatibility
    evidence_id = Column(String(50), ForeignKey("evidence.evidence_id"), index=True, nullable=False)
    case_id = Column(String(50), ForeignKey("cases.case_id"), index=True, nullable=False)
    action = Column(String(150), nullable=False)
    details = Column(Text, default="")
    notes = Column(Text, default="")
    timestamp = Column(String(50), default=lambda: datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"))
    user = Column(String(100), nullable=False)
    sha256_snapshot = Column(String(64), default="")
    signature = Column(String(150), default="")

    evidence_rel = relationship("Evidence", back_populates="custody_entries")

class AnalysisEvent(Base):
    __tablename__ = "analysis_events"

    id = Column(String(50), primary_key=True, index=True)
    evidence_id = Column(String(50), ForeignKey("evidence.evidence_id"), index=True, nullable=False)
    timestamp_sec = Column(Float, default=0.0)
    timecode = Column(String(50), default="00:00:00")
    label = Column(String(150), nullable=False)
    category = Column(String(50), default="anomaly") # vehicle, person, anomaly, license_plate, motion
    confidence = Column(Float, default=0.95)
    notes = Column(Text, default="")
    bbox = Column(JSON, default=lambda: [30, 30, 70, 70]) # [ymin, xmin, ymax, xmax] 0-100%
    human_reviewed = Column(Boolean, default=False)
    approved_by = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    evidence_rel = relationship("Evidence", back_populates="events")

class IntegrityVerificationHistory(Base):
    __tablename__ = "integrity_verifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    evidence_id = Column(String(50), ForeignKey("evidence.evidence_id"), index=True, nullable=False)
    timestamp = Column(String(50), default=lambda: datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"))
    recalculated_hash = Column(String(64), nullable=False)
    baseline_hash = Column(String(64), nullable=False)
    is_match = Column(Boolean, nullable=False)
    verified_by = Column(String(100), default="System")
    notes = Column(Text, default="")

    evidence_rel = relationship("Evidence", back_populates="verifications")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(String(50), default=lambda: datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"))
    user = Column(String(100), default="System")
    action = Column(String(150), nullable=False)
    case_id = Column(String(50), nullable=True)
    evidence_id = Column(String(50), nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    status_code = Column(Integer, default=200)
    details = Column(Text, default="")

class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(150), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(50), default="info") # info, warning, critical
    is_read = Column(Boolean, default=False)
    created_at = Column(String(50), default=lambda: datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S"))
    related_link = Column(String(150), nullable=True)
