import { useEffect, useContext } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Google login failed. Please try again.");
      navigate("/login");
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        login(user, token);
        toast.success(`Welcome, ${user.name}! ☕`);
        navigate("/dashboard");
      } catch {
        toast.error("Something went wrong. Please try again.");
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4"
      style={{ background: "var(--bg)" }}
    >
      <div className="text-5xl">☕</div>
      <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm" style={{ color: "var(--text2)" }}>
        Signing you in with Google…
      </p>
    </div>
  );
};

export default AuthCallback;
