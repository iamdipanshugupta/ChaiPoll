import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

const VerifyOTP = () => {
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  const navigate = useNavigate();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(600); // 10 minutes
  const [timerActive, setTimerActive] = useState(true);
  const inputRefs = useRef([]);

  // Countdown timer
  useEffect(() => {
    if (!timerActive) return;
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) { clearInterval(interval); setTimerActive(false); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive]);

  const formatTime = (s) => `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  // Handle OTP input — auto focus next
  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // only last char
    setOtp(newOtp);
    // Move to next input
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste (paste all 6 digits at once)
  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    const newOtp = [...otp];
    pasted.split("").forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    // Focus last filled input
    const lastIndex = Math.min(pasted.length, 5);
    inputRefs.current[lastIndex]?.focus();
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) return toast.error("Please enter all 6 digits");

    setLoading(true);
    try {
      await API.post("/auth/verify-otp", { email, otp: otpString });
      toast.success("OTP verified! Set your new password.");
      navigate(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid OTP");
      // Shake animation on error
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await API.post("/auth/forgot-password", { email });
      toast.success("New OTP sent!");
      setOtp(["", "", "", "", "", ""]);
      setTimer(600);
      setTimerActive(true);
      inputRefs.current[0]?.focus();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  const isComplete = otp.every((d) => d !== "");

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="auth-card animate-fade-up">

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
              style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.2)" }}>
              🔢
            </div>
            <h2 className="text-2xl font-bold mb-2"
              style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
              Enter OTP
            </h2>
            <p className="text-sm mb-1" style={{ color: "var(--text2)" }}>
              We sent a 6-digit OTP to
            </p>
            <p className="font-semibold text-sm" style={{ color: "#fb923c" }}>
              {email}
            </p>
          </div>

          {/* Timer */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold ${
              timer > 60 ? "" : "animate-pulse"
            }`}
              style={{
                background: timer > 60 ? "rgba(74,222,128,0.1)" : "rgba(239,68,68,0.1)",
                border: `1px solid ${timer > 60 ? "rgba(74,222,128,0.3)" : "rgba(239,68,68,0.3)"}`,
                color: timer > 60 ? "#4ade80" : "#f87171",
              }}>
              ⏱ {timerActive ? `Expires in ${formatTime(timer)}` : "OTP Expired"}
            </div>
          </div>

          {/* OTP Input boxes */}
          <div className="flex gap-3 justify-center mb-8" onPaste={handlePaste}>
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                autoFocus={index === 0}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl transition-all duration-150 focus:outline-none"
                style={{
                  background: "var(--bg3)",
                  border: digit
                    ? "2px solid #f97316"
                    : "1px solid var(--border)",
                  color: "var(--text)",
                  boxShadow: digit ? "0 0 0 3px rgba(249,115,22,0.12)" : "none",
                }}
              />
            ))}
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading || !isComplete || !timerActive}
            className="btn btn-primary w-full mb-4"
            style={{ padding: "13px" }}
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Verifying…
              </span>
            ) : "Verify OTP →"}
          </button>

          {/* Resend */}
          <div className="text-center">
            <p className="text-sm mb-2" style={{ color: "var(--text3)" }}>
              Didn't receive the OTP?
            </p>
            <button
              onClick={handleResend}
              disabled={resending || timerActive}
              className="text-sm font-medium transition"
              style={{
                color: timerActive ? "var(--text3)" : "#fb923c",
                background: "none",
                border: "none",
                cursor: timerActive ? "not-allowed" : "pointer",
              }}
            >
              {resending ? "Sending…" : timerActive ? `Resend in ${formatTime(timer)}` : "Resend OTP"}
            </button>
          </div>

          <div className="cp-divider mt-4" />

          <p className="text-center text-sm" style={{ color: "var(--text3)" }}>
            Wrong email?{" "}
            <Link to="/forgot-password" className="font-medium" style={{ color: "#fb923c" }}>
              Go back
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
