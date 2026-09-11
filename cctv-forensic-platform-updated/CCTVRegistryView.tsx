import React, { useState } from "react";
import {
  Camera,
  Plus,
  Radio,
  MapPin,
  Compass,
  CheckCircle2,
  AlertCircle,
  Wrench,
  Search,
  Filter,
} from "lucide-react";
import { CCTVDevice } from "../types";

interface CCTVRegistryViewProps {
  devices: CCTVDevice[];
  onAddDevice: (device: Partial<CCTVDevice>) => Promise<void>;
  onSelectTab: (tab: string) => void;
  onFocusCameraOnMap: (device: CCTVDevice) => void;
}

export const CCTVRegistryView: React.FC<CCTVRegistryViewProps> = ({
  devices = [],
  onAddDevice,
  onSelectTab,
  onFocusCameraOnMap,
}) => {
  const safeDevices = Array.isArray(devices) ? devices : [];
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [vendorFilter, setVendorFilter] = useState("all");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    vendor: "Hikvision",
    model: "DS-2CD2087G2-LU (ColorVu)",
    location: "Market Road & North Avenue",
    latitude: 40.7135,
    longitude: -74.0055,
    ip_address: "192.168.10.105",
    channel: 1,
    status: "Active" as "Active" | "Offline" | "Maintenance",
    direction: 180,
    coverage_radius: 50,
  });

  const filteredDevices = safeDevices.filter((d) => {
    if (!d) return false;
    const name = d.name || "";
    const loc = d.location || "";
    const id = d.cctv_id || "";
    const vendor = d.vendor || "";
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVendor = vendorFilter === "all" || vendor.toLowerCase() === vendorFilter.toLowerCase();
    return matchesSearch && matchesVendor;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.location.trim()) return;

    setIsSubmitting(true);
    try {
      await onAddDevice(formData);
      setShowModal(false);
      setFormData({
        name: "",
        vendor: "Hikvision",
        model: "DS-2CD2087G2-LU (ColorVu)",
        location: "Market Road",
        latitude: 40.7135,
        longitude: -74.0055,
        ip_address: `192.168.10.${110 + devices.length}`,
        channel: 1,
        status: "Active",
        direction: 180,
        coverage_radius: 50,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white tracking-tight">
              Surveillance Camera Registry
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Maintain high-precision optical device parameters, vendor firmware specs, IP endpoints, and spatial geometry.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onSelectTab("map")}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3.5 py-2 rounded-lg border border-slate-700 transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
            View GIS Map
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-3.5 py-2 rounded-lg shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            + Add CCTV
          </button>
        </div>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-lg">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by CCTV ID, name, location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={vendorFilter}
            onChange={(e) => setVendorFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-cyan-500"
          >
            <option value="all">All Vendors</option>
            <option value="Hikvision">Hikvision</option>
            <option value="Dahua">Dahua</option>
            <option value="Axis Communications">Axis Communications</option>
            <option value="Hanwha Techwin">Hanwha Techwin</option>
          </select>
        </div>
      </div>

      {/* Cameras Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4 font-medium">CCTV ID</th>
                <th className="py-3 px-4 font-medium">Camera Name & Location</th>
                <th className="py-3 px-4 font-medium">Vendor & Model</th>
                <th className="py-3 px-4 font-medium">Network / Channel</th>
                <th className="py-3 px-4 font-medium">GPS Coordinates</th>
                <th className="py-3 px-4 font-medium">FOV Direction</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDevices.map((d) => (
                <tr key={d.cctv_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-cyan-400">
                    {d.cctv_id}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-100">{d.name}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                      {d.location}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-200">{d.vendor}</span>
                    <span className="text-[11px] text-slate-400 block">{d.model}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-300">
                    <div>{d.ip_address}</div>
                    <span className="text-slate-400">Ch: {d.channel}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                    <div>{d.latitude.toFixed(4)}° N</div>
                    <div>{d.longitude.toFixed(4)}° W</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-slate-400" />
                      <span>{d.direction}°</span>
                      <span className="text-[10px] text-slate-400">({d.coverage_radius}m)</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium ${
                        d.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : d.status === "Maintenance"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {d.status === "Active" ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : d.status === "Maintenance" ? (
                        <Wrench className="w-3 h-3" />
                      ) : (
                        <AlertCircle className="w-3 h-3" />
                      )}
                      {d.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => {
                        onFocusCameraOnMap(d);
                        onSelectTab("map");
                      }}
                      className="text-xs text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 px-2.5 py-1 rounded transition-colors"
                    >
                      Locate on Map
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add CCTV Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Register Surveillance Camera</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Camera Name *</label>
                <input
                  type="text"
                  placeholder="e.g., North Market Intersection Cam"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Vendor *</label>
                  <select
                    value={formData.vendor}
                    onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Hikvision">Hikvision</option>
                    <option value="Dahua">Dahua</option>
                    <option value="Axis Communications">Axis Communications</option>
                    <option value="Hanwha Techwin">Hanwha Techwin</option>
                    <option value="Bosch Security">Bosch Security</option>
                    <option value="Other / Generic NVR">Other / Generic NVR</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Model Spec</label>
                  <input
                    type="text"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Physical Location Description *</label>
                <input
                  type="text"
                  placeholder="e.g., Market Road (North Facing Lamp Post)"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="0.0001"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">IP Address</label>
                  <input
                    type="text"
                    value={formData.ip_address}
                    onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Channel No.</label>
                  <input
                    type="number"
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: parseInt(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:border-cyan-500 focus:outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Offline">Offline</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">FOV Heading (Degrees 0-360°)</label>
                  <input
                    type="number"
                    value={formData.direction}
                    onChange={(e) => setFormData({ ...formData, direction: parseInt(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Coverage Radius (meters)</label>
                  <input
                    type="number"
                    value={formData.coverage_radius}
                    onChange={(e) => setFormData({ ...formData, coverage_radius: parseInt(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 font-mono focus:border-cyan-500 focus:outline-none"
                  />
                </div>
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
                  className="px-5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors font-semibold shadow-sm"
                >
                  {isSubmitting ? "Saving..." : "Save to Registry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
