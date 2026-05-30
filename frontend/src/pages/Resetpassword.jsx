import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  // Password strength checker
  const getStrength = (pass) => {
    if (pass.length === 0) return { score: 0, label: "", color: "" };
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 10) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    const levels = [
      { label: "Very weak", color: "#ef4444" },
      { label: "Weak",      color: "#f97316" },
      { label: "Fair",      color: "#eab308" },
      { label: "Good",      color: "#84cc16" },
      { label: "Strong",    color: "#22c55e" },
    ];
    return { score, ...levels[Math.min(score, 4)] };
  };

  const strength = getStrength(newPassword);
  const passwordsMatch = newPassword && confirmPassword && newPassword === confirmPassword;

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword)
      return toast.error("All fields are required");
    if (newPassword.length < 6)
      return toast.error("Password must be at least 6 characters");
    if (newPassword !== confirmPassword)
      return toast.error("Passwords do not match");

    setLoading(true);
    try {
      await API.post("/auth/reset-password", { email, newPassword, confirmPassword });
      setDone(true);
      toast.success("Password reset successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  // Success state
  if (done) {
    return (
      <div className="page-gradient min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
          <div className="auth-card animate-fade-up text-center">
            <div className="text-6xl mb-5">🎉</div>
            <h2 className="text-2xl font-bold mb-3"
              style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
              Password Reset!
            </h2>
            <p className="text-sm mb-8" style={{ color: "var(--text2)" }}>
              Your password has been reset successfully. You can now sign in with your new password.
            </p>
            <Link
              to="/login"
              className="btn btn-primary w-full"
              style={{ justifyContent: "center" }}
            >
              ☕ Sign in now →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="auth-card animate-fade-up">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
              🔑
            </div>
            <h2 className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
              Set New Password
            </h2>
            <p className="text-sm" style={{ color: "var(--text3)" }}>
              Create a strong new password for{" "}
              <span style={{ color: "#fb923c" }}>{email}</span>
            </p>
          </div>

          <form onSubmit={handleReset} className="space-y-5">

            {/* New Password */}
            <div>
              <label className="cp-label">New Password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  className="cp-input pr-12"
                  placeholder="Min 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
                  style={{ color: "var(--text3)", background: "none", border: "none", cursor: "pointer" }}
                >
                  {showNew ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Password strength bar */}
              {newPassword && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
                        style={{ background: i <= strength.score ? strength.color : "var(--bg4)" }} />
                    ))}
                  </div>
                  <p className="text-xs" style={{ color: strength.color }}>
                    {strength.label}
                  </p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="cp-label">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="cp-input pr-12"
                  placeholder="Re-enter password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    borderColor: confirmPassword
                      ? passwordsMatch ? "rgba(74,222,128,0.5)" : "rgba(239,68,68,0.5)"
                      : undefined,
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-lg"
                  style={{ color: "var(--text3)", background: "none", border: "none", cursor: "pointer" }}
                >
                  {showConfirm ? "🙈" : "👁️"}
                </button>
              </div>
              {confirmPassword && (
                <p className="text-xs mt-1" style={{ color: passwordsMatch ? "#4ade80" : "#f87171" }}>
                  {passwordsMatch ? "✓ Passwords match" : "✗ Passwords do not match"}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !passwordsMatch}
              className="btn btn-primary w-full"
              style={{ padding: "13px" }}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting…
                </span>
              ) : "Reset Password →"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text3)" }}>
            Remember it now?{" "}
            <Link to="/login" className="font-medium" style={{ color: "#fb923c" }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
