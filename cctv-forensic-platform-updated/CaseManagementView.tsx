import React, { useState } from "react";
import {
  FolderLock,
  Plus,
  UserCheck,
  MapPin,
  FileCheck2,
  HardDrive,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";
import { Case, Evidence, CCTVDevice } from "../types";

interface CaseManagementViewProps {
  cases: Case[];
  activeCaseId: string;
  setActiveCaseId: (id: string) => void;
  evidenceList: Evidence[];
  devices: CCTVDevice[];
  onAddNewCase: (newCase: Partial<Case>) => Promise<void>;
  onSelectTab: (tab: string) => void;
  onSelectEvidence: (ev: Evidence) => void;
}

export const CaseManagementView: React.FC<CaseManagementViewProps> = ({
  cases = [],
  activeCaseId,
  setActiveCaseId,
  evidenceList = [],
  devices = [],
  onAddNewCase,
  onSelectTab,
  onSelectEvidence,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    case_name: "",
    case_number: `CR-${Math.floor(10000 + Math.random() * 90000)}`,
    description: "",
    investigator: "Insp. David Vance",
    priority: "High" as "High" | "Medium" | "Urgent",
    incident_location: "Market Road & 4th Avenue Crossing",
    incident_lat: 40.7128,
    incident_lng: -74.006,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const safeCases = Array.isArray(cases) ? cases : [];
  const safeEvidence = Array.isArray(evidenceList) ? evidenceList : [];
  const safeDevices = Array.isArray(devices) ? devices : [];

  const activeCase = safeCases.find((c) => c?.case_id === activeCaseId) || safeCases[0];
  const linkedEvidence = safeEvidence.filter((e) => e?.case_id === activeCase?.case_id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.case_name.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddNewCase(formData);
      setShowModal(false);
      setFormData({
        case_name: "",
        case_number: `CR-${Math.floor(10000 + Math.random() * 90000)}`,
        description: "",
        investigator: "Insp. David Vance",
        priority: "High",
        incident_location: "Market Road Crossing",
        incident_lat: 40.7128,
        incident_lng: -74.006,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#060608] border border-zinc-800/80 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-2xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-[#ef233c] shadow-inner">
              <FolderLock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black font-display text-white tracking-tight uppercase">
                Forensic Case Dossiers
              </h2>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Maintain judicial integrity by grouping surveillance feeds under verified cryptographic case logs.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 bg-[#ef233c] hover:bg-[#d90429] text-white text-xs font-mono font-bold px-5 py-2.5 rounded-full shadow-[0_0_15px_rgba(239,35,60,0.35)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          NEW DOSSIER •
        </button>
      </div>

      {/* Main Cases Table */}
      <div className="bg-[#08080b] border border-zinc-800/80 rounded-3xl overflow-hidden shadow-2xl">
        <div className="px-6 py-4 border-b border-zinc-800/80 bg-black/60 flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#ef233c]" />
            REGISTERED INQUESTS ({safeCases.length})
          </span>
          <span className="text-[11px] font-mono text-zinc-500">
            ACTIVE CASE: <strong className="text-white font-bold">{activeCase?.case_number}</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300 font-sans">
            <thead className="bg-black/90 text-zinc-400 font-mono uppercase text-[11px] border-b border-zinc-800">
              <tr>
                <th className="py-3.5 px-4 font-bold">CASE ID / NUMBER</th>
                <th className="py-3.5 px-4 font-bold">CASE NAME</th>
                <th className="py-3.5 px-4 font-bold">INVESTIGATOR</th>
                <th className="py-3.5 px-4 font-bold">LOCATION</th>
                <th className="py-3.5 px-4 font-bold">PRIORITY</th>
                <th className="py-3.5 px-4 font-bold">STATUS</th>
                <th className="py-3.5 px-4 font-bold">DATE</th>
                <th className="py-3.5 px-4 font-bold text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900">
              {safeCases.map((c) => {
                const isSelected = c.case_id === activeCaseId;
                return (
                  <tr
                    key={c.case_id}
                    className={`transition-colors ${
                      isSelected ? "bg-[#18090b] border-l-2 border-[#ef233c]" : "hover:bg-zinc-900/40"
                    }`}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-white">
                      <div className="flex items-center gap-2">
                        {isSelected && <span className="h-2 w-2 rounded-full bg-[#ef233c] shadow-[0_0_6px_#ef233c]" />}
                        {c.case_number}
                      </div>
                      <span className="text-[10px] text-zinc-500 block font-normal">{c.case_id}</span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-white max-w-xs">
                      <div className="font-semibold">{c.case_name}</div>
                      <p className="text-[11px] text-zinc-400 line-clamp-1">{c.description}</p>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-300">
                      <div className="flex items-center gap-1.5 font-mono text-xs">
                        <UserCheck className="w-3.5 h-3.5 text-zinc-500" />
                        {c.investigator}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-400">
                      <div className="flex items-center gap-1 font-mono text-[11px]">
                        <MapPin className="w-3 h-3 text-[#ef233c] shrink-0" />
                        <span className="truncate max-w-[150px]">{c.incident_location}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                          c.priority === "Urgent"
                            ? "bg-[#ef233c]/20 text-[#ef233c] border border-[#ef233c]/40"
                            : c.priority === "High"
                            ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
                            : "bg-blue-500/15 text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-zinc-900 text-white border border-zinc-800">
                        <CheckCircle2 className="w-3 h-3 text-[#ef233c]" />
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-zinc-500 font-mono text-[11px]">
                      {c.created_at.substring(0, 10)}
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setActiveCaseId(c.case_id)}
                        className={`text-xs px-3 py-1 rounded-full font-mono transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#ef233c] text-white font-bold shadow-[0_0_10px_rgba(239,35,60,0.4)]"
                            : "bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
                        }`}
                      >
                        {isSelected ? "ACTIVE" : "SELECT"}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Drill-down of Active Case Evidence */}
      {activeCase && (
        <div className="bg-[#060608] border border-zinc-800/80 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-zinc-800/80">
            <div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-[#ef233c]" />
                <h3 className="text-sm font-bold font-display text-white uppercase tracking-wider">
                  Seized Evidence for {activeCase.case_number}: {activeCase.case_name}
                </h3>
              </div>
              <p className="text-xs text-zinc-400 font-mono mt-1">
                {linkedEvidence.length} digital media assets secured with FIPS 180-4 SHA-256 hashes.
              </p>
            </div>

            <button
              onClick={() => onSelectTab("evidence")}
              className="text-xs text-white hover:text-zinc-300 font-mono font-bold flex items-center gap-1.5 bg-zinc-900 hover:bg-zinc-800 px-3.5 py-1.5 rounded-full border border-zinc-800 cursor-pointer"
            >
              + INGEST EVIDENCE <ExternalLink className="w-3 h-3 text-[#ef233c]" />
            </button>
          </div>

          {linkedEvidence.length === 0 ? (
            <div className="p-8 text-center bg-black/60 rounded-2xl border border-dashed border-zinc-800">
              <HardDrive className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
              <p className="text-xs text-zinc-500 font-mono">
                No evidence files uploaded to this case dossier yet.
              </p>
              <button
                onClick={() => onSelectTab("evidence")}
                className="mt-3 text-xs bg-white hover:bg-zinc-200 text-black font-bold font-mono px-4 py-1.5 rounded-full transition-colors cursor-pointer"
              >
                UPLOAD CCTV EVIDENCE •
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {linkedEvidence.map((ev) => {
                const cam = safeDevices.find((d) => d?.cctv_id === ev?.cctv_id);
                return (
                  <div
                    key={ev.evidence_id}
                    className="p-4 bg-black border border-zinc-800/90 rounded-2xl flex items-center justify-between gap-3 hover:border-zinc-700 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-white">
                          {ev.evidence_id}
                        </span>
                        <span className="text-xs text-zinc-300 font-medium truncate">
                          {ev.file_name}
                        </span>
                      </div>
                      <div className="text-[11px] text-zinc-500 mt-1 flex items-center gap-3 font-mono">
                        <span>CAM: {cam?.name || ev.cctv_id}</span>
                        <span>{ev.file_size}</span>
                        <span>{ev.metadata.resolution}</span>
                      </div>
                      <div className="font-mono text-[10px] text-zinc-500 truncate mt-1">
                        SHA-256: {ev.sha256_hash}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onSelectEvidence(ev);
                        onSelectTab("player");
                      }}
                      className="shrink-0 text-xs bg-[#ef233c] hover:bg-[#d90429] text-white px-3.5 py-1.5 rounded-full font-mono font-bold transition-all shadow-[0_0_10px_rgba(239,35,60,0.3)] cursor-pointer"
                    >
                      ANALYZE
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* New Case Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#09090c] border border-zinc-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2.5">
                <FolderLock className="w-5 h-5 text-[#ef233c]" />
                <h3 className="text-base font-bold font-display text-white uppercase tracking-wider">
                  Create New Forensic Dossier
                </h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-500 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-zinc-300 font-medium mb-1 font-mono text-[11px]">CASE NUMBER</label>
                <input
                  type="text"
                  value={formData.case_number}
                  onChange={(e) => setFormData({ ...formData, case_number: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono focus:border-[#ef233c] focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1 font-mono text-[11px]">CASE NAME *</label>
                <input
                  type="text"
                  placeholder="e.g., Market Road Hit-and-Run Investigation"
                  value={formData.case_name}
                  onChange={(e) => setFormData({ ...formData, case_name: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-[#ef233c] focus:outline-none font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1 font-mono text-[11px]">CASE DESCRIPTION</label>
                <textarea
                  rows={2}
                  placeholder="Incident overview, suspect description, time window of interest..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-[#ef233c] focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-300 font-medium mb-1 font-mono text-[11px]">ASSIGNED INVESTIGATOR</label>
                  <input
                    type="text"
                    value={formData.investigator}
                    onChange={(e) => setFormData({ ...formData, investigator: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-[#ef233c] focus:outline-none font-sans"
                    required
                  />
                </div>
                <div>
                  <label className="block text-zinc-300 font-medium mb-1 font-mono text-[11px]">PRIORITY</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-[#ef233c] focus:outline-none font-mono cursor-pointer"
                  >
                    <option value="Urgent">Urgent (Tier 1)</option>
                    <option value="High">High (Tier 2)</option>
                    <option value="Medium">Medium (Tier 3)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-zinc-300 font-medium mb-1 font-mono text-[11px]">INCIDENT GIS LOCATION</label>
                <input
                  type="text"
                  placeholder="e.g., Market Road & 4th Avenue Intersection"
                  value={formData.incident_location}
                  onChange={(e) => setFormData({ ...formData, incident_location: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white focus:border-[#ef233c] focus:outline-none font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono text-[10px]">LATITUDE</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.incident_lat}
                    onChange={(e) => setFormData({ ...formData, incident_lat: parseFloat(e.target.value) })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono focus:border-[#ef233c] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1 font-mono text-[10px]">LONGITUDE</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.incident_lng}
                    onChange={(e) => setFormData({ ...formData, incident_lng: parseFloat(e.target.value) })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono focus:border-[#ef233c] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-zinc-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 rounded-full transition-colors font-mono cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#ef233c] hover:bg-[#d90429] text-white rounded-full transition-all font-mono font-bold shadow-[0_0_12px_rgba(239,35,60,0.4)] cursor-pointer"
                >
                  {isSubmitting ? "CREATING..." : "SAVE DOSSIER •"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
