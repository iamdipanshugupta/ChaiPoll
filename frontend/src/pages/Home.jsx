import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const features = [
  {
    icon: "⚡",
    title: "Real-time responses",
    desc: "Watch votes roll in live with Socket.io powered WebSocket updates.",
  },
  {
    icon: "🔒",
    title: "Anonymous or authenticated",
    desc: "Choose who can respond — anyone anonymously or verified users only.",
  },
  {
    icon: "⏱️",
    title: "Expiry control",
    desc: "Set a deadline. Polls auto-close when time runs out.",
  },
  {
    icon: "📊",
    title: "Analytics dashboard",
    desc: "Per-question bar charts, option counts and participation insights.",
  },
  {
    icon: "🌐",
    title: "Publish results",
    desc: "Share final outcomes publicly — anyone with the link can view.",
  },
  {
    icon: "📱",
    title: "Fully responsive",
    desc: "Works beautifully on mobile, tablet and desktop.",
  },
];

const steps = [
  { num: "01", title: "Create a poll", desc: "Add questions, options and set expiry time." },
  { num: "02", title: "Share the link", desc: "Send the unique poll link to anyone you want." },
  { num: "03", title: "Collect feedback", desc: "Respondents answer in seconds — no account needed (if anonymous)." },
  { num: "04", title: "Analyse & publish", desc: "View live analytics and publish final results publicly." },
];

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="hero-gradient min-h-screen noise">
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative pt-24 pb-32 px-4 text-center overflow-hidden">
        {/* Glow blobs */}
        <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.12) 0%, transparent 70%)" }} />
        <div className="pointer-events-none absolute top-40 right-0 w-[400px] h-[300px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)" }} />

        <div className="animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/8 px-4 py-1.5 text-xs font-semibold text-orange-400 mb-8">
            <span className="live-dot" /> Real-time polling platform
          </span>
        </div>

        <h1
          className="animate-fade-up mx-auto max-w-3xl text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-white mb-6"
          style={{ animationDelay: "0.1s", fontFamily: "'Syne', sans-serif" }}
        >
          Polls that taste as{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #f97316, #fb923c, #fbbf24)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            good as chai ☕
          </span>
        </h1>

        <p
          className="animate-fade-up mx-auto max-w-lg text-neutral-400 text-lg mb-10 leading-relaxed"
          style={{ animationDelay: "0.15s" }}
        >
          Create, share and collect feedback in minutes. Anonymous responses, live analytics, expiry control and public result publishing — all brewed in one place.
        </p>

        <div className="animate-fade-up flex flex-wrap items-center justify-center gap-4" style={{ animationDelay: "0.2s" }}>
          {user ? (
            <>
              <Link to="/create-poll" className="btn btn-primary btn-lg">
                ➕ Create a poll
              </Link>
              <Link to="/dashboard" className="btn btn-secondary btn-lg">
                My Dashboard →
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary btn-lg">
                Start for free →
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign in
              </Link>
            </>
          )}
        </div>

        {/* Hero mock card */}
        <div className="animate-fade-up mx-auto mt-16 max-w-sm" style={{ animationDelay: "0.3s" }}>
          <div className="cp-card cp-card-glow text-left">
            <p className="text-xs text-orange-400 font-semibold mb-3 uppercase tracking-wider">Live poll preview</p>
            <h3 className="text-white font-semibold mb-4">What's your favourite chai?</h3>
            {["Masala Chai ☕", "Ginger Chai 🌿", "Cutting Chai ✂️", "Kashmiri Kahwa 🌸"].map((opt, i) => (
              <div key={i} className="mb-2">
                <div className="flex justify-between text-xs mb-1 text-neutral-400">
                  <span>{opt}</span>
                  <span>{[42, 28, 18, 12][i]}%</span>
                </div>
                <div className="cp-progress-bg">
                  <div className="cp-progress-fill" style={{ width: `${[42, 28, 18, 12][i]}%` }} />
                </div>
              </div>
            ))}
            <div className="mt-4 flex items-center gap-2 text-xs text-neutral-500">
              <span className="live-dot" />
              <span>127 responses · live</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="px-4 pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-14 animate-fade-up">
            <p className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-3">Features</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Syne',sans-serif" }}>
              Everything you need to collect feedback
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 stagger">
            {features.map((f) => (
              <div key={f.title} className="cp-card group">
                <div className="w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/15 flex items-center justify-center text-2xl mb-4 group-hover:bg-orange-500/15 transition">
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="px-4 pb-24 border-t border-white/5">
        <div className="mx-auto max-w-4xl pt-20">
          <div className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-orange-500 font-semibold mb-3">How it works</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Syne',sans-serif" }}>
              Four sips to feedback
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 stagger">
            {steps.map((s) => (
              <div key={s.num} className="cp-card flex gap-5">
                <div className="text-3xl font-black text-orange-500/25" style={{ fontFamily: "'Syne',sans-serif" }}>{s.num}</div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{s.title}</h3>
                  <p className="text-sm text-neutral-400">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="px-4 pb-32">
        <div className="mx-auto max-w-2xl text-center">
          <div className="cp-card" style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.07), rgba(124,58,237,0.05))", borderColor: "rgba(249,115,22,0.18)" }}>
            <h2 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>
              Ready to brew your first poll? ☕
            </h2>
            <p className="text-neutral-400 mb-8">
              Join developers and teams who use ChaiPoll to collect fast, honest feedback.
            </p>
            {user ? (
              <Link to="/create-poll" className="btn btn-primary btn-lg">
                ➕ Create a poll now
              </Link>
            ) : (
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register" className="btn btn-primary btn-lg">Get started free →</Link>
                <Link to="/login" className="btn btn-secondary btn-lg">Sign in</Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 px-4 py-10">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="cp-logo text-xl">☕ ChaiPoll</div>
          <p className="text-xs text-neutral-500">© 2025 ChaiPoll. Built for the hackathon with ❤️</p>
          <div className="flex gap-3">
            {[
              { href: "https://github.com/iamdipanshugupta", icon: <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg> },
              { href: "https://x.com/Dipansh04205800", icon: <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
              { href: "https://www.linkedin.com/in/dipanshu-kumar-sah-08302b331/", icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
            ].map((s, i) => (
              <a key={i} href={s.href} target="_blank" rel="noreferrer" className="social-btn">{s.icon}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;