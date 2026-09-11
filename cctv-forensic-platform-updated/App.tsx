import React, { useEffect, useState } from "react";
import { Navbar } from "./components/Navbar";
import { AdminAccessRequests } from "./components/AdminAccessRequests";
import { DashboardView } from "./components/DashboardView";
import { CaseManagementView } from "./components/CaseManagementView";
import { CCTVRegistryView } from "./components/CCTVRegistryView";
import { GISMapView } from "./components/GISMapView";
import { EvidenceUploadView } from "./components/EvidenceUploadView";
import { VideoPlayerView } from "./components/VideoPlayerView";
import { AIDetectionInspectorView } from "./components/AIDetectionInspectorView";
import { RecoveryModuleView } from "./components/RecoveryModuleView";
import { ChainOfCustodyView } from "./components/ChainOfCustodyView";
import { ReportGeneratorView } from "./components/ReportGeneratorView";
import { DiagnosticPanelView } from "./components/DiagnosticPanelView";

import {
  User,
  Case,
  CCTVDevice,
  Evidence,
  AnalysisEvent,
  ChainOfCustodyRecord,
} from "./types";

/* -------------------------------------------------------------------------- */
/* Login Screen                                                               */
/* -------------------------------------------------------------------------- */

function LoginScreen({
  onLogin,
}: {
  onLogin: (user: User, token: string) => void;
}) {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!usernameOrEmail.trim() || !password) {
      setError("Enter your authorized username/email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username_or_email: usernameOrEmail.trim(),
          password,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || "Authentication failed. Verify your credentials."
        );
      }

      if (!data?.access_token || !data?.user) {
        throw new Error("Authentication response was incomplete.");
      }

      localStorage.setItem("cctv_token", data.access_token);
      localStorage.setItem("cctv_user", JSON.stringify(data.user));

      onLogin(data.user, data.access_token);
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to connect to the forensic authentication service."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (
      !name.trim() ||
      !email.trim() ||
      !username.trim() ||
      !badgeNumber.trim() ||
      !password
    ) {
      setError("Complete all registration fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          username: username.trim(),
          badgeNumber: badgeNumber.trim(),
          password,
          role: "Forensic Analyst",
          agency: "CCTV Forensic Platform",
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || "Registration request could not be submitted."
        );
      }

      setSuccess(
        data?.message ||
          "Registration request submitted. Wait for administrator approval before logging in."
      );

      setName("");
      setEmail("");
      setUsername("");
      setBadgeNumber("");
      setPassword("");
    } catch (err: any) {
      setError(
        err?.message ||
          "Unable to connect to the forensic registration service."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="border border-zinc-800 bg-[#08080a] rounded-2xl overflow-hidden shadow-2xl">
          <div className="border-b border-zinc-800 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center">
                <span className="text-[#ef233c] text-xl font-black">DF</span>
              </div>

              <div>
                <div className="text-lg font-black tracking-tight">
                  DIGITAL <span className="text-[#ef233c]">FORENSIC</span>
                </div>
                <div className="text-[10px] text-zinc-500 font-mono">
                  CCTV EVIDENCE & INTEGRITY PLATFORM
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 border-b border-zinc-800">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
                setSuccess("");
              }}
              className={`py-3 text-xs font-mono font-bold transition-colors ${
                mode === "login"
                  ? "text-white bg-zinc-900 border-b-2 border-[#ef233c]"
                  : "text-zinc-600 hover:text-zinc-300"
              }`}
            >
              AUTHENTICATE
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register");
                setError("");
                setSuccess("");
              }}
              className={`py-3 text-xs font-mono font-bold transition-colors ${
                mode === "register"
                  ? "text-white bg-zinc-900 border-b-2 border-[#ef233c]"
                  : "text-zinc-600 hover:text-zinc-300"
              }`}
            >
              REQUEST ACCESS
            </button>
          </div>

          <div className="px-6 py-7">
            {mode === "login" && (
              <>
                <div className="mb-6">
                  <div className="text-[10px] text-[#ef233c] font-mono tracking-widest uppercase">
                    Authorized Access
                  </div>

                  <h1 className="text-2xl font-black text-white mt-1">
                    Forensic Vault Login
                  </h1>

                  <p className="text-sm text-zinc-500 mt-2">
                    Sign in with an authorized forensic platform account.
                  </p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      USERNAME / EMAIL
                    </label>

                    <input
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      autoComplete="username"
                      placeholder="Enter username or email"
                      className="w-full bg-black border border-zinc-800 focus:border-[#ef233c] rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      PASSWORD
                    </label>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="current-password"
                      placeholder="Enter password"
                      className="w-full bg-black border border-zinc-800 focus:border-[#ef233c] rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors"
                    />
                  </div>

                  {error && (
                    <div className="border border-red-900/70 bg-red-950/20 rounded-lg px-3 py-3 text-xs text-red-300 font-mono">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#ef233c] hover:bg-[#d91f35] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg py-3 transition-colors"
                  >
                    {loading ? "AUTHENTICATING..." : "AUTHENTICATE"}
                  </button>
                </form>
              </>
            )}

            {mode === "register" && (
              <>
                <div className="mb-6">
                  <div className="text-[10px] text-[#ef233c] font-mono tracking-widest uppercase">
                    Access Request
                  </div>

                  <h1 className="text-2xl font-black text-white mt-1">
                    Request Forensic Access
                  </h1>

                  <p className="text-sm text-zinc-500 mt-2">
                    Submit your details for administrator approval.
                  </p>
                </div>

                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      FULL NAME
                    </label>

                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter full name"
                      className="w-full bg-black border border-zinc-800 focus:border-[#ef233c] rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      EMAIL
                    </label>

                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter email"
                      className="w-full bg-black border border-zinc-800 focus:border-[#ef233c] rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      USERNAME
                    </label>

                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Create username"
                      className="w-full bg-black border border-zinc-800 focus:border-[#ef233c] rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      BADGE / ID NUMBER
                    </label>

                    <input
                      value={badgeNumber}
                      onChange={(e) => setBadgeNumber(e.target.value)}
                      placeholder="Enter badge or ID number"
                      className="w-full bg-black border border-zinc-800 focus:border-[#ef233c] rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-zinc-400 mb-2">
                      PASSWORD
                    </label>

                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete="new-password"
                      placeholder="Minimum 8 characters"
                      className="w-full bg-black border border-zinc-800 focus:border-[#ef233c] rounded-lg px-3 py-3 text-sm text-white outline-none transition-colors"
                    />
                  </div>

                  <div className="border border-zinc-800 bg-zinc-950 rounded-lg p-3">
                    <div className="text-[10px] font-mono text-zinc-500">
                      REQUESTED ROLE
                    </div>

                    <div className="text-sm text-white font-semibold mt-1">
                      Forensic Analyst
                    </div>

                    <div className="text-[10px] text-zinc-600 mt-1">
                      Administrator approval is required before login.
                    </div>
                  </div>

                  {error && (
                    <div className="border border-red-900/70 bg-red-950/20 rounded-lg px-3 py-3 text-xs text-red-300 font-mono">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="border border-green-900/70 bg-green-950/20 rounded-lg px-3 py-3 text-xs text-green-300 font-mono">
                      {success}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-[#ef233c] hover:bg-[#d91f35] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-lg py-3 transition-colors"
                  >
                    {loading ? "SUBMITTING REQUEST..." : "REQUEST ACCESS"}
                  </button>
                </form>
              </>
            )}

            <div className="mt-6 pt-5 border-t border-zinc-900">
              <div className="flex items-center justify-between text-[10px] font-mono text-zinc-600">
                <span>SHA-256 INTEGRITY</span>
                <span>AUTHORIZED PERSONNEL ONLY</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-4 text-[10px] text-zinc-700 font-mono">
          CCTV FORENSIC PLATFORM â€¢ SECURE SESSION GATE
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Main Application                                                           */
/* -------------------------------------------------------------------------- */

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  const [activeTab, setActiveTab] = useState<string>("dashboard");

  /* IMPORTANT:
     These start empty. There is NO INITIAL_CASES / INITIAL_EVIDENCE fallback.
     The backend database is the source of truth.
  */
  const [cases, setCases] = useState<Case[]>([]);
  const [devices, setDevices] = useState<CCTVDevice[]>([]);
  const [evidenceList, setEvidenceList] = useState<Evidence[]>([]);
  const [events, setEvents] = useState<AnalysisEvent[]>([]);
  const [records, setRecords] = useState<ChainOfCustodyRecord[]>([]);

  const [activeCaseId, setActiveCaseId] = useState<string>("");
  const [selectedEvidence, setSelectedEvidence] = useState<Evidence | null>(
    null
  );
  const [focusedCamera, setFocusedCamera] = useState<CCTVDevice | null>(null);

  const [capturedFrame, setCapturedFrame] = useState<string | null>(null);
  const [capturedTimecode, setCapturedTimecode] = useState<string | null>(null);

  /* ---------------------------------------------------------------------- */
  /* Authentication                                                         */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const token = localStorage.getItem("cctv_token");
    const savedUser = localStorage.getItem("cctv_user");

    if (!token || !savedUser) {
      return;
    }

    try {
      const parsedUser = JSON.parse(savedUser);

      if (parsedUser?.id || parsedUser?.email || parsedUser?.username) {
        setCurrentUser(parsedUser);
        setAuthenticated(true);
      }
    } catch {
      localStorage.removeItem("cctv_token");
      localStorage.removeItem("cctv_user");
    }
  }, []);

  const handleLogin = (user: User, _token: string) => {
    setCurrentUser(user);
    setAuthenticated(true);
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("cctv_token");
    localStorage.removeItem("cctv_user");

    setAuthenticated(false);
    setCurrentUser(undefined);

    setCases([]);
    setDevices([]);
    setEvidenceList([]);
    setEvents([]);
    setRecords([]);

    setActiveCaseId("");
    setSelectedEvidence(null);
    setFocusedCamera(null);
    setCapturedFrame(null);
    setCapturedTimecode(null);
  };

  /* ---------------------------------------------------------------------- */
  /* Safe JSON helper                                                       */
  /* ---------------------------------------------------------------------- */

  const safeFetchJson = async (url: string) => {
    try {
      const token = localStorage.getItem("cctv_token");

      const headers: HeadersInit = {};

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch(url, {
        headers,
      });

      if (!res.ok) {
        return null;
      }

      const text = await res.text();
      const trimmed = text.trim();

      if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) {
        return null;
      }

      return JSON.parse(trimmed);
    } catch {
      return null;
    }
  };

  const extractArray = (res: any) => {
    if (!res) return [];

    if (Array.isArray(res)) return res;

    if (Array.isArray(res.data)) return res.data;

    return [];
  };

  /* ---------------------------------------------------------------------- */
  /* Load REAL backend data only                                            */
  /* ---------------------------------------------------------------------- */

  const loadForensicData = async () => {
    if (!authenticated) {
      return;
    }

    try {
      const [
        casesRes,
        devicesRes,
        evidenceRes,
        eventsRes,
        cocRes,
      ] = await Promise.all([
        safeFetchJson("/api/cases"),
        safeFetchJson("/api/cctv"),
        safeFetchJson("/api/evidence"),
        safeFetchJson("/api/events"),
        safeFetchJson("/api/coc"),
      ]);

      const loadedCases = extractArray(casesRes);
      const loadedDevices = extractArray(devicesRes);
      const loadedEvidence = extractArray(evidenceRes);
      const loadedEvents = extractArray(eventsRes);
      const loadedRecords = extractArray(cocRes);

      setCases(loadedCases);
      setDevices(loadedDevices);
      setEvidenceList(loadedEvidence);
      setEvents(loadedEvents);
      setRecords(loadedRecords);

      if (loadedCases.length > 0) {
        setActiveCaseId((previous) => {
          if (
            previous &&
            loadedCases.some((c: Case) => c.case_id === previous)
          ) {
            return previous;
          }

          return loadedCases[0].case_id;
        });
      } else {
        setActiveCaseId("");
      }

      if (loadedEvidence.length > 0) {
        setSelectedEvidence((previous) => {
          if (
            previous &&
            loadedEvidence.some(
              (e: Evidence) => e.evidence_id === previous.evidence_id
            )
          ) {
            return previous;
          }

          return loadedEvidence[0];
        });
      } else {
        setSelectedEvidence(null);
      }
    } catch (err) {
      console.error("Failed to load forensic backend data:", err);

      setCases([]);
      setDevices([]);
      setEvidenceList([]);
      setEvents([]);
      setRecords([]);
      setActiveCaseId("");
      setSelectedEvidence(null);
    }
  };

  useEffect(() => {
    loadForensicData();
  }, [authenticated]);

  /* ---------------------------------------------------------------------- */
  /* Case                                                                     */
  /* ---------------------------------------------------------------------- */

  const handleAddNewCase = async (newCase: Partial<Case>) => {
    try {
      const token = localStorage.getItem("cctv_token");

      const res = await fetch("/api/cases", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newCase),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Failed to create case:", data);
        return;
      }

      const createdCase: Case = data?.case || data?.data || data;

      if (!createdCase?.case_id) {
        console.error("Backend did not return a valid case.");
        return;
      }

      setCases((prev) => [createdCase, ...prev]);
      setActiveCaseId(createdCase.case_id);
    } catch (err) {
      console.error("Failed to add case:", err);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* CCTV                                                                     */
  /* ---------------------------------------------------------------------- */

  const handleAddDevice = async (device: Partial<CCTVDevice>) => {
    try {
      const token = localStorage.getItem("cctv_token");

      const res = await fetch("/api/cctv", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(device),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Failed to register CCTV:", data);
        return;
      }

      const createdDevice: CCTVDevice = data?.device || data?.data || data;

      if (!createdDevice?.cctv_id) {
        console.error("Backend did not return a valid CCTV device.");
        return;
      }

      setDevices((prev) => [createdDevice, ...prev]);
    } catch (err) {
      console.error("Failed to add device:", err);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Evidence                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleUploadEvidence = async (payload: any) => {
    try {
      const token = localStorage.getItem("cctv_token");
      const isFormData =
        typeof FormData !== "undefined" && payload instanceof FormData;

      const headers: HeadersInit = {};

      if (!isFormData) {
        headers["Content-Type"] = "application/json";
      }

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const res = await fetch("/api/evidence", {
        method: "POST",
        headers,
        body: isFormData ? payload : JSON.stringify(payload),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Evidence ingestion failed:", data);
        return;
      }

      if (data?.evidence || data?.data) {
        const createdEvidence: Evidence = data.evidence || data.data;

        setEvidenceList((prev) => [createdEvidence, ...prev]);
        setSelectedEvidence(createdEvidence);
      }

      const cocRes = await safeFetchJson("/api/coc");

      if (cocRes) {
        setRecords(extractArray(cocRes));
      }
    } catch (err) {
      console.error("Failed to ingest evidence:", err);
    }
  };

  const handleVerifyIntegrity = async (
    ev: Evidence,
    simulatedTamper = false
  ) => {
    try {
      const token = localStorage.getItem("cctv_token");

      const res = await fetch(`/api/evidence/${ev.evidence_id}/verify`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          simulate_tamper: simulatedTamper,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Integrity verification failed:", data);
        return null;
      }

      if (data?.status) {
        setEvidenceList((prev) =>
          prev.map((item) =>
            item.evidence_id === ev.evidence_id
              ? {
                  ...item,
                  status: data.status,
                  current_hash: data.current_hash,
                }
              : item
          )
        );

        const cocRes = await safeFetchJson("/api/coc");

        if (cocRes) {
          setRecords(extractArray(cocRes));
        }

        return data;
      }

      return null;
    } catch (err) {
      console.error("Failed to verify integrity:", err);
      return null;
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Analysis Events                                                         */
  /* ---------------------------------------------------------------------- */

  const handleAddEvent = async (newEvent: Partial<AnalysisEvent>) => {
    try {
      const token = localStorage.getItem("cctv_token");

      const res = await fetch("/api/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newEvent),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Failed to add analysis event:", data);
        return;
      }

      if (data?.event || data?.data) {
        const createdEvent: AnalysisEvent = data.event || data.data;

        setEvents((prev) => [createdEvent, ...prev]);
      }

      const cocRes = await safeFetchJson("/api/coc");

      if (cocRes) {
        setRecords(extractArray(cocRes));
      }
    } catch (err) {
      console.error("Failed to add event bookmark:", err);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Chain of Custody                                                        */
  /* ---------------------------------------------------------------------- */

  const handleAddCoCRecord = async (
    record: Partial<ChainOfCustodyRecord>
  ) => {
    try {
      const token = localStorage.getItem("cctv_token");

      const res = await fetch("/api/coc", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(record),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        console.error("Failed to add chain-of-custody record:", data);
        return;
      }

      if (data?.record || data?.data) {
        const createdRecord: ChainOfCustodyRecord =
          data.record || data.data;

        setRecords((prev) => [createdRecord, ...prev]);
      }
    } catch (err) {
      console.error("Failed to add CoC record:", err);
    }
  };

  /* ---------------------------------------------------------------------- */
  /* Recovery                                                                 */
  /* ---------------------------------------------------------------------- */

  const handleVaultRecoveredEvidence = async (recoveredData: any) => {
    if (!activeCaseId) {
      console.warn("Cannot ingest recovered evidence without an active case.");
      return;
    }

    const payload = {
      case_id: activeCaseId,
      cctv_id: devices[0]?.cctv_id || "",
      file_name: recoveredData.file_name,
      file_size: recoveredData.file_size,
      file_size_bytes: 35000000,
      sha256_hash: recoveredData.sha256_hash,
      description: recoveredData.description,
      acquisition_date: new Date()
        .toISOString()
        .replace("T", " ")
        .substring(0, 19),
      metadata: recoveredData.metadata,
      thumbnails: [],
      sample_url: undefined,
    };

    await handleUploadEvidence(payload);
  };

  /* ---------------------------------------------------------------------- */
  /* AI Inspector                                                             */
  /* ---------------------------------------------------------------------- */

  const handleOpenAIInspector = (
    frameData: string,
    timecode: string
  ) => {
    setCapturedFrame(frameData);
    setCapturedTimecode(timecode);
    setActiveTab("ai");
  };

  /* ---------------------------------------------------------------------- */
  /* Empty case object                                                       */
  /* ---------------------------------------------------------------------- */

  const activeCase: Case = cases.find(
    (c) => c.case_id === activeCaseId
  ) || {
    case_id: "",
    case_number: "",
    case_name: "",
    description: "",
    created_at: "",
    investigator: currentUser?.name || "",
    status: "Active",
    priority: "Medium",
    incident_location: "",
    incident_lat: 0,
    incident_lng: 0,
  };

  /* ---------------------------------------------------------------------- */
  /* Login Gate                                                               */
  /* ---------------------------------------------------------------------- */

  if (!authenticated || !currentUser) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  /* ---------------------------------------------------------------------- */
  /* Authenticated Application                                               */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex flex-col font-sans antialiased selection:bg-[#ef233c] selection:text-white">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        cases={cases}
        activeCaseId={activeCaseId}
        setActiveCaseId={setActiveCaseId}
        activeCaseNumber={activeCase?.case_number}
        onOpenReport={() => setActiveTab("report")}
        onLogout={handleLogout}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        {activeTab === "access-requests" && currentUser?.role === "Administrator" && (
          <AdminAccessRequests />
        )}

        {activeTab === "dashboard" && (
          <DashboardView
            cases={cases}
            devices={devices}
            evidenceList={evidenceList}
            events={events}
            records={records}
            onSelectTab={setActiveTab}
            onSelectEvidence={(ev) => {
              setSelectedEvidence(ev);
              setActiveTab("player");
            }}
          />
        )}

        {activeTab === "cases" && (
          <CaseManagementView
            cases={cases}
            activeCaseId={activeCaseId}
            setActiveCaseId={setActiveCaseId}
            evidenceList={evidenceList}
            devices={devices}
            onAddNewCase={handleAddNewCase}
            onSelectTab={setActiveTab}
            onSelectEvidence={(ev) => {
              setSelectedEvidence(ev);
              setActiveTab("player");
            }}
          />
        )}

        {activeTab === "cctv" && (
          <CCTVRegistryView
            devices={devices}
            onAddDevice={handleAddDevice}
            onSelectTab={setActiveTab}
            onFocusCameraOnMap={(cam) => {
              setFocusedCamera(cam);
              setActiveTab("map");
            }}
          />
        )}

        {activeTab === "map" && (
          <GISMapView
            devices={devices}
            cases={cases}
            activeCaseId={activeCaseId}
            focusedDevice={focusedCamera}
            onSelectCamera={(cam) => setFocusedCamera(cam)}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === "evidence" && (
          <EvidenceUploadView
            cases={cases}
            activeCaseId={activeCaseId}
            devices={devices}
            evidenceList={evidenceList}
            onUploadEvidence={handleUploadEvidence}
            onVerifyIntegrity={handleVerifyIntegrity}
            onSelectEvidenceForAnalysis={(ev) => {
              setSelectedEvidence(ev);
              setActiveTab("player");
            }}
            onSelectTab={setActiveTab}
          />
        )}

        {(activeTab === "player" || activeTab === "analysis") && (
          <VideoPlayerView
            evidence={selectedEvidence}
            evidenceList={evidenceList}
            devices={devices}
            events={events}
            onSelectEvidence={setSelectedEvidence}
            onAddEvent={handleAddEvent}
            onOpenAIInspector={handleOpenAIInspector}
          />
        )}

        {activeTab === "ai" && (
          <AIDetectionInspectorView
            evidenceList={evidenceList}
            activeEvidence={selectedEvidence}
            capturedFrame={capturedFrame}
            capturedTimecode={capturedTimecode}
            onJumpToTime={(_tc) => {
              setActiveTab("player");
            }}
            onAddEvent={handleAddEvent}
            onSelectTab={setActiveTab}
          />
        )}

        {activeTab === "recovery" && (
          <RecoveryModuleView
            onVaultRecoveredEvidence={handleVaultRecoveredEvidence}
            onSelectTab={setActiveTab}
          />
        )}

        {(activeTab === "coc" || activeTab === "custody") && (
          <ChainOfCustodyView
            records={records}
            cases={cases}
            evidenceList={evidenceList}
            activeCaseId={activeCaseId}
            onAddRecord={handleAddCoCRecord}
          />
        )}

        {activeTab === "report" && (
          <ReportGeneratorView
            activeCase={activeCase}
            evidenceList={evidenceList.filter(
              (e) => e?.case_id === activeCase?.case_id
            )}
            devices={devices}
            events={events}
            records={records}
          />
        )}

        {activeTab === "diagnostics" && <DiagnosticPanelView />}
      </main>

      <footer className="border-t border-zinc-900 bg-[#050507] px-6 py-2.5 text-[11px] text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-2 print:hidden font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-white font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ef233c] shadow-[0_0_6px_#ef233c] animate-pulse" />
            VAULT: CRYPTOGRAPHICALLY SECURE
          </span>

          <span className="text-zinc-800">|</span>

          <button
            onClick={() => setActiveTab("diagnostics")}
            className="hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer font-mono"
            title="Inspect API Endpoints Status"
          >
            <span>API CONNECTIVITY:</span>
            <span className="text-[#ef233c] font-bold">
              100% OPERATIONAL
            </span>
          </button>

          <span className="hidden md:inline text-zinc-800">|</span>

          <span className="hidden md:inline text-zinc-600">
            NIST SP 800-86 & ISO/IEC 27037
          </span>
        </div>

        <div className="flex items-center gap-4 text-zinc-400">
          <span>
            CASE:{" "}
            <strong className="text-white">
              {activeCase?.case_number || "NO ACTIVE CASE"}
            </strong>
          </span>

          <span>
            INVESTIGATOR:{" "}
            <strong className="text-white">
              {activeUserName(currentUser)}
            </strong>
          </span>
        </div>
      </footer>
    </div>
  );
}

function activeUserName(user?: User) {
  return user?.name || "NO AUTHENTICATED USER";
}


