import sys
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from sqlalchemy.orm import Session
from app.database import engine, Base, SessionLocal
from app.models import (
    User, Case, CCTVDevice, Evidence, ChainOfCustody,
    AnalysisEvent, AuditLog, Notification
)
from app.auth import get_password_hash, create_custody_signature

def seed_database(db: Session = None):
    close_after = False
    if db is None:
        Base.metadata.create_all(bind=engine)
        db = SessionLocal()
        close_after = True

    try:
        # 1. Users
        users = [
            User(
                id="USR-001",
                email="investigator@forensic.gov",
                username="investigator",
                hashed_password=get_password_hash("investigator123"),
                name="Insp. David Vance",
                badgeNumber="INV-4092",
                role="Lead Forensic Investigator",
                agency="Metropolitan Cyber & Video Forensics Bureau",
                avatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80",
                is_active=True,
            ),
            User(
                id="USR-002",
                email="admin@forensic.gov",
                username="admin",
                hashed_password=get_password_hash("admin123"),
                name="Cmdr. Sarah Miller",
                badgeNumber="ADM-1001",
                role="Admin",
                agency="Digital Evidence & Chain of Custody Command",
                avatar="https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80",
                is_active=True,
            ),
            User(
                id="USR-003",
                email="analyst@forensic.gov",
                username="analyst",
                hashed_password=get_password_hash("analyst123"),
                name="Spec. Alex Chen",
                badgeNumber="ANL-8820",
                role="Forensic Analyst",
                agency="Video Enhancement & Biometrics Unit",
                avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80",
                is_active=True,
            ),
        ]
        for u in users:
            if not db.query(User).filter(User.id == u.id).first():
                db.add(u)

        # 2. Cases
        cases = [
            Case(
                case_id="CASE-2026-001",
                case_number="CR-99201",
                case_name="Market Road Investigation",
                description="Investigation into high-speed hit-and-run and pedestrian incident at the intersection of Market Road and 4th Avenue.",
                created_at="2026-09-04 10:15:00",
                investigator="Insp. David Vance",
                status="Active",
                priority="Urgent",
                incident_location="Market Road & 4th Avenue Intersection",
                incident_lat=40.7128,
                incident_lng=-74.0060,
            ),
            Case(
                case_id="CASE-2026-002",
                case_number="CR-99214",
                case_name="Jewelry Vault Perimeter Breach",
                description="Commercial burglary alarm trigger along West Bank commercial corridor. Reviewing entry point CCTV feeds.",
                created_at="2026-09-06 02:40:00",
                investigator="Insp. David Vance",
                status="Active",
                priority="High",
                incident_location="West Bank Commercial Arcade",
                incident_lat=40.7142,
                incident_lng=-74.0085,
            ),
        ]
        for c in cases:
            if not db.query(Case).filter(Case.case_id == c.case_id).first():
                db.add(c)

        # 3. CCTV Devices
        devices = [
            CCTVDevice(
                cctv_id="CCTV-001",
                name="North Market Intersection Cam",
                vendor="Hikvision",
                model="DS-2CD2087G2-LU (4K ColorVu)",
                location="Market Road (North Facing)",
                latitude=40.7135,
                longitude=-74.0055,
                ip_address="192.168.10.101",
                channel=1,
                status="Active",
                direction=180.0,
                coverage_radius=65.0,
            ),
            CCTVDevice(
                cctv_id="CCTV-002",
                name="South Pedestrian Overpass Cam",
                vendor="Dahua",
                model="IPC-HFW5842E-ZE-S2 (WizMind)",
                location="4th Avenue & South Crossing",
                latitude=40.7121,
                longitude=-74.0065,
                ip_address="192.168.10.102",
                channel=2,
                status="Active",
                direction=45.0,
                coverage_radius=50.0,
            ),
            CCTVDevice(
                cctv_id="CCTV-003",
                name="Commercial Bank ATM Cam",
                vendor="Axis Communications",
                model="P3245-V Dome",
                location="Central Market Plaza Entrance",
                latitude=40.7129,
                longitude=-74.0072,
                ip_address="192.168.10.103",
                channel=1,
                status="Active",
                direction=90.0,
                coverage_radius=40.0,
            ),
            CCTVDevice(
                cctv_id="CCTV-004",
                name="Alleyway Service Exit",
                vendor="Hanwha Techwin",
                model="XNV-8080R IR Dome",
                location="Rear Loading Bay 3",
                latitude=40.7118,
                longitude=-74.0048,
                ip_address="192.168.10.104",
                channel=4,
                status="Maintenance",
                direction=270.0,
                coverage_radius=35.0,
            ),
        ]
        for d in devices:
            if not db.query(CCTVDevice).filter(CCTVDevice.cctv_id == d.cctv_id).first():
                db.add(d)

        # 4. Evidence Items
        evidence_items = [
            Evidence(
                evidence_id="EVD-001",
                case_id="CASE-2026-001",
                cctv_id="CCTV-001",
                file_name="camera01_market_road_1030_1100.mp4",
                stored_filename="EVD-001_seed_camera01.mp4",
                file_path="/evidence/2026-09-04/camera01_market_road_1030_1100.mp4",
                file_size="48.2 MB",
                file_size_bytes=50541363,
                sha256_hash="8f43c9b71a2e5d98341602cf189a42be49386d34e9a8f4c281df693b821a719c",
                current_hash="8f43c9b71a2e5d98341602cf189a42be49386d34e9a8f4c281df693b821a719c",
                acquired_at="2026-09-04 10:20:14",
                acquired_by="Insp. David Vance",
                description="Direct NVR export of Channel 1 covering 10:30:00 to 11:00:00. Captured suspect vehicle departure.",
                status="Verified",
                metadata_json={
                    "duration": "00:30:00",
                    "duration_sec": 1800,
                    "resolution": "1920 × 1080 (Full HD)",
                    "fps": 25,
                    "codec": "H.264 / AVC (High Profile)",
                    "file_size": "48.2 MB",
                    "file_size_bytes": 50541363,
                    "bitrate": "2240 kbps CBR",
                    "color_space": "BT.709 (YUV420p)",
                    "audio_codec": "AAC-LC (48 kHz, Mono)",
                    "container": "MPEG-4 Base Media v1",
                    "frame_count": 45000,
                },
                thumbnails_json=[
                    "https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=400&auto=format&fit=crop&q=80",
                    "https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=400&auto=format&fit=crop&q=80",
                ],
                sample_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            ),
            Evidence(
                evidence_id="EVD-002",
                case_id="CASE-2026-001",
                cctv_id="CCTV-002",
                file_name="cctv02_pedestrian_crossing.mp4",
                stored_filename="EVD-002_seed_cctv02.mp4",
                file_path="/evidence/2026-09-04/cctv02_pedestrian_crossing.mp4",
                file_size="32.6 MB",
                file_size_bytes=34183577,
                sha256_hash="a43e790bf70d8923c14d9b62ef5863920bb61da93e506a5b98df7132a4e9b891",
                current_hash="a43e790bf70d8923c14d9b62ef5863920bb61da93e506a5b98df7132a4e9b891",
                acquired_at="2026-09-04 10:45:00",
                acquired_by="Insp. David Vance",
                description="Overpass camera recording showing incident impact zone and subsequent emergency response vehicle arrivals.",
                status="Verified",
                metadata_json={
                    "duration": "00:20:00",
                    "duration_sec": 1200,
                    "resolution": "1920 × 1080 (Full HD)",
                    "fps": 30,
                    "codec": "H.265 / HEVC",
                    "file_size": "32.6 MB",
                    "file_size_bytes": 34183577,
                    "bitrate": "2150 kbps VBR",
                    "color_space": "BT.709 (YUV420p)",
                    "audio_codec": "G.711u",
                    "container": "MPEG-4 ISO",
                    "frame_count": 36000,
                },
                thumbnails_json=[
                    "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400&auto=format&fit=crop&q=80",
                ],
                sample_url="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            ),
        ]
        for ev in evidence_items:
            if not db.query(Evidence).filter(Evidence.evidence_id == ev.evidence_id).first():
                db.add(ev)

        # 5. Chain of Custody
        coc_records = [
            ChainOfCustody(
                custody_id="COC-001",
                record_id="COC-001",
                evidence_id="EVD-001",
                case_id="CASE-2026-001",
                action="Evidence Upload & Storage Ingestion",
                details="Raw camera MP4 file transferred from on-scene NVR USB extraction drive to forensic vault storage.",
                notes="Original bitstream verified with write-blocker.",
                timestamp="2026-09-04 10:20:14",
                user="Insp. David Vance",
                sha256_snapshot="8f43c9b71a2e5d98341602cf189a42be49386d34e9a8f4c281df693b821a719c",
                signature="SIG_HMAC256_8F43C9B71A2E5D98",
            ),
            ChainOfCustody(
                custody_id="COC-002",
                record_id="COC-002",
                evidence_id="EVD-001",
                case_id="CASE-2026-001",
                action="Cryptographic SHA-256 Hash Generated",
                details="Initial baseline cryptographic digest computed and locked in evidence register.",
                notes="Zero-bit deviation baseline established under NIST SP 800-86.",
                timestamp="2026-09-04 10:25:30",
                user="System Automated Integrity Service",
                sha256_snapshot="8f43c9b71a2e5d98341602cf189a42be49386d34e9a8f4c281df693b821a719c",
                signature="SIG_HMAC256_AUTO_HASH256",
            ),
            ChainOfCustody(
                custody_id="COC-003",
                record_id="COC-003",
                evidence_id="EVD-001",
                case_id="CASE-2026-001",
                action="Integrity Verification Passed (MATCH)",
                details="Verification audit executed against live binary storage. Result: MATCH (0-bit deviation).",
                notes="Cryptographic SHA-256 hash matches baseline acquisition digest exactly.",
                timestamp="2026-09-05 09:12:00",
                user="Insp. David Vance",
                sha256_snapshot="8f43c9b71a2e5d98341602cf189a42be49386d34e9a8f4c281df693b821a719c",
                signature="SIG_HMAC256_AUDIT_PASS9918",
            ),
        ]
        for coc in coc_records:
            if not db.query(ChainOfCustody).filter(ChainOfCustody.custody_id == coc.custody_id).first():
                db.add(coc)

        # 6. Analysis Events
        events = [
            AnalysisEvent(
                id="EVT-101",
                evidence_id="EVD-001",
                timestamp_sec=261.0,
                timecode="10:34:21",
                label="Suspect Vehicle Enters Frame",
                category="vehicle",
                confidence=0.94,
                notes="Dark grey sedan traveling southbound at elevated speed, passing green light without braking.",
                bbox=[42, 35, 78, 68],
                human_reviewed=True,
                approved_by="Insp. David Vance",
            ),
            AnalysisEvent(
                id="EVT-102",
                evidence_id="EVD-001",
                timestamp_sec=285.0,
                timecode="10:34:45",
                label="Pedestrian Group Reaction",
                category="person",
                confidence=0.89,
                notes="Three pedestrians on east curb step back abruptly towards building facade.",
                bbox=[30, 15, 65, 32],
                human_reviewed=True,
                approved_by="Insp. David Vance",
            ),
            AnalysisEvent(
                id="EVT-103",
                evidence_id="EVD-001",
                timestamp_sec=420.0,
                timecode="10:37:00",
                label="First Responders Arrive",
                category="vehicle",
                confidence=0.98,
                notes="Patrol unit 402 arrives on scene with emergency siren beacon activated.",
                bbox=[50, 48, 85, 82],
                human_reviewed=True,
                approved_by="Insp. David Vance",
            ),
        ]
        for ev in events:
            if not db.query(AnalysisEvent).filter(AnalysisEvent.id == ev.id).first():
                db.add(ev)

        # 7. Audit Logs
        logs = [
            AuditLog(
                timestamp="2026-09-04 10:20:14",
                user="Insp. David Vance",
                action="Vault Ingestion: EVD-001",
                case_id="CASE-2026-001",
                evidence_id="EVD-001",
                status_code=201,
                details="Ingested raw surveillance file with baseline hash calculated.",
            ),
            AuditLog(
                timestamp="2026-09-05 09:12:00",
                user="Insp. David Vance",
                action="Integrity Verification: EVD-001",
                case_id="CASE-2026-001",
                evidence_id="EVD-001",
                status_code=200,
                details="SHA-256 bitstream audit verified with zero-bit deviation.",
            ),
        ]
        for l in logs:
            db.add(l)

        # 8. Notifications
        notifications = [
            Notification(
                title="Forensic Vault Operational",
                message="All evidence records verified under NIST SP 800-86 cryptographic integrity standards.",
                severity="info",
                created_at="2026-09-05 09:00:00",
                related_link="/evidence",
            ),
        ]
        for n in notifications:
            db.add(n)

        db.commit()
        print("Database successfully seeded with realistic forensic records.")
    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        if close_after:
            db.close()

if __name__ == "__main__":
    seed_database()
