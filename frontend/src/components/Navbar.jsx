import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { dark, toggle } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); setMenuOpen(false); };

  const navLinks = user
    ? [{ to: "/dashboard", label: "Dashboard" }, { to: "/create-poll", label: "Create Poll" }]
    : [{ to: "/", label: "Home" }];

  const isActive = (to) => to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  const SocialIcons = () => (
    <div className="flex gap-2">
      {[
        { href: "https://github.com", title: "GitHub", icon: <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg> },
        { href: "https://twitter.com", title: "Twitter", icon: <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
        { href: "https://linkedin.com", title: "LinkedIn", icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
      ].map((s) => (
        <a key={s.title} href={s.href} target="_blank" rel="noreferrer" className="social-btn" title={s.title}>{s.icon}</a>
      ))}
    </div>
  );

  return (
    <header className="cp-navbar">
      <div className="cp-navbar-inner">
        <Link to="/" className="cp-logo flex items-center gap-2">
          <span>☕</span><span>ChaiPoll</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => (
            <Link key={l.to} to={l.to}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive(l.to) ? "bg-orange-500/12 text-orange-400" : "hover:text-white hover:bg-white/6"}`}
              style={{ color: isActive(l.to) ? "#fb923c" : "var(--text2)" }}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <SocialIcons />
          <div className="w-px h-5" style={{ background: "var(--border)" }} />

          {/* Dark mode toggle */}
          <button onClick={toggle} className="dm-toggle" title={dark ? "Switch to light mode" : "Switch to dark mode"}>
            {dark ? "☀️" : "🌙"}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-xs font-bold text-white">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="text-sm font-medium" style={{ color: "var(--text2)" }}>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn btn-ghost btn-sm">Sign out</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="btn btn-ghost btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get started</Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button onClick={toggle} className="dm-toggle">{dark ? "☀️" : "🌙"}</button>
          <button className="flex flex-col gap-1 p-2 rounded-lg" style={{ background: "var(--surface)" }} onClick={() => setMenuOpen(!menuOpen)}>
            <span className={`w-5 h-0.5 transition-all duration-200 ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} style={{ background: "var(--text)" }} />
            <span className={`w-5 h-0.5 transition-all duration-200 ${menuOpen ? "opacity-0" : ""}`} style={{ background: "var(--text)" }} />
            <span className={`w-5 h-0.5 transition-all duration-200 ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} style={{ background: "var(--text)" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden animate-fade-in" style={{ borderTop: "1px solid var(--border)", background: "var(--bg2)" }}>
          <div className="px-4 py-4 flex flex-col gap-2">
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to} onClick={() => setMenuOpen(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition"
                style={{ color: isActive(l.to) ? "#fb923c" : "var(--text2)", background: isActive(l.to) ? "rgba(249,115,22,0.08)" : "transparent" }}>
                {l.label}
              </Link>
            ))}
            <div style={{ borderTop: "1px solid var(--border)" }} className="pt-3 mt-1">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: "var(--text2)" }}>Hi, {user.name}</span>
                  <button onClick={handleLogout} className="btn btn-danger btn-sm">Sign out</button>
                </div>
              ) : (
                <div className="flex gap-2 w-full">
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="btn btn-ghost btn-sm flex-1">Login</Link>
                  <Link to="/register" onClick={() => setMenuOpen(false)} className="btn btn-primary btn-sm flex-1">Register</Link>
                </div>
              )}
            </div>
            <div className="pt-2"><SocialIcons /></div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
