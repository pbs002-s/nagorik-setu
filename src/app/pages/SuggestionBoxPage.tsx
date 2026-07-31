import { useState } from "react";
import { ChevronUp, ChevronDown, Plus, X } from "lucide-react";
import { toast } from "sonner";
import { useData } from "../components/DataContext";
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
  const { suggestions, setSuggestions } = useData();
  const [sort, setSort] = useState<SortKey>("votes");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", body: "" });
  const [myVotes, setMyVotes] = useState<Record<string, "up" | "down" | null>>({});

  const sorted = [...suggestions].sort((a, b) => {
    if (sort === "votes") return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    if (sort === "status") {
      const order: SuggestionStatus[] = ["implemented", "accepted", "review", "submitted", "declined"];
      return order.indexOf(a.status) - order.indexOf(b.status);
    }
    return 0;
  });

  const vote = (id: string, direction: "up" | "down") => {
    const current = myVotes[id];
    setSuggestions(suggestions.map((s) => {
      if (s.id !== id) return s;
      let { upvotes, downvotes } = s;
      if (current === direction) {
        if (direction === "up") upvotes--;
        else downvotes--;
        setMyVotes((v) => ({ ...v, [id]: null }));
      } else {
        if (current === "up") upvotes--;
        if (current === "down") downvotes--;
        if (direction === "up") upvotes++;
        else downvotes++;
        setMyVotes((v) => ({ ...v, [id]: direction }));
      }
      return { ...s, upvotes, downvotes };
    }));
  };

  const handleSubmit = () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Please fill in both fields.");
      return;
    }
    const newSuggestion: Suggestion = {
      id: `sg-${Date.now()}`,
      title: form.title,
      body: form.body,
      author: "Demo User",
      upvotes: 0,
      downvotes: 0,
      status: "submitted",
      createdAt: "Just now",
    };
    setSuggestions([newSuggestion, ...suggestions]);
    setForm({ title: "", body: "" });
    setShowForm(false);
    toast.success("Suggestion submitted! It will be reviewed by the platform team.");
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Suggestion Box</h1>
          <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            পরামর্শ বাক্স — আপনার মতামত দিন
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#059669] text-white text-sm font-semibold rounded-xl hover:bg-[#047857] transition-colors flex-shrink-0"
        >
          <Plus size={15} /> New Suggestion
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm">Submit a Suggestion</div>
            <button onClick={() => setShowForm(false)} className="p-1 rounded-lg hover:bg-[#f8fafc]"><X size={15} className="text-[#64748b]" /></button>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Title</label>
            <input
              type="text"
              placeholder="Brief summary of your suggestion…"
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Idea Description</label>
            <textarea
              rows={4}
              placeholder="Describe your idea in detail — what problem does it solve?"
              value={form.body}
              onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors resize-none"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm border border-[#e2e8f0] rounded-xl hover:bg-[#f8fafc] transition-colors">Cancel</button>
            <button onClick={handleSubmit} className="px-5 py-2 text-sm font-semibold bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors">
              Submit Suggestion
            </button>
          </div>
        </div>
      )}

      {/* Sort */}
      <div className="flex gap-1 bg-[#f1f5f9] p-1 rounded-xl w-fit">
        {([["votes", "Top Voted"], ["latest", "Latest"], ["status", "By Status"]] as [SortKey, string][]).map(([k, label]) => (
          <button
            key={k}
            onClick={() => setSort(k)}
            className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: sort === k ? "#fff" : "transparent",
              color: sort === k ? "#0f172a" : "#64748b",
              boxShadow: sort === k ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Suggestions */}
      <div className="space-y-3">
        {sorted.map((s) => {
          const netVotes = s.upvotes - s.downvotes;
          const myVote = myVotes[s.id] ?? null;
          const statusStyle = STATUS_STYLE[s.status];
          return (
            <div key={s.id} className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex gap-4">
              {/* Vote column */}
              <div className="flex flex-col items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => vote(s.id, "up")}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all"
                  style={{
                    background: myVote === "up" ? "#ecfdf5" : "#fff",
                    borderColor: myVote === "up" ? "#059669" : "#e2e8f0",
                    color: myVote === "up" ? "#059669" : "#94a3b8",
                  }}
                >
                  <ChevronUp size={16} />
                </button>
                <span
                  className="text-base font-extrabold tabular-nums"
                  style={{ color: netVotes > 0 ? "#059669" : netVotes < 0 ? "#dc2626" : "#94a3b8" }}
                >
                  {netVotes > 0 ? "+" : ""}{netVotes}
                </span>
                <button
                  onClick={() => vote(s.id, "down")}
                  className="w-8 h-8 rounded-lg border flex items-center justify-center transition-all"
                  style={{
                    background: myVote === "down" ? "#fef2f2" : "#fff",
                    borderColor: myVote === "down" ? "#dc2626" : "#e2e8f0",
                    color: myVote === "down" ? "#dc2626" : "#94a3b8",
                  }}
                >
                  <ChevronDown size={16} />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-[#0f172a] flex-1">{s.title}</span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: statusStyle.bg, color: statusStyle.color }}>
                    {statusStyle.label}
                  </span>
                </div>
                <div className="text-xs text-[#64748b] leading-relaxed line-clamp-2 mb-2">{s.body}</div>
                <div className="flex items-center gap-3 text-[11px] text-[#94a3b8]">
                  <span className="font-medium text-[#64748b]">{s.author}</span>
                  <span>{s.createdAt}</span>
                  <span>{s.upvotes} upvotes · {s.downvotes} downvotes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
