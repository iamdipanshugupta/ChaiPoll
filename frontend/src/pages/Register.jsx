import { useForm } from "react-hook-form";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await API.post("/auth/register", data);
      toast.success("Account created! Please sign in ☕");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center min-h-[calc(100vh-64px)] px-4 py-12">
        <div className="auth-card animate-fade-up w-full">
          <div className="text-center mb-8">
            <div className="cp-logo text-3xl mb-2">☕ ChaiPoll</div>
            <p className="text-neutral-400 text-sm">Create your account — it's free</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="cp-label">Full name</label>
              <input
                className="cp-input"
                placeholder="Rahul Sharma"
                {...register("name", { required: true })}
              />
            </div>

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
                placeholder="Min 6 characters"
                {...register("password", { required: true, minLength: 6 })}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary w-full mt-2"
              style={{ padding: "12px" }}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account…
                </span>
              ) : "Create account →"}
            </button>
          </form>

          {/* Perks */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { icon: "⚡", text: "Real-time analytics" },
              { icon: "🔒", text: "Anonymous polls" },
              { icon: "⏱️", text: "Expiry control" },
              { icon: "🌐", text: "Publish results" },
            ].map((p) => (
              <div key={p.text} className="flex items-center gap-2 text-xs text-neutral-400">
                <span>{p.icon}</span> {p.text}
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-orange-400 hover:text-orange-300 font-medium transition">
              Sign in →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;