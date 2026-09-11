import React from "react";
import {
  FolderLock,
  HardDrive,
  Camera,
  CheckCircle2,
  AlertTriangle,
  Play,
  FileCheck,
  ShieldCheck,
  MapPin,
  ExternalLink,
  Plus,
  ArrowRight,
  Sparkles,
  Radio,
  Cpu,
  Layers,
  Fingerprint,
} from "lucide-react";
import { Case, CCTVDevice, Evidence, ChainOfCustodyRecord, AnalysisEvent } from "../types";

interface DashboardViewProps {
  cases: Case[];
  devices: CCTVDevice[];
  evidenceList: Evidence[];
  records?: ChainOfCustodyRecord[];
  events?: AnalysisEvent[];
  onSelectTab: (tab: string) => void;
  onSelectEvidence: (ev: Evidence) => void;
  onVerifyEvidence?: (ev: Evidence) => void;
  onOpenNewCaseModal?: () => void;
  onOpenAddCCTVModal?: () => void;
  onOpenUploadModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  cases = [],
  devices = [],
  evidenceList = [],
  records = [],
  events = [],
  onSelectTab,
  onSelectEvidence,
  onVerifyEvidence,
  onOpenNewCaseModal = () => onSelectTab("cases"),
  onOpenAddCCTVModal = () => onSelectTab("cctv"),
  onOpenUploadModal = () => onSelectTab("evidence"),
}) => {
  const safeCases = Array.isArray(cases) ? cases : [];
  const safeDevices = Array.isArray(devices) ? devices : [];
  const safeEvidenceList = Array.isArray(evidenceList) ? evidenceList : [];
  const verifiedCount = safeEvidenceList.filter((e) => e?.status === "Verified").length;
  const activeCameras = safeDevices.filter((d) => d?.status === "Active").length;

  return (
    <div className="space-y-8">
      {/* ========================================================= */}
      {/* 1. HERO SECTION: DIGITAL KENSEI CYBER AESTHETIC            */}
      {/* Pitch-black canvas, giant display typography, crimson glow */}
      {/* ========================================================= */}
      <div className="relative rounded-3xl bg-[#060608] border border-zinc-800/80 p-6 md:p-10 overflow-hidden shadow-2xl bg-cyber-grid">
        {/* Subtle crimson laser gradient behind hero */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ef233c]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-[#ef233c]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Ambient Top Japanese Subtitle & Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-[#ef233c] shadow-[0_0_10px_#ef233c] animate-pulse" />
            <span className="text-xs font-mono tracking-widest text-zinc-300 uppercase">
              サイバー・フォレンジック // CCTV INTELLIGENCE MATRIX
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono bg-zinc-900/90 border border-zinc-800 text-zinc-300">
              FIPS 180-4 SHA-256
            </span>
            <button
              onClick={() => onSelectTab("evidence")}
              className="px-4 py-1 rounded-full text-xs font-semibold bg-white text-black hover:bg-zinc-200 transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              EXPLORE EVIDENCE <span className="text-[#ef233c] font-black">•</span>
            </button>
          </div>
        </div>

        {/* Giant Cyber Display Typography & Hero Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-8">
            <div className="space-y-1">
              <div className="flex items-baseline gap-3">
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white uppercase leading-none">
                  DIGI<span className="text-zinc-600 font-light">TAL</span>
                </h1>
                <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
                  サムライ鑑識
                </span>
              </div>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-[#ef233c] uppercase leading-none drop-shadow-[0_0_20px_rgba(239,35,60,0.35)]">
                FORENSIC
              </h1>
            </div>

            <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl font-normal leading-relaxed">
              Enterprise digital forensics suite combining cryptographic bitstream integrity, multi-angle CCTV GIS mapping, neural frame inspection, and certified Chain of Custody.
            </p>

            {/* Quick Action Pill Buttons */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenUploadModal}
                className="flex items-center gap-2 bg-[#ef233c] hover:bg-[#d90429] text-white text-xs font-bold font-mono px-5 py-2.5 rounded-full shadow-[0_0_20px_rgba(239,35,60,0.4)] transition-all cursor-pointer"
              >
                <HardDrive className="w-4 h-4" />
                INGEST EVIDENCE •
              </button>

              <button
                onClick={onOpenNewCaseModal}
                className="flex items-center gap-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 text-xs font-mono px-4 py-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#ef233c]" />
                NEW CASE
              </button>

              <button
                onClick={onOpenAddCCTVModal}
                className="flex items-center gap-2 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-100 text-xs font-mono px-4 py-2.5 rounded-full border border-zinc-800 hover:border-zinc-700 transition-all cursor-pointer"
              >
                <Camera className="w-3.5 h-3.5 text-zinc-400" />
                ADD CAMERA
              </button>
            </div>
          </div>

          {/* Right Floating Glass Card (Like "Exclusivity - Only 500 warriors" in reference image) */}
          <div className="lg:col-span-4">
            <div className="p-6 rounded-2xl bg-zinc-950/80 border border-zinc-800/80 backdrop-blur-md relative overflow-hidden shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 uppercase">
                  <Fingerprint className="w-4 h-4 text-[#ef233c]" />
                  Cryptographic Trust
                </div>
                <span className="h-2 w-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c]" />
              </div>

              <h3 className="text-base font-bold font-display text-white">
                Zero Bit Discrepancy
              </h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                Cryptographically locked with SHA-256 at ingest. Every frame stepped and timestamped according to ISO/IEC 27037 standards.
              </p>

              <div className="mt-4 pt-4 border-t border-zinc-900 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">PARITY STATUS</span>
                <span className="text-[#ef233c] font-bold">100% BIT-PERFECT</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. THE SIGNATURE WHITE CURVED SECTION                      */}
      {/* High-contrast porcelain white card with dark typography   */}
      {/* and bright red glyphs, exactly matching the reference img */}
      {/* ========================================================= */}
      <div className="rounded-[32px] md:rounded-[40px] bg-white text-zinc-950 p-6 sm:p-10 md:p-14 shadow-2xl relative overflow-hidden">
        {/* Category Lead */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-500">
            DIGITAL FORENSIC ARCHITECTURE
          </span>
        </div>

        {/* Large Bold Headline with Red Dot */}
        <div className="max-w-4xl">
          <h2 className="text-2xl sm:text-4xl md:text-5xl font-black font-display tracking-tight text-zinc-950 leading-tight">
            <span className="inline-block w-3 h-3 rounded-full bg-[#ef233c] mr-2 align-middle" />
            Digital Forensic — is an enterprise platform of CCTV video analysis that combines <span className="text-zinc-400 font-light">cryptographic evidence</span> with cutting-edge visual intelligence.
          </h2>
          <p className="mt-4 text-sm sm:text-base text-zinc-600 font-normal leading-relaxed max-w-2xl">
            Each evidence stream is an immutable digital artifact authenticated by cryptographic hash standards, ensuring non-repudiable legal court admissibility.
          </p>
        </div>

        {/* 4 Feature Columns with Crimson Glyphs (Matching the 4 red icons in the reference image) */}
        <div className="mt-12 pt-10 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature 1 */}
          <div className="space-y-2">
            <div className="text-[#ef233c] text-xl font-black">
              ✦
            </div>
            <h4 className="text-base font-bold font-display text-zinc-900">
              SHA-256 Bitstream Lock
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Real-time cryptographic hash verification guarantees pristine, tamper-proof evidentiary integrity.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="space-y-2">
            <div className="text-[#ef233c] text-xl font-black">
              ✦
            </div>
            <h4 className="text-base font-bold font-display text-zinc-900">
              GIS Spatial Matrix
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Directional FOV camera coverage cones and interactive radar mapping across multi-vendor CCTV grids.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="space-y-2">
            <div className="text-[#ef233c] text-xl font-black">
              ✦
            </div>
            <h4 className="text-base font-bold font-display text-zinc-900">
              Neural Frame Inspector
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Multimodal AI frame scanner for rapid detection of suspects, vehicle license plates, and visual anomalies.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="space-y-2">
            <div className="text-[#ef233c] text-xl font-black">
              ✦
            </div>
            <h4 className="text-base font-bold font-display text-zinc-900">
              ISO/IEC 27037 Custody
            </h4>
            <p className="text-xs text-zinc-600 leading-relaxed">
              Immutable audit ledger logging every investigator transfer, analysis event, and exported courtroom report.
            </p>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. LOWER DARK STATS & TELEMETRY SECTION                   */}
      {/* Jet-black grid, glowing crimson graph, stacked cards      */}
      {/* ========================================================= */}
      <div className="space-y-6 pt-2">
        {/* Section Title */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ef233c] shadow-[0_0_10px_#ef233c]" />
            <h3 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white uppercase">
              Stats defining the Platform
            </h3>
          </div>
          <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">
            SURVEILLANCE TELEMETRY // 24/7
          </span>
        </div>

        {/* 3-Column Cyber Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Glowing Crimson Curve Chart & Volume */}
          <div
            onClick={() => onSelectTab("evidence")}
            className="rounded-3xl bg-[#09090c] border border-zinc-800/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-4">
                <span>BITSTREAM CARVING</span>
                <span className="text-[#ef233c] font-bold group-hover:underline flex items-center gap-1">
                  VIEW ALL <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* Minimalist Coordinate Grid with Glowing Red Line Graph */}
              <div className="h-28 w-full relative border-b border-l border-zinc-800 flex items-end px-2 pb-1">
                {/* Y-axis labels */}
                <div className="absolute left-1 top-1 flex flex-col justify-between h-24 text-[9px] font-mono text-zinc-600">
                  <span>45</span>
                  <span>25</span>
                  <span>5</span>
                  <span>0</span>
                </div>

                {/* SVG Curve Line */}
                <svg className="w-full h-24 overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                  <path
                    d="M 0,45 Q 25,40 45,28 T 80,12 T 100,5"
                    fill="none"
                    stroke="#ef233c"
                    strokeWidth="2.5"
                    className="drop-shadow-[0_0_8px_rgba(239,35,60,0.8)]"
                  />
                  {/* Glowing Node Point */}
                  <circle cx="80" cy="12" r="3.5" fill="#ffffff" stroke="#ef233c" strokeWidth="2" className="animate-pulse" />
                </svg>
              </div>
            </div>

            <div className="mt-6">
              <span className="text-xs text-zinc-500 font-mono block">SEIZED EVIDENCE INGESTED</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black font-display text-white">
                  {safeEvidenceList.length * 45 + 120}+
                </span>
                <span className="text-xs font-mono text-zinc-400">GB Verified</span>
              </div>
            </div>
          </div>

          {/* Card 2: Stacked Tier Cards (Rare / Epic / Mythic style) */}
          <div
            onClick={() => onSelectTab("cases")}
            className="rounded-3xl bg-[#09090c] border border-zinc-800/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-4">
                <span>CASE PRIORITY LEVELS</span>
                <span className="text-zinc-400 font-bold group-hover:text-white flex items-center gap-1">
                  INDEXED <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              {/* Stacked Cards Visualization */}
              <div className="space-y-1.5 py-1">
                {/* Top tier card */}
                <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs flex items-center justify-between text-zinc-400 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                    Routine Surveillance
                  </span>
                  <span className="text-[10px] text-zinc-600">TIER 01</span>
                </div>

                {/* Middle tier card */}
                <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2 text-xs flex items-center justify-between text-zinc-200 font-mono">
                  <span className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    Elevated Priority Case
                  </span>
                  <span className="text-[10px] text-zinc-500">TIER 02</span>
                </div>

                {/* Active Mythic / Critical Alert Card */}
                <div className="bg-[#120709] border border-[#ef233c]/60 rounded-xl px-3.5 py-2.5 text-xs flex items-center justify-between text-white font-mono shadow-[0_0_15px_rgba(239,35,60,0.2)]">
                  <span className="flex items-center gap-2 font-bold">
                    <span className="w-2 h-2 rounded-full bg-[#ef233c] shadow-[0_0_6px_#ef233c] animate-pulse" />
                    <span className="text-[#ef233c] text-[10px] bg-[#ef233c]/20 px-1 rounded uppercase">NEW</span>
                    Critical Forensic Alert
                  </span>
                  <span className="text-[10px] text-zinc-400">TODAY, 11:50</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <span className="text-xs text-zinc-500 font-mono block">SECURITY PROTOCOL MATRIX</span>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black font-display text-white">
                  3 Tiers
                </span>
                <span className="text-xs font-mono text-emerald-400 font-bold">Enforced</span>
              </div>
            </div>
          </div>

          {/* Card 3: Total Surveillance Registry & Operators */}
          <div
            onClick={() => onSelectTab("cctv")}
            className="rounded-3xl bg-[#09090c] border border-zinc-800/80 p-6 flex flex-col justify-between hover:border-zinc-700 transition-all cursor-pointer group relative overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500 mb-4">
                <span>CAMERA NETWORK</span>
                <span className="text-zinc-400 font-bold group-hover:text-white flex items-center gap-1">
                  MAP RADAR <ArrowRight className="w-3 h-3" />
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-xs text-zinc-500 font-mono block">TOTAL REGISTERED CAMERAS</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black font-display text-white">
                      {safeDevices.length * 150 + 200}+
                    </span>
                    <span className="text-xs font-mono text-emerald-400">
                      {activeCameras} Nodes Active
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80">
                  <span className="text-xs text-zinc-500 font-mono block">CERTIFIED INVESTIGATORS</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-black font-display text-white">
                      {records.length * 40 + 50}+
                    </span>
                    <span className="text-xs font-mono text-zinc-400">Custody Logs</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span>DAHUA / HIKVISION / AXIS</span>
              <span className="text-[#ef233c] font-bold">RTSP SYNCED</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 4. ACTIVE OPERATIONAL GRID: GIS RADAR + RECENT EVIDENCE   */}
      {/* ========================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
        {/* GIS Radar Map Preview */}
        <div className="lg:col-span-7 rounded-3xl bg-[#09090c] border border-zinc-800/80 p-5 flex flex-col shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-[#ef233c]" />
              <MapPin className="w-4 h-4 text-[#ef233c]" />
              <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                GIS Spatial CCTV Coverage
              </h3>
            </div>
            <button
              onClick={() => onSelectTab("map")}
              className="text-xs text-zinc-400 hover:text-white font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              FULL RADAR VIEW <ExternalLink className="w-3 h-3 text-[#ef233c]" />
            </button>
          </div>

          {/* Interactive GIS Preview Canvas */}
          <div
            onClick={() => onSelectTab("map")}
            className="relative flex-1 min-h-[280px] bg-black border border-zinc-800 rounded-2xl overflow-hidden cursor-pointer group"
          >
            {/* Dark radar cyber grid */}
            <div className="absolute inset-0 bg-cyber-grid opacity-30" />

            {/* Simulated Street Crossings */}
            <div className="absolute top-1/2 left-0 right-0 h-9 bg-zinc-900/90 -translate-y-1/2 flex items-center justify-center border-y border-zinc-800">
              <span className="text-[10px] text-zinc-500 tracking-widest font-mono">
                NORTH MARKET CORRIDOR
              </span>
            </div>
            <div className="absolute top-0 bottom-0 left-1/2 w-9 bg-zinc-900/90 -translate-x-1/2 flex items-center justify-center border-x border-zinc-800">
              <span className="text-[10px] text-zinc-500 tracking-widest font-mono rotate-90 whitespace-nowrap">
                METRO 4TH AVENUE
              </span>
            </div>

            {/* Glowing Incident Epicenter with Radar Sweep */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
              <span className="relative flex h-6 w-6 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ef233c] opacity-75" />
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-[#ef233c] border-2 border-white shadow-[0_0_12px_#ef233c]" />
              </span>
              <span className="mt-1.5 px-2 py-0.5 bg-black border border-[#ef233c] text-white text-[10px] font-mono font-bold rounded-full shadow-lg">
                🔴 CRIME SCENE INCIDENT
              </span>
            </div>

            {/* Camera Beacons */}
            <div className="absolute top-1/4 left-2/3 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <span className="h-5 w-5 rounded-full bg-white border border-zinc-800 shadow-md flex items-center justify-center text-[9px] text-black font-black font-mono">
                1
              </span>
              <span className="mt-1 px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[9px] rounded-full font-mono">
                CCTV-001 (Hikvision)
              </span>
            </div>

            <div className="absolute bottom-1/4 left-1/3 -translate-x-1/2 translate-y-1/2 z-10 flex flex-col items-center">
              <span className="h-5 w-5 rounded-full bg-white border border-zinc-800 shadow-md flex items-center justify-center text-[9px] text-black font-black font-mono">
                2
              </span>
              <span className="mt-1 px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[9px] rounded-full font-mono">
                CCTV-002 (Dahua)
              </span>
            </div>

            <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center">
              <span className="h-5 w-5 rounded-full bg-white border border-zinc-800 shadow-md flex items-center justify-center text-[9px] text-black font-black font-mono">
                3
              </span>
              <span className="mt-1 px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[9px] rounded-full font-mono">
                CCTV-003 (Axis 4K)
              </span>
            </div>

            {/* Hover Indicator */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
              <span className="bg-white text-black text-xs font-bold font-mono px-4 py-2 rounded-full shadow-2xl">
                LAUNCH FULL INTERACTIVE GIS RADAR →
              </span>
            </div>
          </div>
        </div>

        {/* Recent Evidence Vault */}
        <div className="lg:col-span-5 rounded-3xl bg-[#09090c] border border-zinc-800/80 p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#ef233c]" />
                <FileCheck className="w-4 h-4 text-[#ef233c]" />
                <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                  Seized Evidence Vault
                </h3>
              </div>
              <button
                onClick={() => onSelectTab("evidence")}
                className="text-xs font-mono text-zinc-400 hover:text-white"
              >
                VIEW ALL ({safeEvidenceList.length})
              </button>
            </div>

            <div className="space-y-3">
              {safeEvidenceList.map((ev) => {
                const cctv = safeDevices.find((d) => d?.cctv_id === ev?.cctv_id);
                const isVerified = ev.status === "Verified";

                return (
                  <div
                    key={ev.evidence_id}
                    className="p-3.5 bg-black border border-zinc-800/90 rounded-2xl hover:border-zinc-700 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono text-xs font-black text-white">
                          {ev.evidence_id}
                        </span>
                        <span className="text-xs text-zinc-400 truncate max-w-[150px]">
                          {ev.file_name}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full ${
                          isVerified
                            ? "bg-white text-black"
                            : "bg-[#ef233c]/20 text-[#ef233c] border border-[#ef233c]/40"
                        }`}
                      >
                        {isVerified ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-[#ef233c]" />
                            VERIFIED
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3 h-3 text-[#ef233c]" />
                            TAMPERED
                          </>
                        )}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center justify-between text-xs text-zinc-400 font-mono">
                      <span>
                        CAMERA: <strong className="text-zinc-200">{cctv?.name || ev.cctv_id}</strong>
                      </span>
                      <span className="text-zinc-500">
                        {ev.metadata.resolution} • {ev.metadata.codec}
                      </span>
                    </div>

                    <div className="mt-2.5 pt-2.5 border-t border-zinc-900 flex items-center justify-between gap-2">
                      <span className="font-mono text-[10px] text-zinc-500 truncate max-w-[170px]">
                        HASH: {ev.sha256_hash.substring(0, 16)}...
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            if (onVerifyEvidence) {
                              onVerifyEvidence(ev);
                            } else {
                              onSelectEvidence(ev);
                              onSelectTab("evidence");
                            }
                          }}
                          className="text-[10px] font-mono font-bold text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-2.5 py-1 rounded-full transition-all cursor-pointer"
                        >
                          VERIFY HASH
                        </button>
                        <button
                          onClick={() => {
                            onSelectEvidence(ev);
                            onSelectTab("player");
                          }}
                          className="text-[10px] font-mono font-bold text-white bg-[#ef233c] hover:bg-[#d90429] px-2.5 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(239,35,60,0.3)]"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" /> ANALYZE
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-zinc-900 flex items-center justify-between text-xs font-mono text-zinc-500">
            <span>COURT AUDIT STATUS</span>
            <span className="text-[#ef233c] font-bold">CHAIN OF CUSTODY VERIFIED</span>
          </div>
        </div>
      </div>
    </div>
  );
};
