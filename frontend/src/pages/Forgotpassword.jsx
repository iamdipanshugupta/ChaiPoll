import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return toast.error("Email is required");

    setLoading(true);
    try {
      await API.post("/auth/forgot-password", { email });
      setSent(true);
      toast.success("OTP sent to your email!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // After OTP sent — show success state
  if (sent) {
    return (
      <div className="page-gradient min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
          <div className="auth-card animate-fade-up text-center">
            <div className="text-6xl mb-5">📧</div>
            <h2 className="text-2xl font-bold mb-3"
              style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
              OTP Sent!
            </h2>
            <p className="text-sm mb-2" style={{ color: "var(--text2)" }}>
              We sent a 6-digit OTP to
            </p>
            <p className="font-semibold text-base mb-6" style={{ color: "#fb923c" }}>
              {email}
            </p>

            <div className="rounded-xl p-4 mb-6 text-left"
              style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}>
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>Next steps:</p>
              <ol className="text-sm space-y-1" style={{ color: "var(--text2)" }}>
                <li>1. Open your email inbox</li>
                <li>2. Find the OTP from <strong>ChaiPoll</strong></li>
                <li>3. Enter the 6-digit code on the next page</li>
                <li>4. Set your new password ☕</li>
              </ol>
            </div>

            <Link
              to={`/verify-otp?email=${encodeURIComponent(email)}`}
              className="btn btn-primary w-full"
              style={{ justifyContent: "center" }}
            >
              Enter OTP →
            </Link>

            <p className="text-xs mt-4" style={{ color: "var(--text3)" }}>
              Didn't receive?{" "}
              <button
                onClick={() => { setSent(false); setLoading(false); }}
                className="underline"
                style={{ color: "#fb923c", background: "none", border: "none", cursor: "pointer" }}
              >
                Try again
              </button>
            </p>
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
              🔐
            </div>
            <h2 className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
              Forgot Password?
            </h2>
            <p className="text-sm" style={{ color: "var(--text3)" }}>
              Enter your email — we'll send a 6-digit OTP to reset your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="cp-label">Email address</label>
              <input
                type="email"
                className="cp-input"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full"
              style={{ padding: "12px" }}
            >
              {loading ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending OTP…
                </span>
              ) : "Send OTP →"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text3)" }}>
            Remember your password?{" "}
            <Link to="/login" className="font-medium" style={{ color: "#fb923c" }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
