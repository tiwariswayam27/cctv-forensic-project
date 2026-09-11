import React, { useState } from "react";
import {
  ShieldCheck,
  Plus,
  Clock,
  UserCheck,
  FileText,
  Search,
  Download,
  Filter,
  CheckCircle2,
  HardDrive,
  Eye,
  Camera,
  AlertCircle,
} from "lucide-react";
import { ChainOfCustodyRecord, Case, Evidence } from "../types";

interface ChainOfCustodyViewProps {
  records: ChainOfCustodyRecord[];
  cases: Case[];
  evidenceList: Evidence[];
  activeCaseId: string;
  onAddRecord: (record: Partial<ChainOfCustodyRecord>) => Promise<void>;
}

export const ChainOfCustodyView: React.FC<ChainOfCustodyViewProps> = ({
  records = [],
  cases = [],
  evidenceList = [],
  activeCaseId = "",
  onAddRecord,
}) => {
  const safeRecords = Array.isArray(records) ? records : [];
  const safeCases = Array.isArray(cases) ? cases : [];
  const safeEvidenceList = Array.isArray(evidenceList) ? evidenceList : [];

  const [searchTerm, setSearchTerm] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    user: "Insp. David Vance",
    action: "Evidence Inspection",
    evidence_id: safeEvidenceList[0]?.evidence_id || "EV-001",
    notes: "Detailed examination of vehicle license plate in Frame #1245.",
  });

  const filteredRecords = safeRecords.filter((r) => {
    if (!r) return false;
    const user = r.user || "";
    const action = r.action || "";
    const notes = r.notes || "";
    const evId = r.evidence_id || "";
    const matchesSearch =
      user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesAction = actionFilter === "all" || action.toLowerCase().includes(actionFilter.toLowerCase());
    return matchesSearch && matchesAction;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onAddRecord({
        ...formData,
        case_id: activeCaseId,
        timestamp: new Date().toISOString().replace("T", " ").substring(0, 19),
      });
      setShowModal(false);
      setFormData({
        user: "Insp. David Vance",
        action: "Evidence Inspection",
        evidence_id: safeEvidenceList[0]?.evidence_id || "EV-001",
        notes: "",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportAuditLog = () => {
    const jsonStr = JSON.stringify(records, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `CHAIN_OF_CUSTODY_AUDIT_${activeCaseId}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Cryptographic Chain of Custody Ledger (CoC)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Immutable audit record of digital evidence acquisition, custodial transfers, examinations, and judicial exports.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportAuditLog}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            Export Audit Ledger
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            + Record Custodial Action
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by investigator, action, notes, hash..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Custodial Actions</option>
            <option value="Upload">Upload / Ingestion</option>
            <option value="View">Video Playback / Scrub</option>
            <option value="Snapshot">Snapshot Export</option>
            <option value="AI">AI Detection Inspection</option>
            <option value="Report">Report Generation</option>
            <option value="Verify">Integrity Verification</option>
          </select>
        </div>
      </div>

      {/* Forensic Audit Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Chain of Custody Events ({filteredRecords.length})
          </span>
          <span className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
            <CheckCircle2 className="w-3.5 h-3.5" />
            NIST SP 800-86 Compliant Ledger
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-medium">Record ID</th>
                <th className="py-3 px-4 font-medium">Timestamp (UTC)</th>
                <th className="py-3 px-4 font-medium">Investigator / User</th>
                <th className="py-3 px-4 font-medium">Evidence ID</th>
                <th className="py-3 px-4 font-medium">Custodial Action</th>
                <th className="py-3 px-4 font-medium">Audit Notes & Cryptographic Reference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredRecords.map((r) => {
                const isUpload = r.action.toLowerCase().includes("upload");
                const isVerify = r.action.toLowerCase().includes("verif");
                const isAI = r.action.toLowerCase().includes("ai");

                return (
                  <tr key={r.record_id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-400">
                      {r.record_id}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {r.timestamp}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 font-medium text-slate-200">
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        {r.user}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-cyan-400 font-bold">
                      {r.evidence_id}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-semibold ${
                          isUpload
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                            : isVerify
                            ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/30"
                            : isAI
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/30"
                            : "bg-slate-800 text-slate-300 border border-slate-700"
                        }`}
                      >
                        {r.action}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-300 text-xs font-mono">
                      <div className="max-w-md break-words">{r.notes}</div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Log Custodial Action</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">User / Investigator</label>
                <input
                  type="text"
                  value={formData.user}
                  onChange={(e) => setFormData({ ...formData, user: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Evidence ID *</label>
                <select
                  value={formData.evidence_id}
                  onChange={(e) => setFormData({ ...formData, evidence_id: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                >
                  {safeEvidenceList.map((ev) => (
                    <option key={ev.evidence_id} value={ev.evidence_id}>
                      {ev.evidence_id} - {ev.file_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Custodial Action *</label>
                <input
                  type="text"
                  placeholder="e.g., Transferred for Audio Forensic Cleanup"
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Audit Notes</label>
                <textarea
                  rows={3}
                  placeholder="Details of operation, recipient custody, verification checksum..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-emerald-500 focus:outline-none"
                  required
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors font-semibold shadow-sm"
                >
                  {isSubmitting ? "Logging..." : "Commit Entry to Ledger"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
