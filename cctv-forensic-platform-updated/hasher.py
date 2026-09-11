import hashlib
from pathlib import Path
from typing import Tuple, BinaryIO

CHUNK_SIZE = 64 * 1024 # 64 KB

def calculate_sha256_file(file_path: Path) -> str:
    """Computes full NIST FIPS 180-4 SHA-256 cryptographic digest of a file on disk."""
    hasher = hashlib.sha256()
    with open(file_path, "rb") as f:
        while chunk := f.read(CHUNK_SIZE):
            hasher.update(chunk)
    return hasher.hexdigest()

def calculate_sha256_stream(stream: BinaryIO) -> Tuple[str, int]:
    """Computes SHA-256 digest and total byte count from a stream."""
    hasher = hashlib.sha256()
    total_bytes = 0
    while chunk := stream.read(CHUNK_SIZE):
        hasher.update(chunk)
        total_bytes += len(chunk)
    stream.seek(0)
    return hasher.hexdigest(), total_bytes

def verify_evidence_integrity(file_path: Path, baseline_hash: str) -> Tuple[bool, str]:
    """
    Recomputes live SHA-256 hash from physical vault storage and checks against baseline hash.
    Returns (is_match, current_hash).
    """
    if not file_path.exists():
        return False, "FILE_NOT_FOUND"
    
    current_hash = calculate_sha256_file(file_path)
    is_match = (current_hash.lower() == baseline_hash.lower())
    return is_match, current_hash
