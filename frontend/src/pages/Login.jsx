import { useForm } from "react-hook-form";
import API from "../api/axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const [needsVerification, setNeedsVerification] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [resending, setResending] = useState(false);

  // Email verification redirect handle
  useEffect(() => {
    const verified = searchParams.get("verified");
    const error = searchParams.get("error");
    if (verified === "true") toast.success("✅ Email verified! You can now sign in.");
    else if (verified === "false") toast.error("❌ Verification link expired. Try resending.");
    else if (error === "google_failed") toast.error("Google login failed. Please try again.");
  }, []);

  const onSubmit = async (data) => {
    try {
      const res = await API.post("/auth/login", data);
      login(res.data.user, res.data.token);
      toast.success("Welcome back! ☕");
      navigate("/dashboard");
    } catch (err) {
      const msg = err.response?.data?.message || "Login failed";
      if (err.response?.data?.needsVerification) {
        setNeedsVerification(true);
        setUnverifiedEmail(err.response.data.email || data.email);
        toast.error("Please verify your email first.");
      } else {
        toast.error(msg);
      }
    }
  };

  const resendVerification = async () => {
    if (!unverifiedEmail) return;
    setResending(true);
    try {
      await API.post("/auth/resend-verification", { email: unverifiedEmail });
      toast.success("Verification email sent! Check your inbox.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to resend");
    } finally {
      setResending(false);
    }
  };

  // Google OAuth — backend pe redirect karo
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`;
  };

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="auth-card animate-fade-up">

          <div className="text-center mb-8">
            <div className="cp-logo text-3xl mb-2">☕ ChaiPoll</div>
            <p className="text-sm" style={{ color: "var(--text3)" }}>
              Welcome back — sign in to continue
            </p>
          </div>

          {/* Google OAuth Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-3 rounded-xl font-semibold text-sm transition-all duration-200 mb-5"
            style={{
              background: "var(--bg3)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            onMouseOver={(e) => e.currentTarget.style.borderColor = "rgba(249,115,22,0.4)"}
            onMouseOut={(e) => e.currentTarget.style.borderColor = "var(--border)"}
          >
            {/* Google SVG Icon */}
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115z"/>
              <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 01-6.723-4.823l-4.04 3.067A11.965 11.965 0 0012 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987z"/>
              <path fill="#4A90E2" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21z"/>
              <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 014.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 000 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067z"/>
            </svg>
            Continue with Google
          </button>

          <div className="cp-divider">or sign in with email</div>

          {/* Email not verified banner */}
          {needsVerification && (
            <div className="rounded-xl p-4 mb-5"
              style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.25)" }}>
              <div className="flex items-start gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <p className="text-sm font-semibold mb-1" style={{ color: "#fb923c" }}>
                    Email not verified
                  </p>
                  <p className="text-xs mb-3" style={{ color: "var(--text2)" }}>
                    Check your inbox for <strong>{unverifiedEmail}</strong> and click the verification link.
                  </p>
                  <button
                    onClick={resendVerification}
                    disabled={resending}
                    className="btn btn-outline btn-sm text-xs"
                  >
                    {resending ? "Sending…" : "Resend verification email"}
                  </button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="cp-label">Email address</label>
              <input
                type="email"
                className="cp-input"
                placeholder="you@example.com"
                {...register("email", { required: true })}
              />
            </div>
            <div>
              <label className="cp-label">Password</label>
              <input
                type="password"
                className="cp-input"
                placeholder="••••••••"
                {...register("password", { required: true })}
              />
              <div className="flex justify-end mt-1.5">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium"
                  style={{ color: "#fb923c" }}
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full"
              style={{ padding: "12px" }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in…
                </span>
              ) : "Sign in →"}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text3)" }}>
            Don't have an account?{" "}
            <Link to="/register" className="font-medium" style={{ color: "#fb923c" }}>
              Sign up free →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
