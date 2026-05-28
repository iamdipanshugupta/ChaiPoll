import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const NotFound = () => (
  <div className="page-gradient min-h-screen">
    <Navbar />
    <div className="cp-shell max-w-lg mx-auto text-center py-28 animate-fade-up">
      <div className="text-8xl mb-6 select-none">☕</div>
      <h1 className="text-7xl font-black mb-4" style={{ fontFamily: "'Syne',sans-serif", color: "#f97316" }}>404</h1>
      <h2 className="text-2xl font-semibold mb-3" style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
        Chai spilled… page not found
      </h2>
      <p className="text-sm leading-relaxed mb-10" style={{ color: "var(--text2)" }}>
        The page you're looking for doesn't exist, has been moved, or the URL is incorrect.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link to="/" className="btn btn-primary btn-lg">← Go home</Link>
        <Link to="/create-poll" className="btn btn-secondary btn-lg">Create a poll</Link>
      </div>
    </div>
  </div>
);

export default NotFound;
