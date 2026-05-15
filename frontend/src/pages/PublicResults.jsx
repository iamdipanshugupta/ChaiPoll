import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";

const PublicResults = () => {
  const { code } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResults = async () => {
    try {
      // FIX: backend bhejta hai { results: { title, totalResponses, questions } }
      const res = await API.get(`/analytics/public/${code}`);
      setData(res.data.results);
    } catch (err) {
      setError(err.response?.data?.message || "Results not available");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchResults(); }, [code]);

  if (loading) return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
      </div>
    </div>
  );

  if (error) return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="cp-shell max-w-xl mx-auto text-center py-20">
        <div className="text-5xl mb-5">🔒</div>
        <h2 className="text-white font-bold text-2xl mb-3" style={{ fontFamily: "'Syne',sans-serif" }}>
          Results not available
        </h2>
        <p className="text-neutral-400 mb-8">{error}</p>
        <Link to="/" className="btn btn-secondary">← Go home</Link>
      </div>
    </div>
  );

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="cp-shell max-w-2xl mx-auto">

        {/* Published banner */}
        <div
          className="cp-card mb-8 text-center animate-fade-up"
          style={{ borderColor: "rgba(249,115,22,0.2)", background: "linear-gradient(135deg, rgba(249,115,22,0.05), rgba(124,58,237,0.04))" }}
        >
          <div className="text-4xl mb-3">📊</div>
          <div className="inline-flex items-center gap-2 rounded-full border border-green-500/25 bg-green-500/8 px-3 py-1 text-xs font-semibold text-green-400 mb-4">
            🌐 Official published results
          </div>
          {/* FIX: data.title — backend se yahi aata hai (data.pollTitle nahi) */}
          <h1 className="text-white font-bold text-2xl mb-2" style={{ fontFamily: "'Syne',sans-serif" }}>
            {data.title}
          </h1>
          {/* FIX: data.totalResponses */}
          <p className="text-neutral-400 text-sm">
            {data.totalResponses} total response{data.totalResponses !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Question results */}
        {/* FIX: data.questions (not data.results.map) */}
        <div className="flex flex-col gap-5 stagger">
          {data.questions.map((q, i) => {
            const entries = Object.entries(q.optionCounts);
            const total = entries.reduce((a, [, v]) => a + v, 0);
            const winner = entries.reduce((a, b) => b[1] > a[1] ? b : a, entries[0] || ["", 0]);

            return (
              <div key={i} className="cp-card animate-fade-up">
                <div className="flex items-start gap-3 mb-5">
                  <div className="w-6 h-6 rounded-md bg-orange-500/15 text-orange-400 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <h3 className="text-white font-semibold text-base">{q.question}</h3>
                </div>

                {total === 0 ? (
                  <p className="text-neutral-500 text-sm">No responses for this question.</p>
                ) : (
                  <div className="space-y-3">
                    {entries.map(([key, value]) => {
                      const pct = total > 0 ? Math.round((value / total) * 100) : 0;
                      const isWinner = key === winner[0] && value > 0;
                      return (
                        <div key={key}>
                          <div className="flex items-center justify-between mb-1.5 text-sm">
                            <span className={`font-medium flex items-center gap-2 ${isWinner ? "text-amber-400" : "text-neutral-300"}`}>
                              {isWinner && <span>🏆</span>}
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
                    <p className="text-xs text-neutral-600 mt-3">{total} answered this question</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Share */}
        <div className="cp-card mt-8 text-center animate-fade-up">
          <p className="text-neutral-400 text-sm mb-4">Share these results</p>
          <div className="cp-link-box justify-center">
            <span className="text-orange-400 font-mono text-xs truncate">
              {window.location.href}
            </span>
            <button
              onClick={() => { navigator.clipboard.writeText(window.location.href); }}
              className="btn btn-ghost btn-sm text-xs flex-shrink-0"
            >
              Copy
            </button>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link to="/" className="btn btn-ghost btn-sm">← Back to home</Link>
        </div>
      </div>

      <footer className="border-t border-white/5 mt-16 py-6 text-center text-xs text-neutral-600">
        ☕ Powered by ChaiPoll · Made with ❤️
      </footer>
    </div>
  );
};

export default PublicResults;