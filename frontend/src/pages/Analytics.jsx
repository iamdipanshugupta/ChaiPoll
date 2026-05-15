import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import socket from "../socket/socket.js";
import Navbar from "../components/Navbar";
import toast from "react-hot-toast";

const Analytics = () => {
  const { pollId } = useParams();
  const [analytics, setAnalytics] = useState(null);
  const [publishing, setPublishing] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get(`/analytics/${pollId}`);
      setAnalytics(res.data.analytics);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    socket.on("response_submitted", fetchAnalytics);
    return () => socket.off("response_submitted", fetchAnalytics);
  }, [pollId]);

  useEffect(() => {
    if (!analytics?.pollCode) return;

    const joinRoom = () => {
      socket.emit("join_poll", analytics.pollCode);
      console.log("Joined room:", analytics.pollCode);
    };

    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", joinRoom);
    }

    return () => socket.off("connect", joinRoom);
  }, [analytics?.pollCode]);

  const handlePublish = async () => {
    try {
      setPublishing(true);
      await API.patch(`/analytics/${pollId}/publish`);
      toast.success("Results published publicly! 🌐");
      fetchAnalytics();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to publish");
    } finally {
      setPublishing(false);
    }
  };

  const copyLink = () => {
    const link = `${window.location.origin}/poll/${analytics?.pollCode}`;
    navigator.clipboard
      .writeText(link)
      .then(() => toast.success("Link copied!"));
  };

  if (loading)
    return (
      <div className="page-gradient min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );

  if (!analytics)
    return (
      <div className="page-gradient min-h-screen">
        <Navbar />
        <div className="cp-shell text-center py-20">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-white font-semibold text-xl mb-2">
            Analytics not found
          </h2>
          <Link to="/" className="btn btn-primary mt-4">
            ← Dashboard
          </Link>
        </div>
      </div>
    );

  const completionRate =
    analytics.totalResponses > 0
      ? Math.round(
          (analytics.questions.reduce(
            (a, q) => a + q.answered / analytics.totalResponses,
            0,
          ) /
            analytics.questions.length) *
            100,
        )
      : 0;

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="cp-shell">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5 mb-8 animate-fade-up">
          <div>
            <Link
              to="/"
              className="text-xs text-neutral-500 hover:text-orange-400 transition mb-3 inline-flex items-center gap-1"
            >
              ← My polls
            </Link>
            <h1 className="cp-page-title">{analytics.pollTitle}</h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {analytics.ispublished ? (
                <span className="cp-badge cp-badge-pub">🌐 Published</span>
              ) : (
                <span
                  className="cp-badge"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    color: "#737373",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  Draft
                </span>
              )}
              <span className="text-xs text-neutral-500 font-mono">
                Code: {analytics.pollCode}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={copyLink} className="btn btn-secondary btn-sm">
              🔗 Share link
            </button>
            {analytics.ispublished ? (
              <Link
                to={`/results/${analytics.pollCode}`}
                className="btn btn-outline btn-sm"
              >
                👁 View public results
              </Link>
            ) : (
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="btn btn-primary btn-sm"
              >
                {publishing ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                    Publishing…
                  </>
                ) : (
                  "🌐 Publish results"
                )}
              </button>
            )}
          </div>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
          {[
            {
              icon: "📊",
              label: "Total responses",
              value: analytics.totalResponses,
              color: "text-orange-400",
              live: true,
            },
            {
              icon: "❓",
              label: "Questions",
              value: analytics.questions.length,
              color: "text-blue-400",
            },
            {
              icon: "✅",
              label: "Completion rate",
              value: `${completionRate}%`,
              color: "text-green-400",
            },
            {
              icon: analytics.ispublished ? "🌐" : "🔒",
              label: "Status",
              value: analytics.ispublished ? "Published" : "Private",
              color: analytics.ispublished
                ? "text-green-400"
                : "text-neutral-400",
            },
          ].map((s) => (
            <div key={s.label} className="cp-card">
              <div className="text-xl mb-2">{s.icon}</div>
              <div
                className={`text-2xl font-bold mb-1 ${s.color}`}
                style={{ fontFamily: "'Syne',sans-serif" }}
              >
                {s.value}
              </div>
              <div className="text-xs text-neutral-500">{s.label}</div>
              {s.live && analytics.totalResponses > 0 && (
                <div className="flex items-center gap-1.5 mt-2 text-xs text-green-400">
                  <span className="live-dot" /> Live
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Questions */}
        {analytics.totalResponses === 0 ? (
          <div className="cp-card text-center py-16 animate-fade-in">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-white font-semibold mb-2">No responses yet</h3>
            <p className="text-neutral-400 text-sm mb-6">
              Share your poll link to start collecting feedback
            </p>
            <button onClick={copyLink} className="btn btn-primary">
              🔗 Copy share link
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-5 stagger">
            {analytics.questions.map((q, i) => {
              const total = q.answered || analytics.totalResponses;
              const entries = Object.entries(q.optionCounts);
              const winner = entries.reduce(
                (a, b) => (b[1] > a[1] ? b : a),
                entries[0],
              );

              return (
                <div key={i} className="cp-card animate-fade-up">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-5 h-5 rounded-md bg-orange-500/15 text-orange-400 text-xs flex items-center justify-center font-bold">
                          {i + 1}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {q.required ? "Required" : "Optional"}
                        </span>
                      </div>
                      <h3 className="text-white font-semibold text-base">
                        {q.question}
                      </h3>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div
                        className="text-xl font-bold text-white"
                        style={{ fontFamily: "'Syne',sans-serif" }}
                      >
                        {q.answered}
                      </div>
                      <div className="text-xs text-neutral-500">answered</div>
                      {q.skipped > 0 && (
                        <div className="text-xs text-neutral-600">
                          {q.skipped} skipped
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {entries.map(([key, value]) => {
                      const pct =
                        total > 0 ? Math.round((value / total) * 100) : 0;
                      const isWinner = key === winner[0] && value > 0;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5 text-sm">
                            <span
                              className={`font-medium flex items-center gap-2 ${isWinner ? "text-amber-400" : "text-neutral-300"}`}
                            >
                              {isWinner && (
                                <span className="text-amber-400">🏆</span>
                              )}
                              {key}
                            </span>
                            <span className="text-neutral-400 text-xs tabular-nums">
                              {value} ({pct}%)
                            </span>
                          </div>
                          <div className="cp-progress-bg">
                            <div
                              className="cp-progress-fill"
                              style={{
                                width: `${pct}%`,
                                background: isWinner
                                  ? "linear-gradient(90deg, #f59e0b, #fbbf24)"
                                  : "linear-gradient(90deg, #f97316, #fb923c)",
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <footer className="border-t border-white/5 mt-16 py-6 text-center text-xs text-neutral-600">
        ☕ ChaiPoll · Made with ❤️
      </footer>
    </div>
  );
};

export default Analytics;
