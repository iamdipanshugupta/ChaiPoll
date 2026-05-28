import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const PublicResults = () => {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get(`/analytics/public/${code}`)
      .then((res) => setData(res.data.results))
      .catch((err) => setError(err.response?.data?.message || "Results not available"))
      .finally(() => setLoading(false));
  }, [code]);

  if (loading) return (
    <div className="page-gradient min-h-screen"><Navbar />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (error) return (
    <div className="page-gradient min-h-screen"><Navbar />
      <div className="cp-shell max-w-xl mx-auto text-center py-20">
        <div className="text-5xl mb-5">🔒</div>
        <h2 className="font-bold text-2xl mb-3" style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
          Results not available
        </h2>
        <p className="mb-8" style={{ color: "var(--text2)" }}>{error}</p>
        <Link to="/" className="btn btn-secondary">← Go home</Link>
      </div>
    </div>
  );

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="cp-shell max-w-2xl mx-auto">

        {/* Banner */}
        <div className="cp-card mb-8 text-center animate-fade-up"
          style={{ borderColor: "rgba(249,115,22,0.2)", background: "linear-gradient(135deg,rgba(249,115,22,0.05),rgba(124,58,237,0.04))" }}>
          <div className="text-4xl mb-3">📊</div>
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold mb-4 cp-badge cp-badge-pub">
            🌐 Official published results
          </div>
          <h1 className="font-bold text-2xl mb-2" style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}>
            {data.title}
          </h1>
          <p className="text-sm" style={{ color: "var(--text2)" }}>
            {data.totalResponses} total response{data.totalResponses !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Questions */}
        <div className="flex flex-col gap-5 stagger">
          {data.questions.map((q, i) => {
            const entries = Object.entries(q.optionCounts);
            const total = entries.reduce((a, [, v]) => a + v, 0);
            const winner = entries.reduce((a, b) => b[1] > a[1] ? b : a, entries[0] || ["", 0]);

            return (
              <div key={i} className="cp-card animate-fade-up">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(249,115,22,0.15)", color: "#fb923c" }}>{i + 1}</div>
                  <h3 className="font-semibold text-base" style={{ color: "var(--text)" }}>{q.question}</h3>
                </div>

                {total === 0 ? (
                  <p className="text-sm" style={{ color: "var(--text3)" }}>No responses for this question.</p>
                ) : (
                  <div className="space-y-3">
                    {entries.map(([key, value]) => {
                      const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                      const isWinner = key === winner[0] && value > 0;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5 text-sm">
                            <span className="font-medium flex items-center gap-2"
                              style={{ color: isWinner ? "#fbbf24" : "var(--text2)" }}>
                              {isWinner && "🏆"} {key}
                            </span>
                            <span className="text-xs tabular-nums" style={{ color: "var(--text3)" }}>
                              {value} ({pct}%)
                            </span>
                          </div>
                          <div className="cp-progress-bg">
                            <div className="cp-progress-fill" style={{
                              width: `${pct}%`,
                              background: isWinner
                                ? "linear-gradient(90deg,#f59e0b,#fbbf24)"
                                : "linear-gradient(90deg,#f97316,#fb923c)",
                            }} />
                          </div>
                        </div>
                      );
                    })}
                    <p className="text-xs mt-3" style={{ color: "var(--text3)" }}>{total} answered</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Share */}
        <div className="cp-card mt-8 text-center animate-fade-up">
          <p className="text-sm mb-4" style={{ color: "var(--text2)" }}>Share these results</p>
          <div className="cp-link-box justify-center">
            <span className="text-xs font-mono truncate flex-1" style={{ color: "#fb923c" }}>
              {window.location.href}
            </span>
            <button onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              import("react-hot-toast").then(({ default: toast }) => toast.success("Copied!"));
            }} className="btn btn-ghost btn-sm flex-shrink-0">Copy</button>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="btn btn-ghost btn-sm">← Back to home</Link>
        </div>
      </div>

      <footer className="mt-16 py-6 text-center text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--text3)" }}>
        ☕ Powered by ChaiPoll
      </footer>
    </div>
  );
};

export default PublicResults;
