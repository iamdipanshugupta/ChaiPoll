import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const deletePoll = async (id) => {
    if (!confirm("Delete this poll? This cannot be undone.")) return;
    try {
      await API.delete(`/polls/${id}`);
      toast.success("Poll deleted");
      fetchPolls();
    } catch {
      toast.error("Delete failed");
    }
  };

  const copyLink = (code) => {
    const link = `${window.location.origin}/poll/${code}`;
    navigator.clipboard.writeText(link).then(() => toast.success("Link copied!"));
  };

  const isExpired = (expiresAt) => new Date(expiresAt) < new Date();

  const stats = {
    total: polls.length,
    active: polls.filter(p => !isExpired(p.expiresAt)).length,
    expired: polls.filter(p => isExpired(p.expiresAt)).length,
    published: polls.filter(p => p.ispublished).length,
  };

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="cp-shell">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 animate-fade-up">
          <div>
            <h1 className="cp-page-title">
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="cp-muted">Manage your polls and view analytics</p>
          </div>
          <Link to="/create-poll" className="btn btn-primary w-full sm:w-auto">
            ➕ Create new poll
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
          {[
            { icon: "📊", label: "Total polls", value: stats.total, color: "text-orange-400" },
            { icon: "✅", label: "Active", value: stats.active, color: "text-green-400" },
            { icon: "⏱️", label: "Expired", value: stats.expired, color: "text-red-400" },
            { icon: "🌐", label: "Published", value: stats.published, color: "text-purple-400" },
          ].map((s) => (
            <div key={s.label} className="cp-card flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-xl flex-shrink-0">
                {s.icon}
              </div>
              <div>
                <div className={`text-2xl font-bold ${s.color}`} style={{ fontFamily: "'Syne',sans-serif" }}>
                  {s.value}
                </div>
                <div className="text-xs text-neutral-500">{s.label}</div>
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
            <h3 className="text-white font-semibold text-lg mb-2">No polls yet</h3>
            <p className="text-neutral-400 text-sm mb-6">Start by creating your first poll</p>
            <Link to="/create-poll" className="btn btn-primary">➕ Create a poll</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4 stagger">
            {polls.map((poll) => {
              const expired = isExpired(poll.expiresAt);
              const expiryStr = expired
                ? `Expired ${timeAgo(poll.expiresAt)}`
                : `Expires ${timeLeft(poll.expiresAt)}`;

              return (
                <div key={poll._id} className="poll-card animate-fade-up">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-xl flex-shrink-0">
                        📊
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-white font-semibold text-base truncate">{poll.title}</h3>
                        {poll.description && (
                          <p className="text-neutral-400 text-sm mt-0.5 line-clamp-1">{poll.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          {expired
                            ? <span className="cp-badge cp-badge-expired">⏱ Expired</span>
                            : <span className="cp-badge cp-badge-active">● Active</span>}
                          {poll.ispublished && <span className="cp-badge cp-badge-pub">🌐 Published</span>}
                          {poll.allowAnonymous
                            ? <span className="cp-badge cp-badge-anon">🕵️ Anonymous</span>
                            : <span className="cp-badge cp-badge-auth">🔐 Auth required</span>}
                          <span className="text-xs text-neutral-500">{expiryStr}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                      <button
                        onClick={() => copyLink(poll.pollCode)}
                        className="btn btn-secondary btn-sm"
                        title="Copy share link"
                      >
                        🔗 Share
                      </button>
                      <Link
                        to={`/analytics/${poll._id}`}
                        className="btn btn-outline btn-sm"
                      >
                        📈 Analytics
                      </Link>
                      <Link
                        to={`/poll/${poll.pollCode}`}
                        className="btn btn-ghost btn-sm"
                        target="_blank"
                        rel="noreferrer"
                      >
                        👁 Preview
                      </Link>
                      <button
                        onClick={() => deletePoll(poll._id)}
                        className="btn btn-danger btn-sm"
                      >
                        🗑
                      </button>
                    </div>
                  </div>

                  {/* Poll code */}
                  <div className="cp-link-box mt-2">
                    <span className="text-orange-400 font-mono text-xs flex-1 truncate">
                      {window.location.origin}/poll/{poll.pollCode}
                    </span>
                    <button
                      onClick={() => copyLink(poll.pollCode)}
                      className="btn btn-ghost btn-sm text-xs"
                    >
                      Copy
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20 px-4 py-8 text-center text-xs text-neutral-600">
        <div className="flex items-center justify-center gap-4 mb-2">
          {[
            { href: "https://github.com", icon: <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg> },
            { href: "https://twitter.com", icon: <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
          ].map((s, i) => <a key={i} href={s.href} target="_blank" rel="noreferrer" className="social-btn">{s.icon}</a>)}
        </div>
        ☕ ChaiPoll · Made with ❤️ for the hackathon
      </footer>
    </div>
  );
};

// Helpers
function timeAgo(ts) {
  const s = (Date.now() - new Date(ts)) / 1000;
  if (s < 3600) return `${Math.round(s / 60)}m ago`;
  if (s < 86400) return `${Math.round(s / 3600)}h ago`;
  return `${Math.round(s / 86400)}d ago`;
}

function timeLeft(ts) {
  const s = (new Date(ts) - Date.now()) / 1000;
  if (s < 0) return "expired";
  if (s < 3600) return `in ${Math.round(s / 60)}m`;
  if (s < 86400) return `in ${Math.round(s / 3600)}h`;
  return `in ${Math.round(s / 86400)}d`;
}

export default Dashboard;