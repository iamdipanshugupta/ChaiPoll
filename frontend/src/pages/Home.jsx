import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const features = [
  { icon: "⚡", title: "Real-time responses", desc: "Watch votes roll in live with Socket.io WebSocket updates." },
  { icon: "🔒", title: "Anonymous or authenticated", desc: "Choose who can respond — open to all or verified users only." },
  { icon: "⏱️", title: "Expiry & countdown", desc: "Set a deadline. A live countdown shows time remaining." },
  { icon: "📊", title: "Analytics dashboard", desc: "Bar charts, option counts, winner highlights and completion rate." },
  { icon: "📱", title: "QR Code sharing", desc: "Generate a QR code — anyone can scan and respond instantly." },
  { icon: "🌐", title: "Publish results", desc: "Share final outcomes publicly through the same poll link." },
  { icon: "📄", title: "Export PDF", desc: "Download a beautiful analytics report as a PDF with one click." },
  { icon: "🌙", title: "Dark & Light mode", desc: "Switch between dark and light themes — preference is saved." },
];

const steps = [
  { num: "01", title: "Create a poll", desc: "Add questions, set options, pick expiry and response mode." },
  { num: "02", title: "Share the link or QR", desc: "Copy the link or scan the QR code — share anywhere." },
  { num: "03", title: "Collect feedback", desc: "Respondents answer in seconds — no account needed for anonymous polls." },
  { num: "04", title: "Analyse & publish", desc: "View live analytics and publish final results publicly." },
];

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="hero-gradient min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-20 pb-28 px-4 text-center overflow-hidden">
        <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse,rgba(249,115,22,0.13) 0%,transparent 70%)" }} />

        <div className="animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <span className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold mb-8"
            style={{ borderColor: "rgba(249,115,22,0.25)", background: "rgba(249,115,22,0.08)", color: "#fb923c" }}>
            <span className="live-dot" /> Real-time polling platform
          </span>
        </div>

        <h1 className="animate-fade-up mx-auto max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          style={{ animationDelay: "0.1s", fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
          Polls that taste as{" "}
          <span style={{ background: "linear-gradient(135deg,#f97316,#fb923c,#fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
            good as chai ☕
          </span>
        </h1>

        <p className="animate-fade-up mx-auto max-w-lg text-lg mb-10 leading-relaxed"
          style={{ animationDelay: "0.15s", color: "var(--text2)" }}>
          Create, share and collect feedback in minutes. Live analytics, QR sharing, expiry countdown, PDF export and public result publishing — all in one place.
        </p>

        <div className="animate-fade-up flex flex-wrap items-center justify-center gap-4"
          style={{ animationDelay: "0.2s" }}>
          {user ? (
            <>
              <Link to="/create-poll" className="btn btn-primary btn-lg">➕ Create a poll</Link>
              <Link to="/dashboard" className="btn btn-secondary btn-lg">My Dashboard →</Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">Start for free →</Link>
              <Link to="/login" className="btn btn-secondary btn-lg">Sign in</Link>
            </>
          )}
        </div>

        {/* Mock poll card */}
        <div className="animate-fade-up mx-auto mt-16 max-w-sm text-left" style={{ animationDelay: "0.3s" }}>
          <div className="cp-card">
            <p className="text-xs font-semibold mb-3 uppercase tracking-wider" style={{ color: "#fb923c" }}>Live poll preview</p>
            <h3 className="font-semibold mb-4" style={{ color: "var(--text)" }}>What's your favourite chai?</h3>
            {[["Masala Chai ☕", 42], ["Ginger Chai 🌿", 28], ["Cutting Chai ✂️", 18], ["Kashmiri Kahwa 🌸", 12]].map(([opt, pct]) => (
              <div key={opt} className="mb-2">
                <div className="flex justify-between text-xs mb-1" style={{ color: "var(--text2)" }}>
                  <span>{opt}</span><span>{pct}%</span>
                </div>
                <div className="cp-progress-bg">
                  <div className="cp-progress-fill" style={{ width: `${pct}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-4 flex items-center gap-2 text-xs" style={{ color: "var(--text3)" }}>
              <span className="live-dot" /><span>127 responses · live</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "#f97316" }}>Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
              Everything you need to collect feedback
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger">
            {features.map((f) => (
              <div key={f.title} className="cp-card group">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4 transition"
                  style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.15)" }}>
                  {f.icon}
                </div>
                <h3 className="font-semibold mb-2" style={{ color: "var(--text)" }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--text3)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 pb-24" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-4xl pt-20">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "#f97316" }}>How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
              Four sips to feedback
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 stagger">
            {steps.map((s) => (
              <div key={s.num} className="cp-card flex gap-5">
                <div className="text-3xl font-black flex-shrink-0" style={{ fontFamily: "'Syne',sans-serif", color: "rgba(249,115,22,0.25)" }}>
                  {s.num}
                </div>
                <div>
                  <h3 className="font-semibold mb-1" style={{ color: "var(--text)" }}>{s.title}</h3>
                  <p className="text-sm" style={{ color: "var(--text3)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 pb-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="cp-card" style={{ background: "linear-gradient(135deg,rgba(249,115,22,0.07),rgba(124,58,237,0.05))", borderColor: "rgba(249,115,22,0.2)" }}>
            <h2 className="text-3xl font-bold mb-3" style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
              Ready to brew your first poll? ☕
            </h2>
            <p className="mb-8" style={{ color: "var(--text2)" }}>
              Join developers and teams who use ChaiPoll to collect fast, honest feedback.
            </p>
            {user ? (
              <Link to="/create-poll" className="btn btn-primary btn-lg">➕ Create a poll now</Link>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register" className="btn btn-primary btn-lg">Get started free →</Link>
                <Link to="/login" className="btn btn-secondary btn-lg">Sign in</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-10" style={{ borderTop: "1px solid var(--border)" }}>
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="cp-logo text-xl">☕ ChaiPoll</div>
          <p className="text-xs" style={{ color: "var(--text3)" }}>© 2025 ChaiPoll. Built with ❤️ for the hackathon.</p>
          <div className="flex gap-3">
            {[
              { href: "https://github.com", svg: <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg> },
              { href: "https://twitter.com", svg: <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
              { href: "https://linkedin.com", svg: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
            ].map((s, i) => <a key={i} href={s.href} target="_blank" rel="noreferrer" className="social-btn">{s.svg}</a>)}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
