import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import CountdownTimer from "../components/CountdownTimer";
import socket from "../socket/socket.js";

const PollPage = () => {
  const { code } = useParams();
  const { user } = useContext(AuthContext);
  const [poll, setPoll] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    API.get(`/polls/${code}`)
      .then((res) => {
        const pollData = res.data.poll;
        setPoll(pollData);

        // ✅ Anonymous poll — localStorage se check karo
        // Logged in user ka backend pe check hota hai
        if (pollData.allowAnonymous && !user) {
          const submittedPolls = JSON.parse(
            localStorage.getItem("cp_submitted_polls") || "[]"
          );
          if (submittedPolls.includes(code)) {
            setSubmitted(true); // Already responded
          }
        }
      })
      .catch((err) => setError(err.response?.data?.message || "Poll not found"))
      .finally(() => setLoading(false));

    // Socket room join
    const join = () => socket.emit("join_poll", code);
    if (socket.connected) join();
    else socket.on("connect", join);
    return () => socket.off("connect", join);
  }, [code]);

  const select = (qId, option) =>
    setAnswers((prev) => ({ ...prev, [qId]: option }));

  const submit = async () => {
    // Required questions validate
    for (const q of poll.questions) {
      if (q.required && !answers[q._id]) {
        toast.error(`Please answer: "${q.question}"`);
        return;
      }
    }

    setSubmitting(true);
    try {
      await API.post(`/responses/${code}`, {
        answers: Object.keys(answers).map((qId) => ({
          questionId: qId,
          selectedOption: answers[qId],
        })),
      });

      // ✅ Anonymous poll — localStorage mein save karo
      if (poll.allowAnonymous && !user) {
        const submittedPolls = JSON.parse(
          localStorage.getItem("cp_submitted_polls") || "[]"
        );
        if (!submittedPolls.includes(code)) {
          submittedPolls.push(code);
          localStorage.setItem(
            "cp_submitted_polls",
            JSON.stringify(submittedPolls)
          );
        }
      }

      setSubmitted(true);
      toast.success("Response submitted! ☕");
    } catch (err) {
      const msg = err.response?.data?.message || "Submission failed";

      // Backend ne already submitted bola
      if (err.response?.data?.alreadySubmitted) {
        toast.error("You have already responded to this poll.");
        setSubmitted(true);
        return;
      }

      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading ──────────────────────────────────────────────────
  if (loading)
    return (
      <div className="page-gradient min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );

  // ── Error ────────────────────────────────────────────────────
  if (error)
    return (
      <div className="page-gradient min-h-screen">
        <Navbar />
        <div className="cp-shell max-w-xl mx-auto text-center py-20">
          <div className="text-5xl mb-5">
            {error.toLowerCase().includes("expired") ? "⏱️" : "😕"}
          </div>
          <h2
            className="font-bold text-2xl mb-3"
            style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}
          >
            {error.toLowerCase().includes("expired")
              ? "Poll has expired"
              : "Poll not found"}
          </h2>
          <p className="mb-8" style={{ color: "var(--text2)" }}>
            {error}
          </p>
          <Link to="/" className="btn btn-primary">← Go home</Link>
        </div>
      </div>
    );

  // ── Already submitted ────────────────────────────────────────
  if (submitted)
    return (
      <div className="page-gradient min-h-screen">
        <Navbar />
        <div className="cp-shell max-w-xl mx-auto text-center py-20 animate-fade-up">
          <div className="text-6xl mb-6">✅</div>
          <h2
            className="font-bold text-3xl mb-3"
            style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}
          >
            Already submitted!
          </h2>
          <p className="mb-3" style={{ color: "var(--text2)" }}>
            You have already responded to this poll.
          </p>
          <p className="text-sm mb-8" style={{ color: "var(--text3)" }}>
            Each person can only respond once.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            {poll?.ispublished && (
              <Link to={`/results/${code}`} className="btn btn-primary">
                📊 View results →
              </Link>
            )}
            <Link to="/" className="btn btn-secondary">← Back to home</Link>
          </div>
        </div>
      </div>
    );

  const answered = Object.keys(answers).length;
  const progress =
    poll.questions.length > 0
      ? Math.round((answered / poll.questions.length) * 100)
      : 0;

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="cp-shell max-w-2xl mx-auto">

        {/* Poll header */}
        <div
          className="cp-card mb-6 animate-fade-up"
          style={{ borderColor: "rgba(249,115,22,0.15)" }}
        >
          <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
            <div className="flex flex-wrap gap-2">
              {poll.allowAnonymous ? (
                <span className="cp-badge cp-badge-anon">🕵️ Anonymous</span>
              ) : (
                <span className="cp-badge cp-badge-auth">🔐 Auth required</span>
              )}
            </div>
            {user && (
              <span className="text-xs" style={{ color: "var(--text3)" }}>
                Signed in as {user.name}
              </span>
            )}
          </div>

          <h1
            className="font-bold text-2xl mb-2"
            style={{ fontFamily: "'Syne',sans-serif", color: "var(--text)" }}
          >
            {poll.title}
          </h1>
          {poll.description && (
            <p className="text-sm mb-3" style={{ color: "var(--text2)" }}>
              {poll.description}
            </p>
          )}

          <CountdownTimer expiresAt={poll.expiresAt} />

          {/* Progress bar */}
          <div className="mt-4">
            <div
              className="flex justify-between text-xs mb-1.5"
              style={{ color: "var(--text3)" }}
            >
              <span>{answered} of {poll.questions.length} answered</span>
              <span>{progress}%</span>
            </div>
            <div className="cp-progress-bg">
              <div
                className="cp-progress-fill transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4 stagger">
          {poll.questions.map((q, qi) => (
            <div key={q._id} className="cp-card animate-fade-up">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5"
                    style={{ background: "rgba(249,115,22,0.15)", color: "#fb923c" }}
                  >
                    {qi + 1}
                  </div>
                  <div>
                    <h3
                      className="font-semibold leading-snug"
                      style={{ color: "var(--text)" }}
                    >
                      {q.question}
                      {q.required && (
                        <span style={{ color: "#f97316" }}> *</span>
                      )}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>
                      {q.required ? "Required" : "Optional"} · Choose one
                    </p>
                  </div>
                </div>
                {answers[q._id] && (
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                    style={{ background: "rgba(74,222,128,0.15)", color: "#4ade80" }}
                  >
                    ✓
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <div
                    key={oi}
                    className={`cp-radio ${answers[q._id] === opt.text ? "selected" : ""}`}
                    onClick={() => select(q._id, opt.text)}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all"
                      style={{
                        borderColor: answers[q._id] === opt.text ? "#f97316" : "var(--text3)",
                      }}
                    >
                      {answers[q._id] === opt.text && (
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{ background: "#f97316" }}
                        />
                      )}
                    </div>
                    <span className="text-sm" style={{ color: "var(--text2)" }}>
                      {opt.text}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="mt-8 animate-fade-up">
          {!poll.allowAnonymous && !user ? (
            <div className="cp-card text-center py-8">
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="font-semibold mb-2" style={{ color: "var(--text)" }}>
                Sign-in required
              </h3>
              <p className="text-sm mb-5" style={{ color: "var(--text2)" }}>
                This poll requires you to be logged in to respond.
              </p>
              <div className="flex gap-3 justify-center">
                <Link to="/login" className="btn btn-primary">Sign in</Link>
                <Link to="/register" className="btn btn-secondary">Register</Link>
              </div>
            </div>
          ) : (
            <button
              onClick={submit}
              disabled={submitting || answered === 0}
              className="btn btn-primary w-full"
              style={{ padding: "14px" }}
            >
              {submitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : (
                `Submit response (${answered}/${poll.questions.length}) →`
              )}
            </button>
          )}
        </div>
      </div>

      <footer
        className="mt-16 py-6 text-center text-xs"
        style={{ borderTop: "1px solid var(--border)", color: "var(--text3)" }}
      >
        ☕ Powered by ChaiPoll
      </footer>
    </div>
  );
};

export default PollPage;
