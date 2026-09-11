from typing import List, Optional, Any
from pydantic import BaseModel, Field

# User Schemas
class UserBase(BaseModel):
    email: str
    username: str
    name: str
    badgeNumber: str
    role: str = "Forensic Analyst"
    agency: str = "Metropolitan Cyber & Video Forensics Bureau"
    avatar: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: str
    is_active: bool

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class LoginRequest(BaseModel):
    username_or_email: str
    password: str

# Case Schemas
class CaseBase(BaseModel):
    case_number: Optional[str] = None
    case_name: str
    description: Optional[str] = ""
    investigator: Optional[str] = "Insp. David Vance"
    status: Optional[str] = "Active"
    priority: Optional[str] = "High"
    incident_location: Optional[str] = ""
    incident_lat: Optional[float] = 40.7128
    incident_lng: Optional[float] = -74.0060

class CaseCreate(CaseBase):
    pass

class CaseResponse(CaseBase):
    case_id: str
    created_at: str

    class Config:
        from_attributes = True

# CCTV Device Schemas
class CCTVDeviceBase(BaseModel):
    name: str
    vendor: str
    model: Optional[str] = "Standard Surveillance Cam"
    location: str
    latitude: Optional[float] = 40.7128
    longitude: Optional[float] = -74.0060
    ip_address: Optional[str] = "192.168.10.100"
    channel: Optional[int] = 1
    status: Optional[str] = "Active"
    direction: Optional[float] = 180.0
    coverage_radius: Optional[float] = 50.0

class CCTVDeviceCreate(CCTVDeviceBase):
    pass

class CCTVDeviceResponse(CCTVDeviceBase):
    cctv_id: str

    class Config:
        from_attributes = True

# Evidence Schemas
class EvidenceMetadataSchema(BaseModel):
    duration: str = "00:00:00"
    duration_sec: float = 0.0
    resolution: str = "1920 × 1080"
    fps: float = 25.0
    codec: str = "H.264 / AVC"
    file_size: str = "0 MB"
    file_size_bytes: int = 0
    bitrate: Optional[str] = "2000 kbps"
    color_space: Optional[str] = "BT.709"
    audio_codec: Optional[str] = "AAC"
    container: Optional[str] = "MPEG-4 ISO"
    frame_count: Optional[int] = 0

class EvidenceResponse(BaseModel):
    evidence_id: str
    case_id: str
    cctv_id: Optional[str] = None
    file_name: str
    file_path: str
    file_size: str
    file_size_bytes: int
    sha256_hash: str
    current_hash: str
    acquired_at: str
    acquired_by: str
    description: Optional[str] = ""
    status: str
    metadata: Optional[Any] = None
    thumbnails: Optional[List[str]] = []
    sample_url: Optional[str] = None

    class Config:
        from_attributes = True

# Chain of Custody Schemas
class ChainOfCustodyCreate(BaseModel):
    evidence_id: str
    case_id: Optional[str] = None
    action: str
    details: Optional[str] = None
    notes: Optional[str] = None
    user: Optional[str] = None

class ChainOfCustodyResponse(BaseModel):
    custody_id: str
    record_id: Optional[str] = None
    evidence_id: str
    case_id: str
    action: str
    details: Optional[str] = ""
    notes: Optional[str] = ""
    timestamp: str
    user: str
    sha256_snapshot: Optional[str] = ""
    signature: Optional[str] = ""

    class Config:
        from_attributes = True

# Analysis Event Schemas
class AnalysisEventCreate(BaseModel):
    evidence_id: str
    timestamp_sec: float
    timecode: str
    label: str
    category: Optional[str] = "anomaly"
    confidence: Optional[float] = 0.95
    notes: Optional[str] = ""
    bbox: Optional[List[float]] = [30, 30, 70, 70]
    human_reviewed: Optional[bool] = False
    approved_by: Optional[str] = None

class AnalysisEventResponse(AnalysisEventCreate):
    id: str

    class Config:
        from_attributes = True

# AI Detection Request & Response
class AIDetectRequest(BaseModel):
    evidence_id: Optional[str] = None
    image_base64: Optional[str] = None
    frame_image: Optional[str] = None
    frame_timecode: Optional[str] = None
    time_range: Optional[str] = None
    custom_prompt: Optional[str] = None
    query: Optional[str] = None
    detection_type: Optional[str] = "all"

# Report Request
class ReportGenerateRequest(BaseModel):
    case_id: str
    evidence_id: Optional[str] = None

# Notification Response
class NotificationResponse(BaseModel):
    id: int
    title: str
    message: str
    severity: str
    is_read: bool
    created_at: str
    related_link: Optional[str] = None

    class Config:
        from_attributes = True
