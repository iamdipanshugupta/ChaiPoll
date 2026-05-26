import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PollStatusBadge from "../components/PollStatusBadge";
import QRShare from "../components/QRShare";
import CountdownTimer from "../components/CountdownTimer";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [qrPoll, setQrPoll] = useState(null);

  const fetchPolls = async () => {
    try {
      const res = await API.get("/polls/my-polls");
      setPolls(res.data.polls);
    } catch {
      toast.error("Failed to load polls");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPolls(); }, []);

  const deletePoll = async (id, e) => {
    e.stopPropagation();
    if (!confirm("Delete this poll? This cannot be undone.")) return;
    try {
      await API.delete(`/polls/${id}`);
      toast.success("Poll deleted");
      fetchPolls();
    } catch { toast.error("Delete failed"); }
  };

  const copyLink = (code, e) => {
    e?.stopPropagation();
    navigator.clipboard.writeText(`${window.location.origin}/poll/${code}`)
      .then(() => toast.success("Link copied! 🔗"));
  };

  const isExpired = (expiresAt) => new Date(expiresAt) < new Date();

  const stats = {
    total: polls.length,
    active: polls.filter(p => !isExpired(p.expiresAt) && !p.ispublished).length,
    expired: polls.filter(p => isExpired(p.expiresAt)).length,
    published: polls.filter(p => p.ispublished).length,
  };

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />

      {/* QR Modal */}
      {qrPoll && (
        <QRShare
          pollCode={qrPoll.pollCode}
          title={qrPoll.title}
          onClose={() => setQrPoll(null)}
        />
      )}

      <div className="cp-shell">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-up">
          <div>
            <h1 className="cp-page-title">Welcome back, {user?.name?.split(" ")[0]} 👋</h1>
            <p className="cp-muted">Manage your polls and view analytics</p>
          </div>
          <Link to="/create-poll" className="btn btn-primary w-full sm:w-auto">➕ Create new poll</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
          {[
            { icon: "📊", label: "Total polls", value: stats.total, color: "#fb923c" },
            { icon: "✅", label: "Active", value: stats.active, color: "#4ade80" },
            { icon: "⏱️", label: "Expired", value: stats.expired, color: "#f87171" },
            { icon: "🌐", label: "Published", value: stats.published, color: "#a78bfa" },
          ].map((s) => (
            <div key={s.label} className="cp-card flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: "var(--surface)" }}>
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-bold" style={{ fontFamily: "'Syne',sans-serif", color: s.color }}>
                  {s.value}
                </div>
                <div className="text-xs" style={{ color: "var(--text3)" }}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Poll list */}
        <div className="cp-section-title">Your polls</div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : polls.length === 0 ? (
          <div className="cp-card text-center py-16 animate-fade-in">
            <div className="text-5xl mb-4">☕</div>
            <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text)" }}>No polls yet</h3>
            <p className="text-sm mb-6" style={{ color: "var(--text3)" }}>Start by creating your first poll</p>
            <Link to="/create-poll" className="btn btn-primary">➕ Create a poll</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4 stagger">
            {polls.map((poll) => {
              const expired = isExpired(poll.expiresAt);
              return (
                <div key={poll._id} className="poll-card animate-fade-up">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: "linear-gradient(135deg,#f97316,#fbbf24)" }}>
                        📊
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-semibold text-base truncate" style={{ color: "var(--text)" }}>
                          {poll.title}
                        </h3>
                        {poll.description && (
                          <p className="text-sm mt-0.5 line-clamp-1" style={{ color: "var(--text3)" }}>
                            {poll.description}
                          </p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <PollStatusBadge poll={poll} />
                          {poll.allowAnonymous
                            ? <span className="cp-badge cp-badge-anon">🕵️ Anonymous</span>
                            : <span className="cp-badge cp-badge-auth">🔐 Auth</span>}
                        </div>

                        {/* Countdown timer */}
                        {!expired && !poll.ispublished && (
                          <div className="mt-3">
                            <CountdownTimer
                              expiresAt={poll.expiresAt}
                              onExpire={fetchPolls}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                      <button onClick={(e) => { e.stopPropagation(); setQrPoll(poll); }}
                        className="btn btn-secondary btn-sm" title="QR Code">
                        📱 QR
                      </button>
                      <button onClick={(e) => copyLink(poll.pollCode, e)}
                        className="btn btn-secondary btn-sm">
                        🔗 Share
                      </button>
                      <Link to={`/analytics/${poll._id}`} className="btn btn-outline btn-sm">
                        📈 Analytics
                      </Link>
                      <Link to={`/poll/${poll.pollCode}`} target="_blank"
                        className="btn btn-ghost btn-sm">
                        👁 View
                      </Link>
                      <button onClick={(e) => deletePoll(poll._id, e)}
                        className="btn btn-danger btn-sm">🗑</button>
                    </div>
                  </div>

                  {/* Share link row */}
                  <div className="cp-link-box mt-2">
                    <span className="text-xs font-mono truncate flex-1" style={{ color: "#fb923c" }}>
                      {window.location.origin}/poll/{poll.pollCode}
                    </span>
                    <button onClick={(e) => copyLink(poll.pollCode, e)}
                      className="btn btn-ghost btn-sm text-xs flex-shrink-0">
                      Copy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer className="mt-20 py-8 text-center text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--text3)" }}>
        ☕ ChaiPoll · Made with ❤️ for the hackathon
      </footer>
    </div>
  );
};

export default Dashboard;