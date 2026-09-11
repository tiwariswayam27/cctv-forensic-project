import React, { useState } from "react";

interface AuthUser {
  id: string;
  email: string;
  username: string;
  name: string;
  badgeNumber: string;
  role: string;
  agency: string;
  avatar?: string;
  is_active: boolean;
}

interface AuthViewProps {
  onAuthenticated: (user: AuthUser, token: string) => void;
}

const AuthView: React.FC<AuthViewProps> = ({ onAuthenticated }) => {
  const [mode, setMode] = useState<"login" | "register">("login");

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [badgeNumber, setBadgeNumber] = useState("");
  const [agency, setAgency] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const resetMessages = () => {
    setMessage("");
    setError("");
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (!usernameOrEmail || !password) {
      setError("Enter your username/email and password.");
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
          username_or_email: usernameOrEmail,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Authentication failed. Please verify your credentials."
        );
      }

      localStorage.setItem("cctv_token", data.access_token);
      localStorage.setItem("cctv_user", JSON.stringify(data.user));

      onAuthenticated(data.user, data.access_token);
    } catch (err: any) {
      setError(err.message || "Unable to connect to the forensic server.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    resetMessages();

    if (
      !name ||
      !username ||
      !email ||
      !badgeNumber ||
      !agency ||
      !registerPassword
    ) {
      setError("Complete all required registration fields.");
      return;
    }

    if (registerPassword.length < 8) {
      setError("Password must contain at least 8 characters.");
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
          name,
          username,
          email,
          badgeNumber,
          agency,
          role: "Forensic Analyst",
          password: registerPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.detail || "Registration request could not be submitted."
        );
      }

      setMessage(
        "Registration request submitted successfully. An Administrator must approve your forensic account before you can sign in."
      );

      setName("");
      setUsername("");
      setEmail("");
      setBadgeNumber("");
      setAgency("");
      setRegisterPassword("");
    } catch (err: any) {
      setError(err.message || "Unable to submit registration request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07111f] text-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-5xl grid md:grid-cols-2 bg-[#0b1728] border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">

        {/* LEFT PANEL */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-[#091522] border-r border-slate-700">
          <div>
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center">
                <span className="text-cyan-400 text-xl font-bold">CF</span>
              </div>

              <div>
                <h1 className="font-bold text-lg tracking-wide">
                  CCTV FORENSIC
                </h1>
                <p className="text-xs text-slate-400">
                  DIGITAL EVIDENCE PLATFORM
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-xs text-cyan-400 font-semibold tracking-widest">
                  SECURE FORENSIC ACCESS
                </p>

                <h2 className="text-3xl font-bold mt-3 leading-tight">
                  Judicial & Forensic
                  <br />
                  Video Intelligence
                </h2>

                <p className="text-slate-400 mt-5 leading-relaxed">
                  Secure access to CCTV evidence, investigation records,
                  forensic analysis, chain of custody and reporting modules.
                </p>
              </div>

              <div className="space-y-3 text-sm text-slate-300">
                <div className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  Authenticated forensic personnel
                </div>

                <div className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  Role-based investigation access
                </div>

                <div className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  Evidence and chain-of-custody controls
                </div>

                <div className="flex gap-3">
                  <span className="text-cyan-400">✓</span>
                  Audit-ready forensic workflow
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            Authorized personnel only • CCTV Forensic Platform
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="p-7 md:p-10">
          <div className="flex justify-between items-start mb-8">
            <div>
              <p className="text-xs text-cyan-400 tracking-widest font-semibold">
                AUTHENTICATION
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {mode === "login"
                  ? "Sign in to the platform"
                  : "Request forensic access"}
              </h2>

              <p className="text-sm text-slate-400 mt-2">
                {mode === "login"
                  ? "Use your authorized forensic account."
                  : "New accounts require Administrator approval."}
              </p>
            </div>
          </div>

          {/* MODE SWITCH */}
          <div className="flex bg-[#07111f] border border-slate-700 rounded-lg p-1 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                resetMessages();
              }}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition ${
                mode === "login"
                  ? "bg-cyan-500 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => {
                setMode("register");
                resetMessages();
              }}
              className={`flex-1 py-2.5 rounded-md text-sm font-medium transition ${
                mode === "register"
                  ? "bg-cyan-500 text-slate-950"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Request Access
            </button>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-5 p-3 rounded-lg border border-red-500/30 bg-red-500/10 text-red-300 text-sm">
              {error}
            </div>
          )}

          {/* SUCCESS */}
          {message && (
            <div className="mb-5 p-3 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-300 text-sm leading-relaxed">
              {message}
            </div>
          )}

          {/* LOGIN */}
          {mode === "login" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Username or Email
                </label>

                <input
                  type="text"
                  value={usernameOrEmail}
                  onChange={(e) => setUsernameOrEmail(e.target.value)}
                  placeholder="Enter username or email"
                  autoComplete="username"
                  className="w-full px-4 py-3 rounded-lg bg-[#07111f] border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Password
                </label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full px-4 py-3 rounded-lg bg-[#07111f] border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-cyan-400"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold transition"
              >
                {loading ? "AUTHENTICATING..." : "SIGN IN"}
              </button>

              <p className="text-xs text-center text-slate-500">
                Access is restricted to authorized forensic personnel.
              </p>
            </form>
          ) : (
            /* REGISTER */
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Full Name *
                  </label>

                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full name"
                    className="auth-input"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Username *
                  </label>

                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                    className="auth-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Official Email *
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="official@email.com"
                  className="auth-input"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Badge / ID Number *
                  </label>

                  <input
                    type="text"
                    value={badgeNumber}
                    onChange={(e) => setBadgeNumber(e.target.value)}
                    placeholder="Badge or employee ID"
                    className="auth-input"
                  />
                </div>

                <div>
                  <label className="block text-sm text-slate-300 mb-2">
                    Agency / Department *
                  </label>

                  <input
                    type="text"
                    value={agency}
                    onChange={(e) => setAgency(e.target.value)}
                    placeholder="Agency / department"
                    className="auth-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-300 mb-2">
                  Password *
                </label>

                <input
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  autoComplete="new-password"
                  className="auth-input"
                />
              </div>

              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
                Registration creates a pending Forensic Analyst account.
                Administrator approval is required before login.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-bold transition"
              >
                {loading ? "SUBMITTING..." : "REQUEST ACCESS"}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        .auth-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 0.5rem;
          background: #07111f;
          border: 1px solid #334155;
          color: white;
          outline: none;
        }

        .auth-input::placeholder {
          color: #64748b;
        }

        .auth-input:focus {
          border-color: #22d3ee;
        }
      `}</style>
    </div>
  );
};

export default AuthView;
