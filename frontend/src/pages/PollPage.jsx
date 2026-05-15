import { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api/axios";
import toast from "react-hot-toast";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import socket from "../socket/socket.js"
const PollPage = () => {
  const { code } = useParams();
  const { user } = useContext(AuthContext);
  const [poll, setPoll] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchPoll = async () => {
    try {
      const res = await API.get(`/polls/${code}`);
      setPoll(res.data.poll);
    } catch (err) {
      const msg = err.response?.data?.message || "Poll not found";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoll();

    // ✅ Socket room join karo taaki creator ko live update mile
    const joinRoom = () => socket.emit("join_poll", code);
    if (socket.connected) {
      joinRoom();
    } else {
      socket.on("connect", joinRoom);
    }

    return () => socket.off("connect", joinRoom);
  }, [code]);

  const selectAnswer = (qId, option) =>
    setAnswers((prev) => ({ ...prev, [qId]: option }));

  const submit = async () => {
    // Validate required questions
    for (const q of poll.questions) {
      if (q.required && !answers[q._id]) {
        toast.error(`Please answer: "${q.question}"`);
        return;
      }
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem("token");

      await API.post(
        `/responses/${code}`,
        {
          answers: Object.keys(answers).map((qId) => ({
            questionId: qId,
            selectedOption: answers[qId],
          })),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSubmitted(true);
      toast.success("Response submitted! ☕");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally {
      setSubmitting(false);
    }
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

  if (error)
    return (
      <div className="page-gradient min-h-screen">
        <Navbar />
        <div className="cp-shell max-w-xl mx-auto text-center py-20">
          <div className="text-5xl mb-5">
            {error.toLowerCase().includes("expired") ? "⏱️" : "😕"}
          </div>
          <h2
            className="text-white font-bold text-2xl mb-3"
            style={{ fontFamily: "'Syne',sans-serif" }}
          >
            {error.toLowerCase().includes("expired")
              ? "Poll has expired"
              : "Poll not found"}
          </h2>
          <p className="text-neutral-400 mb-8">{error}</p>
          <Link to="/" className="btn btn-primary">
            ← Go home
          </Link>
        </div>
      </div>
    );

  if (submitted)
    return (
      <div className="page-gradient min-h-screen">
        <Navbar />
        <div className="cp-shell max-w-xl mx-auto text-center py-20 animate-fade-up">
          <div className="text-6xl mb-6">🎉</div>
          <h2
            className="text-white font-bold text-3xl mb-3"
            style={{ fontFamily: "'Syne',sans-serif" }}
          >
            Response submitted!
          </h2>
          <p className="text-neutral-400 mb-8">
            Thank you for your feedback. Results will be available once the
            creator publishes them.
          </p>
          {poll?.ispublished ? (
            <Link to={`/results/${code}`} className="btn btn-primary">
              📊 View results →
            </Link>
          ) : (
            <Link to="/" className="btn btn-secondary">
              ← Back to home
            </Link>
          )}
        </div>
      </div>
    );

  const expiryStr = timeLeft(poll.expiresAt);
  const answeredCount = Object.keys(answers).length;
  const progress =
    poll.questions.length > 0
      ? Math.round((answeredCount / poll.questions.length) * 100)
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
                <span className="cp-badge cp-badge-auth">
                  🔐 Sign-in required
                </span>
              )}
              <span
                className="cp-badge"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  color: "#737373",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                ⏱ {expiryStr}
              </span>
            </div>
            {user && (
              <span className="text-xs text-neutral-500">
                Logged in as {user.name}
              </span>
            )}
          </div>
          <h1
            className="text-white font-bold text-2xl mb-2"
            style={{ fontFamily: "'Syne',sans-serif" }}
          >
            {poll.title}
          </h1>
          {poll.description && (
            <p className="text-neutral-400 text-sm">{poll.description}</p>
          )}

          {/* Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
              <span>
                {answeredCount} of {poll.questions.length} answered
              </span>
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
                  <div className="w-6 h-6 rounded-md bg-orange-500/15 text-orange-400 text-xs flex items-center justify-center font-bold flex-shrink-0 mt-0.5">
                    {qi + 1}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold leading-snug">
                      {q.question}
                      {q.required && (
                        <span className="text-orange-500 ml-1">*</span>
                      )}
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      {q.required ? "Required" : "Optional"} · Choose one
                    </p>
                  </div>
                </div>
                {answers[q._id] && (
                  <div className="w-5 h-5 rounded-full bg-green-500/15 text-green-400 text-xs flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {q.options.map((opt, oi) => (
                  <div
                    key={oi}
                    className={`cp-radio ${answers[q._id] === opt.text ? "selected" : ""}`}
                    onClick={() => selectAnswer(q._id, opt.text)}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${
                        answers[q._id] === opt.text
                          ? "border-orange-500"
                          : "border-neutral-600"
                      }`}
                    >
                      {answers[q._id] === opt.text && (
                        <div className="w-2 h-2 rounded-full bg-orange-500" />
                      )}
                    </div>
                    <span className="text-sm text-neutral-200">{opt.text}</span>
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
              <h3 className="text-white font-semibold mb-2">
                Sign-in required
              </h3>
              <p className="text-neutral-400 text-sm mb-5">
                This poll requires you to be logged in to respond.
              </p>
              <div className="flex gap-3 justify-center">
                <Link to="/login" className="btn btn-primary">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-secondary">
                  Register
                </Link>
              </div>
            </div>
          ) : (
            <button
              onClick={submit}
              disabled={submitting || answeredCount === 0}
              className="btn btn-primary w-full"
              style={{ padding: "14px" }}
            >
              {submitting ? (
                <span className="flex items-center gap-2 justify-center">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting…
                </span>
              ) : (
                `Submit response (${answeredCount}/${poll.questions.length}) →`
              )}
            </button>
          )}
        </div>
      </div>

      <footer className="border-t border-white/5 mt-16 py-6 text-center text-xs text-neutral-600">
        ☕ Powered by ChaiPoll
      </footer>
    </div>
  );
};

function timeLeft(ts) {
  const s = (new Date(ts) - Date.now()) / 1000;
  if (s < 0) return "Expired";
  if (s < 3600) return `Closes in ${Math.round(s / 60)}m`;
  if (s < 86400) return `Closes in ${Math.round(s / 3600)}h`;
  return `Closes in ${Math.round(s / 86400)}d`;
}

export default PollPage;
