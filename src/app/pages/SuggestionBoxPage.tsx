import { useState } from "react";
import { ChevronUp, ChevronDown, Plus, X, Lightbulb, Sparkles, Filter, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { useData } from "../components/DataContext";
import { useAuth } from "../components/AuthContext";
import { type Suggestion, type SuggestionStatus } from "../data/mockData";

type SortKey = "votes" | "latest" | "status";

const STATUS_STYLE: Record<SuggestionStatus, { label: string; bg: string; color: string }> = {
  submitted: { label: "Submitted", bg: "#f1f5f9", color: "#64748b" },
  review: { label: "Under Review", bg: "#fef3c7", color: "#d97706" },
  accepted: { label: "Accepted", bg: "#eff6ff", color: "#1d4ed8" },
  implemented: { label: "Implemented", bg: "#ecfdf5", color: "#059669" },
  declined: { label: "Declined", bg: "#fef2f2", color: "#dc2626" },
};

export function SuggestionBoxPage() {
  const { suggestions, addSuggestion, voteSuggestion, votedSuggestionIds } = useData();
  const { userName } = useAuth();
  const [sort, setSort] = useState<SortKey>("votes");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });

  const sorted = [...suggestions].sort((a, b) => {
    if (sort === "votes") return b.upvotes - b.downvotes - (a.upvotes - a.downvotes);
    if (sort === "status") {
      const order: SuggestionStatus[] = ["implemented", "accepted", "review", "submitted", "declined"];
      return order.indexOf(a.status) - order.indexOf(b.status);
    }
    return 0;
  });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Please fill in both the title and idea description.");
      return;
    }
    addSuggestion({
      title: form.title.trim(),
      body: form.body.trim(),
      author: userName || "Demo User",
    });
    setForm({ title: "", body: "" });
    setShowForm(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white">Civic Suggestion Box</h1>
          <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            পরামর্শ বাক্স — শহর ও নাগরিক সেবা উন্নয়নে আপনার উদ্ভাবনী ধারণা
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#059669] text-white text-xs font-bold rounded-2xl hover:bg-[#047857] shadow-md transition-all flex-shrink-0"
        >
          <Plus size={16} /> Submit Suggestion (+30 pts)
        </button>
      </div>

      {/* Inline Submission Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md space-y-4 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between">
            <div className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Lightbulb size={18} className="text-amber-500" />
              Propose an Idea for Municipal Improvement
            </div>
            <button
              onClick={() => setShowForm(false)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
            >
              <X size={16} />
            </button>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Idea Summary / Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Free public water filtration kiosks in busy transit hubs"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Detailed Proposal & Civic Benefit *
            </label>
            <textarea
              rows={4}
              placeholder="Describe your idea in detail — what specific issue does it address, and how can city corporations implement it?"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none leading-relaxed"
            />
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button
              onClick={() => setShowForm(false)}
              className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-5 py-2 text-xs font-bold bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors shadow-sm"
            >
              Submit Proposal 🚀
            </button>
          </div>
        </div>
      )}

      {/* Sorting pills */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl w-fit">
        {(
          [
            ["votes", "Top Community Upvoted"],
            ["latest", "Latest Submissions"],
            ["status", "By Implementation Status"],
          ] as [SortKey, string][]
        ).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setSort(k)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              sort === k ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm" : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Suggestion Cards Stream */}
      <div className="space-y-4">
        {sorted.map((s) => {
          const style = STATUS_STYLE[s.status] ?? STATUS_STYLE.submitted;
          const userVote = votedSuggestionIds[s.id];
          const netScore = s.upvotes - s.downvotes;

          return (
            <div
              key={s.id}
              className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-5 sm:p-6 hover:border-emerald-500/50 shadow-xs transition-all flex items-start gap-4"
            >
              {/* Upvote / Downvote column */}
              <div className="flex flex-col items-center gap-1 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-2xl border border-slate-200 dark:border-slate-700 flex-shrink-0">
                <button
                  onClick={() => voteSuggestion(s.id, "up")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    userVote === "up" ? "bg-emerald-600 text-white" : "text-slate-400 hover:text-emerald-600 hover:bg-slate-100"
                  }`}
                  title="Upvote idea"
                >
                  <ChevronUp size={18} />
                </button>
                <span
                  className={`text-xs font-black tabular-nums ${
                    netScore > 0 ? "text-emerald-600" : netScore < 0 ? "text-red-500" : "text-slate-500"
                  }`}
                >
                  {netScore}
                </span>
                <button
                  onClick={() => voteSuggestion(s.id, "down")}
                  className={`p-1.5 rounded-lg transition-colors ${
                    userVote === "down" ? "bg-red-600 text-white" : "text-slate-400 hover:text-red-600 hover:bg-slate-100"
                  }`}
                  title="Downvote idea"
                >
                  <ChevronDown size={18} />
                </button>
              </div>

              {/* Main Info */}
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 dark:text-white leading-snug">
                    {s.title}
                  </h3>
                  <span
                    className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full flex-shrink-0"
                    style={{ background: style.bg, color: style.color }}
                  >
                    {style.label}
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{s.body}</p>

                <div className="flex items-center gap-3 pt-2 text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <span>Proposed by {s.author}</span>
                  <span>•</span>
                  <span>{s.createdAt}</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">{s.upvotes} citizens supported</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
