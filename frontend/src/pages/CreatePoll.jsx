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

  const addQuestion = () =>
    setQuestions([...questions, { question: "", required: true, options: ["", ""] }]);

  const removeQuestion = (i) => {
    if (questions.length === 1) { toast.error("At least one question required"); return; }
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
    if (questions[qi].options.length <= 2) { toast.error("Min 2 options required"); return; }
    const q = [...questions]; q[qi].options.splice(oi, 1); setQuestions(q);
  };

  const validate = () => {
    if (!title.trim()) { toast.error("Poll title is required"); return false; }
    if (!expiresAt) { toast.error("Expiry date is required"); return false; }
    if (new Date(expiresAt) <= new Date()) { toast.error("Expiry must be in the future"); return false; }
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question.trim()) { toast.error(`Q${i + 1} text required`); return false; }
      if (questions[i].options.filter(o => o.trim()).length < 2) {
        toast.error(`Q${i + 1} needs at least 2 options`); return false;
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await API.post("/polls", { title, description, allowAnonymous, expiresAt, questions });
      toast.success("Poll created! ☕");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create poll");
    }
  };

  return (
    <div className="page-gradient min-h-screen">
      <Navbar />
      <div className="cp-shell max-w-3xl mx-auto">
        <div className="animate-fade-up">
          <h1 className="cp-page-title mb-1">Create a poll</h1>
          <p className="cp-muted mb-8">Add questions, options, set expiry and start collecting feedback.</p>
        </div>

        {/* Basic info card */}
        <div className="cp-card mb-5 animate-fade-up" style={{ animationDelay: "0.05s" }}>
          <div className="cp-section-title mb-5">Poll details</div>
          <div className="space-y-4">
            <div>
              <label className="cp-label">Poll title <span className="text-orange-500">*</span></label>
              <input className="cp-input" placeholder="e.g. Team lunch preferences" value={title}
                onChange={e => setTitle(e.target.value)} />
            </div>
            <div>
              <label className="cp-label">Description <span className="text-neutral-600">(optional)</span></label>
              <textarea className="cp-textarea" style={{ minHeight: "80px" }}
                placeholder="Give respondents some context…" value={description}
                onChange={e => setDescription(e.target.value)} />
            </div>
          </div>
        </div>

        {/* Settings card */}
        <div className="cp-card mb-5 animate-fade-up" style={{ animationDelay: "0.1s" }}>
          <div className="cp-section-title mb-5">Settings</div>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="cp-label">Expiry date & time <span className="text-orange-500">*</span></label>
              <input type="datetime-local" className="cp-input" value={expiresAt}
                onChange={e => setExpiresAt(e.target.value)} />
            </div>
            <div>
              <label className="cp-label">Response mode</label>
              <div className="flex gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => setAllowAnonymous(true)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                    allowAnonymous
                      ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                      : "border-white/8 bg-white/4 text-neutral-400"
                  }`}
                >
                  🕵️ Anonymous
                </button>
                <button
                  type="button"
                  onClick={() => setAllowAnonymous(false)}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium border transition-all ${
                    !allowAnonymous
                      ? "border-purple-500/50 bg-purple-500/10 text-purple-400"
                      : "border-white/8 bg-white/4 text-neutral-400"
                  }`}
                >
                  🔐 Auth only
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="flex items-center justify-between mb-4 animate-fade-up" style={{ animationDelay: "0.12s" }}>
          <div className="cp-section-title mb-0">Questions</div>
          <button onClick={addQuestion} className="btn btn-outline btn-sm">+ Add question</button>
        </div>

        <div className="space-y-4 stagger">
          {questions.map((q, qi) => (
            <div key={qi} className="cp-card animate-fade-up">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center text-xs font-bold text-white">
                    {qi + 1}
                  </div>
                  <span className="text-sm font-medium text-neutral-300">Question {qi + 1}</span>
                </div>
                <div className="flex items-center gap-2">
                  {/* Required toggle */}
                  <button
                    type="button"
                    onClick={() => toggleRequired(qi)}
                    className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-all ${
                      q.required
                        ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                        : "border-white/8 text-neutral-500"
                    }`}
                  >
                    {q.required ? "✓ Required" : "Optional"}
                  </button>
                  {questions.length > 1 && (
                    <button onClick={() => removeQuestion(qi)} className="btn btn-danger btn-sm">✕</button>
                  )}
                </div>
              </div>

              <input
                className="cp-input mb-4"
                placeholder="Enter your question…"
                value={q.question}
                onChange={e => updateQ(qi, e.target.value)}
              />

              <div className="space-y-2.5">
                {q.options.map((opt, oi) => (
                  <div key={oi} className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border-2 border-neutral-600 flex-shrink-0" />
                    <input
                      className="cp-input flex-1"
                      placeholder={`Option ${oi + 1}…`}
                      value={opt}
                      onChange={e => updateOpt(qi, oi, e.target.value)}
                    />
                    {q.options.length > 2 && (
                      <button onClick={() => removeOpt(qi, oi)}
                        className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20 flex items-center justify-center text-sm hover:bg-red-500/20 transition flex-shrink-0">
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>

              <button onClick={() => addOpt(qi)}
                className="mt-3 text-xs text-neutral-500 hover:text-orange-400 transition flex items-center gap-1">
                + Add option
              </button>
            </div>
          ))}
        </div>

        {/* Submit */}
        <div className="flex flex-wrap gap-3 mt-8 animate-fade-up" style={{ animationDelay: "0.2s" }}>
          <button onClick={() => navigate("/")} className="btn btn-ghost">Cancel</button>
          <button onClick={handleSubmit} className="btn btn-primary flex-1 sm:flex-none sm:w-48">
            ☕ Create poll →
          </button>
        </div>
      </div>

      <footer className="border-t border-white/5 mt-16 py-6 text-center text-xs text-neutral-600">
        ☕ ChaiPoll · Made with ❤️ for the hackathon
      </footer>
    </div>
  );
};

export default CreatePoll;