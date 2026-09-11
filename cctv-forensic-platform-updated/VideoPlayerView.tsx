import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  ZoomIn,
  ZoomOut,
  Camera,
  BookmarkPlus,
  Clock,
  Sparkles,
  Maximize2,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { Evidence, AnalysisEvent, CCTVDevice } from "../types";

interface VideoPlayerViewProps {
  evidence: Evidence | null;
  evidenceList: Evidence[];
  devices: CCTVDevice[];
  events: AnalysisEvent[];
  onSelectEvidence: (ev: Evidence) => void;
  onAddEvent: (newEvent: Partial<AnalysisEvent>) => Promise<void>;
  onOpenAIInspector: (frameData: string, timecode: string) => void;
}

export const VideoPlayerView: React.FC<VideoPlayerViewProps> = ({
  evidence,
  evidenceList = [],
  devices = [],
  events = [],
  onSelectEvidence,
  onAddEvent,
  onOpenAIInspector,
}) => {
  const safeEvidenceList = Array.isArray(evidenceList) ? evidenceList : [];
  const safeDevices = Array.isArray(devices) ? devices : [];
  const safeEvents = Array.isArray(events) ? events : [];

  const currentEvidence = evidence || safeEvidenceList[0] || null;
  const videoRef = useRef<HTMLVideoElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(60);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isMuted, setIsMuted] = useState(true);
  const [showOverlays, setShowOverlays] = useState(true);

  // New Event Bookmark form state
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventLabel, setEventLabel] = useState("");
  const [eventCategory, setEventCategory] = useState<"vehicle" | "person" | "anomaly" | "license_plate" | "motion">("vehicle");
  const [eventNotes, setEventNotes] = useState("");

  const fps = currentEvidence?.metadata?.fps || 25;
  const frameDuration = 1 / fps; // 0.04s for 25 FPS

  const originatingCamera = safeDevices.find((d) => d?.cctv_id === currentEvidence?.cctv_id);

  // Synchronize video timeline
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => setCurrentTime(video.currentTime);
    const handleLoadedMetadata = () => {
      setDuration(video.duration || currentEvidence?.metadata?.duration_sec || 60);
    };
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("ended", handleEnded);
    };
  }, [currentEvidence]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const stepFrame = (forward: boolean) => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setIsPlaying(false);
    const newTime = forward
      ? Math.min(duration, currentTime + frameDuration)
      : Math.max(0, currentTime - frameDuration);
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const jumpToSeconds = (sec: number) => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = sec;
    setCurrentTime(sec);
  };

  const changeSpeed = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  // Convert seconds into strict SMPTE Timecode (HH:MM:SS:FF)
  const formatTimecode = (sec: number) => {
    const totalFrames = Math.floor(sec * fps);
    const frames = totalFrames % fps;
    const totalSeconds = Math.floor(sec);
    const s = totalSeconds % 60;
    const m = Math.floor(totalSeconds / 60) % 60;
    const h = Math.floor(totalSeconds / 3600);

    const pad = (n: number) => n.toString().padStart(2, "0");
    return {
      clock: `${pad(h)}:${pad(m)}:${pad(s)}`,
      frames: pad(frames),
      fullTimecode: `${pad(h)}:${pad(m)}:${pad(s)}:${pad(frames)}`,
      frameNumber: totalFrames,
    };
  };

  const timecodeInfo = formatTimecode(currentTime);

  const captureCurrentFrame = (): string => {
    const video = videoRef.current;
    if (!video) return "";
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    // Render Forensic Watermark onto snapshot
    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px 'JetBrains Mono', monospace";
    ctx.fillText(`CCTV: ${currentEvidence?.cctv_id || "CAM-01"}`, 20, canvas.height - 15);
    ctx.fillText(`TC: ${timecodeInfo.fullTimecode}`, 240, canvas.height - 15);
    ctx.fillStyle = "#ef233c";
    ctx.fillText(`SHA-256: ${currentEvidence?.sha256_hash.substring(0, 24)}...`, 480, canvas.height - 15);

    return canvas.toDataURL("image/jpeg", 0.95);
  };

  const handleDownloadSnapshot = () => {
    const dataUrl = captureCurrentFrame();
    if (!dataUrl) return;

    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `CCTV_SNAPSHOT_${currentEvidence?.evidence_id}_${timecodeInfo.clock.replace(/:/g, "")}.jpg`;
    a.click();
  };

  const handleAnalyzeWithAI = () => {
    const dataUrl = captureCurrentFrame();
    onOpenAIInspector(dataUrl, timecodeInfo.clock);
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventLabel.trim()) return;

    await onAddEvent({
      evidence_id: currentEvidence?.evidence_id,
      timestamp_sec: Math.round(currentTime),
      timecode: timecodeInfo.clock,
      label: eventLabel,
      category: eventCategory,
      notes: eventNotes || `Marked frame at ${timecodeInfo.fullTimecode}.`,
      confidence: 0.95,
      bbox: [35, 30, 75, 70],
    });

    setEventLabel("");
    setEventNotes("");
    setShowEventModal(false);
  };

  const currentTimelineEvents = safeEvents.filter((ev) => ev?.evidence_id === currentEvidence?.evidence_id);

  // Check if an event matches near current time
  const activeEventNear = currentTimelineEvents.find(
    (ev) => Math.abs((ev?.timestamp_sec ?? 0) - currentTime) < 3
  );

  return (
    <div className="space-y-4">
      {/* Top Header & Evidence Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#060608] border border-zinc-800/80 p-4 rounded-3xl">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#ef233c] shadow-inner">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black font-display text-white tracking-tight uppercase">
                Forensic Video Player & Frame Stepper
              </h2>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-[#ef233c] border border-zinc-800 font-bold">
                {fps} FPS
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-mono">
              Source: {originatingCamera?.name || currentEvidence?.cctv_id || "Camera feed"} ({currentEvidence?.metadata?.resolution || "1080p"})
            </p>
          </div>
        </div>

        {/* Evidence Switcher */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-400 font-mono">ACTIVE CLIP:</span>
          <select
            value={currentEvidence?.evidence_id}
            onChange={(e) => {
              const selected = safeEvidenceList.find((ev) => ev?.evidence_id === e.target.value);
              if (selected) onSelectEvidence(selected);
            }}
            className="bg-zinc-950 border border-zinc-800 rounded-full px-3 py-1.5 text-xs text-zinc-200 font-mono focus:border-[#ef233c] focus:outline-none cursor-pointer"
          >
            {safeEvidenceList.map((ev) => (
              <option key={ev.evidence_id} value={ev.evidence_id} className="bg-zinc-950 text-white">
                {ev.evidence_id} - {ev.file_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Video Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-9 bg-black border border-zinc-800/80 rounded-3xl overflow-hidden flex flex-col shadow-2xl">
          {/* Video Display Viewport */}
          <div className="relative aspect-video w-full bg-[#030304] overflow-hidden flex items-center justify-center select-none">
            <video
              ref={videoRef}
              src={currentEvidence?.sample_url || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"}
              muted={isMuted}
              playsInline
              className="max-h-full max-w-full object-contain transition-transform"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "center center",
              }}
            />

            {/* OSD (On-Screen Display) Watermark Header */}
            <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md border border-zinc-800 px-3 py-1.5 rounded-full text-xs font-mono text-white flex items-center gap-3 shadow-lg">
              <span className="font-bold flex items-center gap-1.5 text-[#ef233c]">
                <span className="h-2 w-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c] animate-pulse" />
                CAM: {currentEvidence?.cctv_id}
              </span>
              <span className="text-zinc-700">|</span>
              <span className="text-white font-bold">{timecodeInfo.clock}</span>
              <span className="text-zinc-700">|</span>
              <span className="text-zinc-400">FRM: #{timecodeInfo.frameNumber}</span>
            </div>

            {/* Active Anomaly / AI Bounding Box Overlay */}
            {showOverlays && activeEventNear?.bbox && (
              <div
                className="absolute border-2 border-[#ef233c] bg-[#ef233c]/15 pointer-events-none rounded transition-all shadow-[0_0_15px_rgba(239,35,60,0.5)]"
                style={{
                  top: `${activeEventNear.bbox[0]}%`,
                  left: `${activeEventNear.bbox[1]}%`,
                  height: `${activeEventNear.bbox[2] - activeEventNear.bbox[0]}%`,
                  width: `${activeEventNear.bbox[3] - activeEventNear.bbox[1]}%`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-[#ef233c] text-white font-bold font-mono text-[10px] px-2 py-0.5 rounded-full shadow">
                  {activeEventNear.label} ({(activeEventNear.confidence * 100).toFixed(0)}%)
                </div>
              </div>
            )}

            {/* Frame Watermark Stamp */}
            <div className="absolute bottom-3 right-3 bg-black/85 px-3 py-1 rounded-full text-[10px] font-mono text-zinc-400 border border-zinc-800">
              SHA-256: {currentEvidence?.sha256_hash.substring(0, 16)}...
            </div>
          </div>

          {/* Forensic Scrubber & Interactive Timeline */}
          <div className="p-4 bg-[#08080a] border-t border-zinc-900 space-y-3">
            {/* Timeline Bar with Event Markers */}
            <div className="relative">
              {/* Event Marker Pins */}
              <div className="absolute -top-3 left-0 right-0 h-3 pointer-events-none z-10">
                {currentTimelineEvents.map((evt) => {
                  const pct = Math.min(100, Math.max(0, (evt.timestamp_sec / duration) * 100));
                  return (
                    <div
                      key={evt.id}
                      className="absolute -translate-x-1/2 cursor-pointer pointer-events-auto group"
                      style={{ left: `${pct}%` }}
                      onClick={() => jumpToSeconds(evt.timestamp_sec)}
                    >
                      <div className="h-3 w-3 rounded-full bg-[#ef233c] border-2 border-black shadow-[0_0_8px_#ef233c] transition-transform group-hover:scale-150" />
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 hidden group-hover:block bg-black border border-[#ef233c] text-white text-[10px] px-2 py-0.5 rounded-full shadow-lg whitespace-nowrap font-mono">
                        {evt.timecode} - {evt.label}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Range Slider with Crimson accent */}
              <input
                type="range"
                min={0}
                max={duration || 100}
                step={frameDuration}
                value={currentTime}
                onChange={(e) => jumpToSeconds(parseFloat(e.target.value))}
                className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-[#ef233c]"
              />
            </div>

            {/* Playback Controls & Frame-by-Frame Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
              {/* Play / Frame Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => stepFrame(false)}
                  className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 px-3 py-1.5 rounded-full transition-colors font-mono cursor-pointer"
                  title="Step 1 Frame Back (0.04s)"
                >
                  <SkipBack className="w-3.5 h-3.5 text-[#ef233c]" />
                  <span>PREV FRAME</span>
                </button>

                <button
                  onClick={togglePlay}
                  className="flex items-center justify-center h-8 w-8 bg-white hover:bg-zinc-200 text-black rounded-full shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                </button>

                <button
                  onClick={() => stepFrame(true)}
                  className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 px-3 py-1.5 rounded-full transition-colors font-mono cursor-pointer"
                  title="Step 1 Frame Forward (0.04s)"
                >
                  <span>NEXT FRAME</span>
                  <SkipForward className="w-3.5 h-3.5 text-[#ef233c]" />
                </button>

                <button
                  onClick={() => jumpToSeconds(0)}
                  className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-full transition-colors cursor-pointer border border-zinc-800"
                  title="Reset to 00:00"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Exact Timecode Readout */}
              <div className="bg-black border border-zinc-800 px-3 py-1 rounded-full font-mono text-white font-bold text-xs flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-[#ef233c]" />
                <span>{timecodeInfo.fullTimecode}</span>
                <span className="text-zinc-700">|</span>
                <span className="text-[#ef233c]">FRM #{timecodeInfo.frameNumber}</span>
              </div>

              {/* Speed & Zoom & Tools */}
              <div className="flex items-center gap-2">
                {/* Speed selector */}
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-full p-0.5 text-[11px] font-mono">
                  {[0.25, 0.5, 1, 2].map((s) => (
                    <button
                      key={s}
                      onClick={() => changeSpeed(s)}
                      className={`px-2 py-0.5 rounded-full transition-colors cursor-pointer ${
                        playbackSpeed === s ? "bg-[#ef233c] text-white font-bold" : "text-zinc-400 hover:text-white"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>

                {/* Digital Zoom */}
                <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-full p-0.5">
                  <button
                    onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))}
                    className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] font-mono px-1 text-zinc-300">{zoomLevel}x</span>
                  <button
                    onClick={() => setZoomLevel(Math.min(3, zoomLevel + 0.5))}
                    className="p-1 text-zinc-400 hover:text-white cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Snapshot Frame */}
                <button
                  onClick={handleDownloadSnapshot}
                  className="flex items-center gap-1 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 px-3 py-1.5 rounded-full transition-colors font-mono cursor-pointer"
                  title="Capture High-Res Watermarked Frame"
                >
                  <Camera className="w-3.5 h-3.5 text-zinc-400" />
                  <span>SNAPSHOT</span>
                </button>

                {/* AI Inspector Button */}
                <button
                  onClick={handleAnalyzeWithAI}
                  className="flex items-center gap-1.5 bg-[#ef233c] hover:bg-[#d90429] text-white font-bold font-mono px-3.5 py-1.5 rounded-full transition-all shadow-[0_0_12px_rgba(239,35,60,0.4)] cursor-pointer"
                  title="Examine Current Frame with Gemini AI"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI INSPECT •</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline Events & Forensic Annotations */}
        <div className="lg:col-span-3 bg-[#060608] border border-zinc-800/80 rounded-3xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3">
              <div>
                <h3 className="text-xs font-bold font-display text-white uppercase tracking-wider">
                  Timeline Bookmarks
                </h3>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {currentTimelineEvents.length} marked events
                </span>
              </div>
              <button
                onClick={() => setShowEventModal(true)}
                className="flex items-center gap-1 bg-white hover:bg-zinc-200 text-black text-[11px] font-bold px-3 py-1 rounded-full transition-colors cursor-pointer"
              >
                <BookmarkPlus className="w-3 h-3 text-[#ef233c]" />
                ADD PIN
              </button>
            </div>

            {/* Events List */}
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {currentTimelineEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => jumpToSeconds(evt.timestamp_sec)}
                  className="p-3 bg-black border border-zinc-800 hover:border-[#ef233c]/60 rounded-2xl cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-white text-xs font-bold flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-[#ef233c]" />
                      {evt.timecode}
                    </span>
                    <span className="text-[9px] uppercase font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-300">
                      {evt.category}
                    </span>
                  </div>
                  <div className="font-bold text-white text-xs mt-1.5 group-hover:text-[#ef233c] transition-colors">
                    {evt.label}
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-0.5 line-clamp-2">
                    {evt.notes}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Jump to Target Moment (10:34:21) */}
          <div className="mt-4 pt-3 border-t border-zinc-800/80">
            <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-mono mb-1.5">
              CRITICAL TIMELINE MOMENT
            </div>
            <button
              onClick={() => jumpToSeconds(261)}
              className="w-full bg-black hover:bg-zinc-900 border border-zinc-800 hover:border-[#ef233c]/50 text-left p-2.5 rounded-2xl text-xs transition-all flex items-center justify-between cursor-pointer group"
            >
              <div>
                <span className="font-mono text-[#ef233c] font-bold">10:34:21</span>
                <span className="text-zinc-200 block text-[11px]">Suspect vehicle enters intersection</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 group-hover:text-white">JUMP →</span>
            </button>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09090c] border border-zinc-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                Pin Forensic Timeline Marker
              </h3>
              <button
                onClick={() => setShowEventModal(false)}
                className="text-zinc-500 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
              <div className="bg-black p-2.5 rounded-xl border border-zinc-800 font-mono text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ef233c]" />
                Timestamp: {timecodeInfo.clock} (Frame #{timecodeInfo.frameNumber})
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1 font-mono text-[11px]">EVENT LABEL *</label>
                <input
                  type="text"
                  placeholder="e.g., Suspect Vehicle Passes Traffic Light"
                  value={eventLabel}
                  onChange={(e) => setEventLabel(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:border-[#ef233c] focus:outline-none font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1 font-mono text-[11px]">CLASSIFICATION CATEGORY</label>
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value as any)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:border-[#ef233c] focus:outline-none cursor-pointer"
                >
                  <option value="vehicle">Vehicle Event</option>
                  <option value="person">Person / Pedestrian</option>
                  <option value="license_plate">License Plate Read</option>
                  <option value="anomaly">Suspicious Anomaly</option>
                  <option value="motion">Kinetic Motion</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1 font-mono text-[11px]">FORENSIC NOTES</label>
                <textarea
                  rows={3}
                  placeholder="Visual details, make/model, trajectory, speed estimate..."
                  value={eventNotes}
                  onChange={(e) => setEventNotes(e.target.value)}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-zinc-200 focus:border-[#ef233c] focus:outline-none font-sans"
                />
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-full transition-colors font-mono cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#ef233c] hover:bg-[#d90429] text-white rounded-full transition-all font-mono font-bold shadow-[0_0_12px_rgba(239,35,60,0.4)] cursor-pointer"
                >
                  SAVE MARKER & LOG •
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
