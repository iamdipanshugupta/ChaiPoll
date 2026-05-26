import { useForm } from "react-hook-form";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Register = () => {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const [registered, setRegistered] = useState(false);
  const [regEmail, setRegEmail] = useState("");

  const onSubmit = async (data) => {
    try {
      await API.post("/auth/register", data);
      setRegEmail(data.email);
      setRegistered(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  // After register — show "check your email" screen
  if (registered) {
    return (
      <div className="page-gradient min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
          <div className="auth-card animate-fade-up text-center">
            <div className="text-6xl mb-5">📧</div>
            <h2 className="text-2xl font-bold mb-3" style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
              Check your inbox!
            </h2>
            <p className="text-sm mb-2" style={{ color: "var(--text2)" }}>
              We sent a verification link to
            </p>
            <p className="font-semibold mb-6 text-base" style={{ color: "#fb923c" }}>
              {regEmail}
            </p>
            <div className="rounded-xl p-4 mb-6 text-left" style={{ background: "var(--bg3)", border: "1px solid var(--border)" }}>
              <p className="text-sm font-semibold mb-2" style={{ color: "var(--text)" }}>Next steps:</p>
              <ol className="text-sm space-y-1" style={{ color: "var(--text2)" }}>
                <li>1. Open your email inbox</li>
                <li>2. Find the email from <strong>ChaiPoll</strong></li>
                <li>3. Click <strong>"Verify Email Address"</strong></li>
                <li>4. Come back and sign in ☕</li>
              </ol>
            </div>
            <Link to="/login" className="btn btn-primary w-full" style={{ justifyContent: "center" }}>
              Go to Login →
            </Link>
            <p className="text-xs mt-4" style={{ color: "var(--text3)" }}>
              Didn't receive? Check spam or{" "}
              <button className="underline" style={{ color: "#fb923c" }}
                onClick={async () => {
                  try {
                    await API.post("/auth/resend-verification", { email: regEmail });
                    toast.success("Verification email resent!");
                  } catch { toast.error("Failed to resend"); }
                }}>
                resend email
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

          <div className="text-center mb-8">
            <div className="cp-logo text-3xl mb-2">☕ ChaiPoll</div>
            <p className="text-sm" style={{ color: "var(--text3)" }}>Create your account — it's free</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="cp-label">Full name</label>
              <input className="cp-input" placeholder="Rahul Sharma"
                {...register("name", { required: true })} />
            </div>
            <div>
              <label className="cp-label">Email address</label>
              <input type="email" className="cp-input" placeholder="you@example.com"
                {...register("email", { required: true })} />
            </div>
            <div>
              <label className="cp-label">Password</label>
              <input type="password" className="cp-input" placeholder="Min 6 characters"
                {...register("password", { required: true, minLength: 6 })} />
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full mt-2" style={{ padding: "12px" }}>
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : "Create account →"}
            </button>
          </form>

          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { icon: "⚡", text: "Real-time analytics" },
              { icon: "🔒", text: "Anonymous polls" },
              { icon: "⏱️", text: "Expiry control" },
              { icon: "🌐", text: "Publish results" },
            ].map((p) => (
              <div key={p.text} className="flex items-center gap-2 text-xs" style={{ color: "var(--text3)" }}>
                <span>{p.icon}</span> {p.text}
              </div>
            ))}
          </div>

          <p className="text-center text-sm mt-6" style={{ color: "var(--text3)" }}>
            Already have an account?{" "}
            <Link to="/login" className="font-medium" style={{ color: "#fb923c" }}>
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;