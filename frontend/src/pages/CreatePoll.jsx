import { useState } from "react";
import API from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const CreatePoll = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [allowAnonymous, setAllowAnonymous] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");
  const [questions, setQuestions] = useState([
    { question: "", required: true, options: ["", ""] },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const addQuestion = () =>
    setQuestions([...questions, { question: "", required: true, options: ["", ""] }]);

  const removeQuestion = (i) => {
    if (questions.length === 1) return toast.error("At least one question required");
    setQuestions(questions.filter((_, idx) => idx !== i));
  };

  const updateQ = (i, val) => {
    const q = [...questions]; q[i].question = val; setQuestions(q);
  };

  const toggleRequired = (i) => {
    const q = [...questions]; q[i].required = !q[i].required; setQuestions(q);
  };

  const updateOpt = (qi, oi, val) => {
    const q = [...questions]; q[qi].options[oi] = val; setQuestions(q);
  };

  const addOpt = (qi) => {
    const q = [...questions]; q[qi].options.push(""); setQuestions(q);
  };

  const removeOpt = (qi, oi) => {
    if (questions[qi].options.length <= 2) return toast.error("Min 2 options required");
    const q = [...questions]; q[qi].options.splice(oi, 1); setQuestions(q);
  };

  const validate = () => {
    if (!title.trim()) { toast.error("Poll title is required"); return false; }
    if (!expiresAt) { toast.error("Expiry date is required"); return false; }
    if (new Date(expiresAt) <= new Date()) { toast.error("Expiry must be in the future"); return false; }
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) { toast.error(`Q${i + 1} text is required`); return false; }
      if (questions[i].options.filter((o) => o.trim()).length < 2) {
        toast.error(`Q${i + 1} needs at least 2 options`); return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      await API.post("/polls", { title, description, allowAnonymous, expiresAt, questions });
      toast.success("Poll created! ☕");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create poll");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="cp-shell max-w-3xl mx-auto">
        <div className="animate-fade-up">
          <h1 className="cp-page-title mb-1">Create a poll</h1>
          <p className="cp-muted mb-8">Add questions, set expiry and start collecting feedback.</p>
        </div>

        {/* Poll details */}
        <div className="cp-card mb-5 animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <div className="cp-section-title mb-5">Poll details</div>
          <div className="space-y-4">
            <div>
              <label className="cp-label">Title <span style={{ color: "#f97316" }}>*</span></label>
              <input className="cp-input" placeholder="e.g. Team lunch preferences"
                value={title} onChange={(e) => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="cp-label">Description <span style={{ color: "var(--text3)" }}>(optional)</span></label>
              <textarea className="cp-textarea" placeholder="Give respondents some context…"
                value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Settings */}
        <div className="cp-card mb-5 animate-fade-up" style={{ animationDelay: "0.08s" }}>
          <div className="cp-section-title mb-5">Settings</div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="cp-label">Expiry date & time <span style={{ color: "#f97316" }}>*</span></label>
              <input type="datetime-local" className="cp-input"
                value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)} />
            </div>
            <div>
              <label className="cp-label">Response mode</label>
              <div className="flex gap-3 mt-1">
                {[
                  { val: true, label: "🕵️ Anonymous", color: "#fb923c", bg: "rgba(249,115,22,0.1)", border: "rgba(249,115,22,0.4)" },
                  { val: false, label: "🔐 Auth only", color: "#a78bfa", bg: "rgba(124,58,237,0.1)", border: "rgba(124,58,237,0.4)" },
                ].map((m) => (
                  <button key={String(m.val)} type="button" onClick={() => setAllowAnonymous(m.val)}
                    className="flex-1 py-3 rounded-xl text-sm font-medium border transition-all"
                    style={{
                      borderColor: allowAnonymous === m.val ? m.border : "var(--border)",
                      background: allowAnonymous === m.val ? m.bg : "var(--surface)",
                      color: allowAnonymous === m.val ? m.color : "var(--text2)",
                    }}>
                    {m.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="flex items-center justify-between mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="cp-section-title mb-0">Questions</div>
          <button onClick={addQuestion} className="btn btn-outline btn-sm">+ Add question</button>
        </div>

        <div className="space-y-4 stagger">
          {questions.map((q, qi) => (
            <div key={qi} className="cp-card animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: "#f97316" }}>{qi + 1}</div>
                  <span className="text-sm font-medium" style={{ color: "var(--text2)" }}>Question {qi + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => toggleRequired(qi)}
                    className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-all"
                    style={{
                      borderColor: q.required ? "rgba(249,115,22,0.4)" : "var(--border)",
                      background: q.required ? "rgba(249,115,22,0.1)" : "transparent",
                      color: q.required ? "#fb923c" : "var(--text3)",
                    }}>
                    {q.required ? "✓ Required" : "Optional"}
                  </button>
                  {questions.length > 1 && (
                    <button onClick={() => removeQuestion(qi)} className="btn btn-danger btn-sm">✕</button>
                  )}
                </div>
              </div>

              <input className="cp-input mb-4" placeholder="Enter your question…"
                value={q.question} onChange={(e) => updateQ(qi, e.target.value)} />

              <div className="space-y-2.5">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 flex-shrink-0" style={{ borderColor: "var(--text3)" }} />
                    <input className="cp-input flex-1" placeholder={`Option ${oi + 1}…`}
                      value={opt} onChange={(e) => updateOpt(qi, oi, e.target.value)} />
                    {q.options.length > 2 && (
                      <button onClick={() => removeOpt(qi, oi)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 transition"
                        style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={() => addOpt(qi)}
                className="mt-3 text-xs transition flex items-center gap-1"
                style={{ color: "var(--text3)", background: "none", border: "none", cursor: "pointer" }}
                onMouseOver={(e) => e.target.style.color = "#f97316"}
                onMouseOut={(e) => e.target.style.color = "var(--text3)"}>
                + Add option
              </button>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3 mt-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <button onClick={() => navigate("/dashboard")} className="btn btn-ghost">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting} className="btn btn-primary flex-1 sm:flex-none sm:w-52">
            {submitting ? (
              <span className="flex items-center gap-2 justify-center">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating…
              </span>
            ) : "☕ Create poll →"}
          </button>
        </div>
      </div>

      <footer className="mt-16 py-6 text-center text-xs" style={{ borderTop: "1px solid var(--border)", color: "var(--text3)" }}>
        ☕ ChaiPoll · Made with ❤️
      </footer>
    </div>
  );
};

export default CreatePoll;
