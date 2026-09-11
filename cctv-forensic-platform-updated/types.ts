export interface User {
  id: string;
  email?: string;
  name: string;
  badgeNumber: string;
  role: string;
  agency: string;
  avatar: string;
  is_active?: boolean;
}

export interface Case {
  case_id: string;
  case_number: string;
  case_name: string;
  description: string;
  created_at: string;
  investigator: string;
  status: "Active" | "Under Review" | "Closed";
  priority: "High" | "Medium" | "Urgent";
  incident_location: string;
  incident_lat: number;
  incident_lng: number;
}

export interface CCTVDevice {
  cctv_id: string;
  name: string;
  vendor: string;
  model: string;
  location: string;
  latitude: number;
  longitude: number;
  ip_address: string;
  channel: number;
  status: "Active" | "Offline" | "Maintenance";
  direction: number;
  coverage_radius: number;
}

export interface EvidenceMetadata {
  duration: string;
  duration_sec: number;
  resolution: string;
  fps: number;
  codec: string;
  file_size: string;
  file_size_bytes: number;
  bitrate: string;
  color_space: string;
  audio_codec: string;
  container: string;
  frame_count: number;
}

export interface Evidence {
  evidence_id: string;
  case_id: string;
  cctv_id: string;
  file_name: string;
  file_path: string;
  file_size: string;
  file_size_bytes: number;
  sha256_hash: string;
  current_hash: string;
  acquired_at: string;
  acquired_by: string;
  description: string;
  status: "Verified" | "Tampered" | "Pending";
  metadata: EvidenceMetadata;
  thumbnails: string[];
  sample_url?: string;
}

export interface ChainOfCustodyRecord {
  record_id: string;
  custody_id?: string;
  evidence_id: string;
  case_id: string;
  action: string;
  notes: string;
  details?: string;
  timestamp: string;
  user: string;
  sha256_snapshot?: string;
  signature?: string;
}

export type ChainOfCustodyEntry = ChainOfCustodyRecord;

export interface AnalysisEvent {
  id: string;
  evidence_id: string;
  timestamp_sec: number;
  timecode: string;
  label: string;
  category: "vehicle" | "person" | "anomaly" | "license_plate" | "motion";
  confidence: number;
  notes: string;
  bbox?: [number, number, number, number]; // [ymin, xmin, ymax, xmax] in percentages 0-100
  human_reviewed?: boolean;
  approved_by?: string;
}

export interface AIDetectionResult {
  id: string;
  timecode: string;
  label: string;
  category: "vehicle" | "person" | "anomaly" | "license_plate" | "motion";
  confidence: number;
  description: string;
  notes?: string;
  bbox?: [number, number, number, number];
  human_reviewed?: boolean;
  approved_by?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  severity: "info" | "warning" | "critical";
  is_read: boolean;
  created_at: string;
  related_link?: string;
}

export interface ReconstructedFile {
  file_name: string;
  cluster_range: string;
  size: string;
  duration: string;
  sha256: string;
  integrity: string;
}

export interface RecoveryJob {
  job_id: string;
  disk_image_name: string;
  file_system: string;
  status: string;
  found_fragments: number;
  reconstructed_files: ReconstructedFile[];
}

export interface RecoveryResult {
  session_id: string;
  source_name: string;
  status: "completed" | "analyzing" | "partial";
  total_sectors_scanned: number;
  corrupt_blocks_detected: number;
  gop_headers_identified: number;
  reconstructed_stream_pct: number;
  recoverable_clips: {
    clip_id: string;
    codec: string;
    estimated_duration: string;
    timestamp_range: string;
    carved_size: string;
    integrity_score: number;
  }[];
  forensic_notes: string[];
}
