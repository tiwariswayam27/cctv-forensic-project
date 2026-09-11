import React from "react";
import {
  ShieldAlert,
  HardDrive,
  Camera,
  FileCheck2,
  Brain,
  MapPin,
  FolderLock,
  FileText,
  Radio,
  Cpu,
  Activity,
  ChevronDown,
  ShieldCheck
} from "lucide-react";
import { User, Case } from "../types";

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser?: User;
  cases?: Case[];
  activeCaseId?: string;
  setActiveCaseId?: (id: string) => void;
  onOpenReport?: () => void;
  onLogout?: () => void;
  activeCaseNumber?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  cases = [],
  activeCaseId = "CASE-2026-001",
  setActiveCaseId,
  onOpenReport,
  onLogout = () => {},
  activeCaseNumber,
}) => {
  const safeCases = Array.isArray(cases) ? cases : [];
  const currentCase = safeCases.find((c) => c?.case_id === activeCaseId) || safeCases[0];
  const displayCaseNumber = activeCaseNumber || currentCase?.case_number || "CR-2026-001";

  const user: User = currentUser || {
    id: "USR-001",
    name: "Insp. David Vance",
    badgeNumber: "V-4921",
    role: "Senior Forensic Video Analyst",
    agency: "Digital Forensics & Surveillance Unit",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: FolderLock },
    { id: "cases", label: "Cases", icon: FileCheck2 },
    { id: "cctv", label: "CCTV Registry", icon: Camera },
    { id: "map", label: "GIS Radar Map", icon: MapPin },
    { id: "evidence", label: "Evidence & Hash", icon: HardDrive },
    { id: "player", label: "Video Analysis", icon: Radio },
    { id: "coc", label: "Chain of Custody", icon: ShieldAlert },
    { id: "recovery", label: "Carver & Repair", icon: Cpu },
    { id: "ai", label: "AI Inspector", icon: Brain },
    { id: "report", label: "Forensic Report", icon: FileText },
    { id: "diagnostics", label: "API Diagnostics", icon: Activity },
  ];

  if (user.role === "Administrator") {
    navItems.unshift({
      id: "access-requests",
      label: "Access Requests",
      icon: ShieldCheck,
    });
  }

  const handleReportClick = () => {
    if (onOpenReport) {
      onOpenReport();
    } else {
      setActiveTab("report");
    }
  };

  return (
    <header className="bg-black border-b border-zinc-900 text-zinc-100 sticky top-0 z-40 transition-colors">
      {/* Top Cyber Telemetry Ribbon */}
      <div className="px-4 py-1.5 bg-[#050507] border-b border-zinc-900/90 flex flex-wrap items-center justify-between text-[11px] text-zinc-400 gap-2">
        <div className="flex items-center gap-3 font-mono">
          <span className="flex items-center gap-1.5 font-bold tracking-wider text-white">
            <span className="h-2 w-2 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c] animate-pulse" />
            SEC // VAULT ONLINE
          </span>
          <span className="text-zinc-700">/</span>
          <span className="hidden sm:inline text-zinc-400 tracking-wider">
            FIPS 180-4 SHA-256 <span className="text-[#ef233c]">SECURED</span>
          </span>
          <span className="hidden md:inline text-zinc-700">/</span>
          <span className="hidden md:inline text-zinc-500 font-sans">
            ISO/IEC 27037:2012 COMPLIANT
          </span>
          <span className="hidden lg:inline text-zinc-700">/</span>
          <span className="hidden lg:inline text-zinc-600 font-mono tracking-widest text-[10px]">
            ã‚µã‚¤ãƒãƒ¼é‘‘è­˜
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick API Diagnostics Monitor Pill */}
          <button
            onClick={() => setActiveTab("diagnostics")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
              activeTab === "diagnostics"
                ? "bg-[#ef233c] text-white font-bold shadow-[0_0_12px_rgba(239,35,60,0.4)]"
                : "bg-zinc-900/80 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
            }`}
            title="Inspect API Endpoints Status"
          >
            <Activity className="w-3 h-3 text-[#ef233c]" />
            <span className="hidden xs:inline">API 100% OPERATIONAL</span>
          </button>

          {/* Active Case Selector Pill */}
          <div className="flex items-center gap-1.5 bg-zinc-900/90 border border-zinc-800/80 px-3 py-1 rounded-full text-xs">
            <span className="text-zinc-500 font-mono text-[10px] tracking-wider uppercase">Case:</span>
            {safeCases.length > 0 && setActiveCaseId ? (
              <div className="relative flex items-center">
                <select
                  value={activeCaseId}
                  onChange={(e) => setActiveCaseId(e.target.value)}
                  className="bg-transparent text-white font-mono font-bold focus:outline-none cursor-pointer pr-4 appearance-none"
                >
                  {safeCases.map((c) => (
                    <option key={c.case_id} value={c.case_id} className="bg-zinc-950 text-zinc-200">
                      {c.case_number} - {c.case_name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 text-zinc-500 absolute right-0 pointer-events-none" />
              </div>
            ) : (
              <span className="font-mono font-bold text-white">{displayCaseNumber}</span>
            )}
          </div>

          {/* Quick Generate Report Pill */}
          <button
            onClick={handleReportClick}
            className="flex items-center gap-1.5 bg-white hover:bg-zinc-200 text-black font-semibold text-xs px-3.5 py-1 rounded-full transition-all shadow-sm cursor-pointer"
            title="Generate Formal Forensic Report"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#ef233c]" />
            <span>EXPORT REPORT</span>
          </button>
        </div>
      </div>

      {/* Main Brand & Identity Bar */}
      <div className="px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 bg-black">
        <div className="flex items-center gap-3.5">
          {/* Logo Icon with crimson accent & cyber bevel */}
          <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-white relative shadow-inner group cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#ef233c] shadow-[0_0_8px_#ef233c]" />
            <ShieldAlert className="w-5 h-5 text-[#ef233c]" />
          </div>

          <div>
            <div className="flex items-center gap-2.5">
              <span className="text-lg font-black tracking-tight font-display text-white">
                DIGI<span className="text-[#ef233c]">TAL</span> FORENSIC
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#ef233c]/15 text-[#ef233c] border border-[#ef233c]/30">
                PRO v2.4
              </span>
              <span className="text-zinc-600 font-mono text-[11px] hidden sm:inline">
                ã‚µãƒ ãƒ©ã‚¤ãƒ»é‘‘è­˜
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 font-mono">
              Video Evidence Integrity â€¢ SHA-256 Hashing â€¢ Photogrammetry
            </p>
          </div>
        </div>

        {/* Investigator Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-end font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ef233c]" />
              {user.name}
            </div>
            <div className="text-[10px] text-zinc-500 font-mono">
              BADGE: <span className="text-zinc-400">{user.badgeNumber}</span> â€¢ DFSU UNIT
            </div>
          </div>
          <button
            onClick={onLogout}
            className="text-[11px] font-mono text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-full transition-all cursor-pointer"
            title="Switch or Lock Session"
          >
            LOCK SESSION
          </button>
        </div>
      </div>

      {/* Navigation Pills Bar */}
      <div className="px-4 lg:px-8 border-t border-zinc-900 bg-[#08080a] overflow-x-auto no-scrollbar py-1.5 flex gap-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            activeTab === item.id ||
            (item.id === "player" && activeTab === "analysis") ||
            (item.id === "coc" && activeTab === "custody");

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-black font-bold shadow-[0_0_15px_rgba(255,255,255,0.15)]"
                  : "text-zinc-400 hover:text-white hover:bg-zinc-900/90"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#ef233c]" : "text-zinc-400"}`} />
              <span>{item.label}</span>
              {isActive && (
                <span className="h-1.5 w-1.5 rounded-full bg-[#ef233c] ml-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </header>
  );
};




