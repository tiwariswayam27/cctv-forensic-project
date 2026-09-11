import React, { useState } from "react";
import {
  MapPin,
  Camera,
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  Radio,
  ExternalLink,
  ShieldCheck,
  Search,
} from "lucide-react";
import { CCTVDevice, Case } from "../types";

interface GISMapViewProps {
  devices: CCTVDevice[];
  cases: Case[];
  activeCaseId: string;
  focusedDevice?: CCTVDevice | null;
  onSelectCamera: (device: CCTVDevice) => void;
  onSelectTab: (tab: string) => void;
}

export const GISMapView: React.FC<GISMapViewProps> = ({
  devices = [],
  cases = [],
  activeCaseId,
  focusedDevice,
  onSelectCamera,
  onSelectTab,
}) => {
  const safeDevices = Array.isArray(devices) ? devices : [];
  const safeCases = Array.isArray(cases) ? cases : [];

  const [selectedDevice, setSelectedDevice] = useState<CCTVDevice | null>(
    focusedDevice || safeDevices[0] || null
  );
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mapMode, setMapMode] = useState<"tactical" | "satellite" | "grid">("tactical");
  const [showFovCones, setShowFovCones] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const activeCase = safeCases.find((c) => c?.case_id === activeCaseId) || safeCases[0];

  // Base map center around incident location
  const centerLat = activeCase ? activeCase.incident_lat : 40.7128;
  const centerLng = activeCase ? activeCase.incident_lng : -74.006;

  // Conversion from lat/lng to percentage on canvas (normalized around centerLat/centerLng)
  const getCoordinatesPct = (lat: number, lng: number) => {
    // scale factor for approx 500m area
    const deltaLat = (lat - centerLat) * 35000;
    const deltaLng = (lng - centerLng) * 35000;

    const x = Math.max(8, Math.min(92, 50 + deltaLng));
    const y = Math.max(8, Math.min(92, 50 - deltaLat));
    return { x, y };
  };

  const incidentCoords = getCoordinatesPct(centerLat, centerLng);

  const filteredDevices = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.cctv_id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-4 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-white tracking-tight">
              GIS Forensic Spatial Map & CCTV Interceptor
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Surveillance density around incident site: {activeCase?.incident_location || "Market Road"}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Layer Mode */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs text-slate-300">
            <button
              onClick={() => setMapMode("tactical")}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                mapMode === "tactical" ? "bg-emerald-600 text-white" : "hover:text-white"
              }`}
            >
              Tactical Dark
            </button>
            <button
              onClick={() => setMapMode("satellite")}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                mapMode === "satellite" ? "bg-emerald-600 text-white" : "hover:text-white"
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setMapMode("grid")}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                mapMode === "grid" ? "bg-emerald-600 text-white" : "hover:text-white"
              }`}
            >
              Cartographic Grid
            </button>
          </div>

          {/* Toggle FOV Cones */}
          <button
            onClick={() => setShowFovCones(!showFovCones)}
            className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-colors flex items-center gap-1 ${
              showFovCones
                ? "bg-slate-800 border-emerald-500/50 text-emerald-300"
                : "bg-slate-950 border-slate-800 text-slate-400"
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            FOV Cones {showFovCones ? "ON" : "OFF"}
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setZoomLevel(Math.min(zoomLevel + 0.25, 2))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom In"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(Math.max(zoomLevel - 0.25, 0.75))}
              className="p-1 text-slate-400 hover:text-white"
              title="Zoom Out"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
            <button
              onClick={() => setZoomLevel(1)}
              className="p-1 text-slate-400 hover:text-white"
              title="Reset Zoom"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Map + Side Inspector Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Spatial Map Canvas */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden relative min-h-[500px] flex flex-col shadow-inner">
          {/* Map Surface */}
          <div
            className="relative w-full h-[520px] overflow-hidden select-none"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center center",
              transition: "transform 0.2s ease-out",
              backgroundColor: mapMode === "satellite" ? "#0b1324" : "#020617",
            }}
          >
            {/* Grid Lines */}
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  mapMode === "grid"
                    ? "linear-gradient(to right, #1e293b 1px, transparent 1px), linear-gradient(to bottom, #1e293b 1px, transparent 1px)"
                    : "linear-gradient(to right, #0f172a 1px, transparent 1px), linear-gradient(to bottom, #0f172a 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />

            {/* Simulated Street Corridors */}
            {/* Market Road (East-West) */}
            <div className="absolute top-1/2 left-0 right-0 h-14 bg-slate-900/90 -translate-y-1/2 border-y border-slate-700/60 flex items-center justify-around px-8">
              <div className="border-t border-dashed border-amber-500/50 w-full" />
              <span className="absolute left-8 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest pointer-events-none">
                MARKET ROAD (EAST-WEST CORRIDOR)
              </span>
            </div>

            {/* 4th Avenue (North-South) */}
            <div className="absolute top-0 bottom-0 left-1/2 w-14 bg-slate-900/90 -translate-x-1/2 border-x border-slate-700/60 flex flex-col justify-around py-8">
              <div className="border-l border-dashed border-amber-500/50 h-full mx-auto" />
              <span className="absolute top-12 left-1/2 -translate-x-1/2 text-[11px] font-mono font-bold text-slate-400 uppercase tracking-widest rotate-90 whitespace-nowrap pointer-events-none">
                4TH AVENUE CROSSING
              </span>
            </div>

            {/* Incident Location Marker (🔴 Incident Location) */}
            <div
              className="absolute z-30 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform hover:scale-110"
              style={{ left: `${incidentCoords.x}%`, top: `${incidentCoords.y}%` }}
            >
              <div className="relative flex h-8 w-8 items-center justify-center">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-500 opacity-60" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-600 border-2 border-white shadow-lg" />
              </div>
              <div className="mt-1 px-2 py-0.5 bg-rose-950/95 border border-rose-600 text-rose-200 text-[10px] font-bold rounded-md shadow-xl whitespace-nowrap flex items-center gap-1">
                <span>🔴 Incident Location</span>
              </div>
              <span className="text-[9px] font-mono text-slate-400 bg-slate-950/80 px-1 rounded mt-0.5">
                {activeCase.case_number}
              </span>
            </div>

            {/* CCTV Camera Markers */}
            {filteredDevices.map((device, idx) => {
              const coords = getCoordinatesPct(device.latitude, device.longitude);
              const isSelected = selectedDevice?.cctv_id === device.cctv_id;
              const isActive = device.status === "Active";

              return (
                <div
                  key={device.cctv_id}
                  className="absolute z-20 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all"
                  style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                  onClick={() => {
                    setSelectedDevice(device);
                    onSelectCamera(device);
                  }}
                >
                  {/* FOV Directional Cone */}
                  {showFovCones && (
                    <div
                      className="absolute pointer-events-none opacity-40 transition-opacity"
                      style={{
                        width: "120px",
                        height: "120px",
                        top: "-50px",
                        left: "-50px",
                        transform: `rotate(${device.direction}deg)`,
                      }}
                    >
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        <path
                          d="M 50 50 L 25 10 A 55 55 0 0 1 75 10 Z"
                          fill={isActive ? "#10b981" : "#f59e0b"}
                          opacity="0.35"
                          stroke={isActive ? "#10b981" : "#f59e0b"}
                          strokeWidth="1"
                          strokeDasharray="2,2"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Marker Node */}
                  <div
                    className={`h-6 w-6 rounded-full flex items-center justify-center font-bold text-[10px] shadow-lg transition-transform ${
                      isSelected
                        ? "ring-4 ring-cyan-400/50 scale-125"
                        : "hover:scale-110"
                    } ${
                      isActive
                        ? "bg-emerald-500 text-slate-950 border-2 border-white"
                        : "bg-amber-500 text-slate-950 border-2 border-slate-900"
                    }`}
                  >
                    {idx + 1}
                  </div>

                  {/* Label Pill */}
                  <div
                    className={`mt-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold shadow-md whitespace-nowrap transition-colors ${
                      isSelected
                        ? "bg-cyan-500 text-slate-950 border border-white font-bold"
                        : isActive
                        ? "bg-slate-900/90 text-emerald-300 border border-emerald-500/40"
                        : "bg-slate-900/90 text-amber-300 border border-amber-500/40"
                    }`}
                  >
                    {isActive ? "🟢" : "🟡"} {device.cctv_id}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Compass & Scale Overlay */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 border border-slate-800 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-slate-300 flex items-center gap-2 backdrop-blur-xs">
            <span className="font-bold text-emerald-400">N ↑</span>
            <span>Scale: 1:500 (approx. 50m)</span>
            <span className="text-slate-500">|</span>
            <span>GPS WGS84</span>
          </div>

          {/* Legend Overlay */}
          <div className="absolute bottom-3 right-3 bg-slate-900/90 border border-slate-800 px-3 py-2 rounded-lg text-xs text-slate-300 flex items-center gap-3 backdrop-blur-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span className="text-[11px]">Active Camera</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
              <span className="text-[11px]">Maintenance</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
              <span className="text-[11px]">Incident Site</span>
            </div>
          </div>
        </div>

        {/* Side Inspector: Clicked Camera Details */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold text-white">Camera Spatial Inspector</h3>
              </div>
              {selectedDevice && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    selectedDevice.status === "Active"
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                  }`}
                >
                  {selectedDevice.status}
                </span>
              )}
            </div>

            {selectedDevice ? (
              <div className="space-y-3.5 text-xs text-slate-300">
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                  <div className="font-mono text-cyan-400 text-sm font-bold">
                    {selectedDevice.cctv_id}
                  </div>
                  <div className="text-white font-medium text-xs mt-0.5">
                    {selectedDevice.name}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {selectedDevice.location}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300">
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Vendor & Model
                    </span>
                    <strong className="text-slate-200 block text-xs">{selectedDevice.vendor}</strong>
                    <span className="text-[10px] text-slate-400 truncate block">
                      {selectedDevice.model}
                    </span>
                  </div>
                  <div className="bg-slate-950 p-2.5 rounded border border-slate-800">
                    <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                      Channel / IP
                    </span>
                    <strong className="text-slate-200 block text-xs">
                      Ch {selectedDevice.channel}
                    </strong>
                    <span className="font-mono text-[10px] text-slate-400 block">
                      {selectedDevice.ip_address}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-800 space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-400">GPS Coordinates:</span>
                    <span className="font-mono text-slate-200">
                      {selectedDevice.latitude.toFixed(4)}°N, {selectedDevice.longitude.toFixed(4)}°W
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Field of View Heading:</span>
                    <span className="font-mono text-slate-200">
                      {selectedDevice.direction}° (Radius {selectedDevice.coverage_radius}m)
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Estimated Line-of-Sight:</span>
                    <span className="text-emerald-400 font-medium">Unobstructed</span>
                  </div>
                </div>

                <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg text-[11px] text-emerald-300">
                  <span className="font-semibold block mb-0.5">Forensic Spatial Context:</span>
                  This camera covers the primary eastbound traffic lane and sidewalk directly leading from the incident location at Market Road.
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-500 text-xs">
                Click any camera marker on the map to inspect specifications and coverage.
              </div>
            )}
          </div>

          {selectedDevice && (
            <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col gap-2">
              <button
                onClick={() => onSelectTab("evidence")}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              >
                Ingest Evidence from {selectedDevice.cctv_id}
              </button>
              <button
                onClick={() => onSelectTab("player")}
                className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2 rounded-lg border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
              >
                Open Video Analysis Room
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
