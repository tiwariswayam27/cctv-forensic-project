import React, { useEffect, useState } from "react";

type PendingUser = {
  id: string;
  name: string;
  email: string;
  username: string;
  badgeNumber: string;
  role: string;
  agency: string;
  is_active: boolean;
};

export function AdminAccessRequests() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("cctv_token");

      const response = await fetch("/api/auth/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(data?.detail || "Unable to load requests.");
      }

      const list = Array.isArray(data)
        ? data
        : data?.users || data?.data || [];

      setUsers(list.filter((u: PendingUser) => !u.is_active));
    } catch (err: any) {
      setError(err?.message || "Unable to load requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const decide = async (
    userId: string,
    action: "approve" | "reject"
  ) => {
    setProcessing(userId);
    setMessage("");
    setError("");

    try {
      const token = localStorage.getItem("cctv_token");

      const response = await fetch(
        `/api/auth/users/${userId}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail || `Unable to ${action} request.`
        );
      }

      setUsers((prev) => prev.filter((u) => u.id !== userId));

      setMessage(
        action === "approve"
          ? "Access request approved successfully."
          : "Access request rejected."
      );
    } catch (err: any) {
      setError(err?.message || "Operation failed.");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="text-[10px] font-mono tracking-[0.25em] text-[#ef233c]">
          ADMINISTRATOR CONTROL
        </div>

        <h1 className="text-2xl font-bold text-white mt-2">
          Access Requests
        </h1>

        <p className="text-sm text-zinc-500 mt-1">
          Review pending forensic personnel registrations.
        </p>
      </div>

      {message && (
        <div className="border border-emerald-900 bg-emerald-950/30 text-emerald-400 rounded-lg px-4 py-3 text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="border border-red-900 bg-red-950/30 text-red-400 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="border border-zinc-800 bg-[#08080a] rounded-xl p-8 text-center text-xs font-mono text-zinc-500">
          LOADING ACCESS REQUESTS...
        </div>
      ) : users.length === 0 ? (
        <div className="border border-zinc-800 bg-[#08080a] rounded-xl p-8 text-center">
          <div className="text-emerald-500 text-sm font-semibold">
            NO PENDING REQUESTS
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <div
              key={user.id}
              className="border border-zinc-800 bg-[#08080a] rounded-xl p-5"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-lg font-semibold text-white">
                      {user.name}
                    </h2>

                    <span className="px-2 py-1 rounded text-[9px] font-mono bg-yellow-950/40 text-yellow-500 border border-yellow-900">
                      PENDING
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mt-3 text-xs">
                    <div>
                      <span className="text-zinc-600">USERNAME: </span>
                      <span className="text-zinc-300">
                        {user.username}
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-600">BADGE: </span>
                      <span className="text-zinc-300">
                        {user.badgeNumber}
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-600">EMAIL: </span>
                      <span className="text-zinc-300">
                        {user.email}
                      </span>
                    </div>

                    <div>
                      <span className="text-zinc-600">ROLE: </span>
                      <span className="text-zinc-300">
                        {user.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    disabled={processing === user.id}
                    onClick={() => decide(user.id, "approve")}
                    className="px-5 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-bold"
                  >
                    {processing === user.id
                      ? "PROCESSING..."
                      : "APPROVE"}
                  </button>

                  <button
                    type="button"
                    disabled={processing === user.id}
                    onClick={() => decide(user.id, "reject")}
                    className="px-5 py-2.5 rounded-lg bg-red-700 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-bold"
                  >
                    {processing === user.id
                      ? "PROCESSING..."
                      : "REJECT"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={loadRequests}
        className="border border-zinc-800 hover:border-zinc-600 bg-zinc-950 px-4 py-2 rounded-lg text-xs font-mono text-zinc-400 hover:text-white"
      >
        REFRESH REQUESTS
      </button>
    </div>
  );
}
