import { useState } from "react";
import { Search, ThumbsUp, MessageSquare, Pin, Plus, X, Send, ChevronDown, ChevronUp, Sparkles, Filter } from "lucide-react";
import { toast } from "sonner";
import { useData } from "../components/DataContext";
import { useAuth } from "../components/AuthContext";
import { UserProfileModal } from "../components/UserProfileModal";
import { type DiscussionCategory } from "../data/mockData";

const CATEGORIES: ("All" | DiscussionCategory)[] = [
  "All",
  "Infrastructure",
  "Transportation",
  "Governance",
  "Health",
  "Education",
  "Environment",
  "Other",
];

const CAT_COLORS: Record<string, string> = {
  Infrastructure: "#1d4ed8",
  Transportation: "#d97706",
  Governance: "#7c3aed",
  Health: "#dc2626",
  Education: "#059669",
  Environment: "#0891b2",
  Other: "#64748b",
};

type SortKey = "latest" | "trending" | "liked";

const SORT_LABELS: Record<SortKey, string> = { latest: "Latest", trending: "Trending", liked: "Most Liked" };

function AuthorAvatar({ name, onClick, size = "md" }: { name: string; onClick?: () => void; size?: "sm" | "md" }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const dims = size === "sm" ? "w-6 h-6 text-[9px]" : "w-8 h-8 text-xs";
  return (
    <button
      onClick={onClick}
      title={onClick ? `View ${name}'s profile` : undefined}
      className={`${dims} rounded-full bg-slate-900 text-white font-bold flex items-center justify-center flex-shrink-0 ${
        onClick ? "hover:ring-2 hover:ring-[#059669] transition-all cursor-pointer shadow-xs" : ""
      }`}
    >
      {initials}
    </button>
  );
}

export function DiscussionsPage() {
  const {
    discussions,
    addDiscussion,
    discussionComments,
    addDiscussionComment,
    likedDiscussionIds,
    toggleDiscussionLike,
  } = useData();
  const { userName, userId } = useAuth();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | DiscussionCategory>("All");
  const [sort, setSort] = useState<SortKey>("latest");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Infrastructure" as DiscussionCategory, body: "" });
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [profileTarget, setProfileTarget] = useState<string | null>(null);

  const handleAddComment = (discussionId: string) => {
    if (!commentDraft.trim()) return;
    addDiscussionComment(discussionId, userName, userId, commentDraft.trim());
    setCommentDraft("");
  };

  const filtered = discussions
    .filter((d) => {
      // allow seeing approved discussions and also user's own submitted discussions
      if (d.status === "pending" && d.author !== userName && d.author !== "Demo User") return false;
      if (category !== "All" && d.category !== category) return false;
      if (query) {
        const q = query.toLowerCase();
        if (!d.title.toLowerCase().includes(q) && !d.body.toLowerCase().includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      if (sort === "liked") return b.likes - a.likes;
      if (sort === "trending") return b.likes + b.comments - (a.likes + a.comments);
      return 0;
    });

  const handleSubmit = () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Please fill in the title and description.");
      return;
    }
    addDiscussion({
      title: form.title.trim(),
      category: form.category,
      author: userName || "Demo User",
      body: form.body.trim(),
    });
    setForm({ title: "", category: "Infrastructure", body: "" });
    setShowModal(false);
    toast.success("Submitted for review — awards +25 Civic Points!");
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white">Community Civic Discussions</h1>
          <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            নাগরিকদের মতামত, মুক্ত আলোচনা ও সংস্কার প্রস্তাবনা
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-[#059669] text-white text-xs font-bold rounded-2xl hover:bg-[#047857] shadow-md transition-all flex-shrink-0"
        >
          <Plus size={16} /> Start a Discussion (+25 pts)
        </button>
      </div>

      {/* Search + Sort */}
      <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex gap-3 flex-col sm:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search discussions by topic, keywords or author..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
            />
          </div>
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(Object.keys(SORT_LABELS) as SortKey[]).map((s) => (
              <button
                key={s}
                onClick={() => setSort(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  sort === s
                    ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {SORT_LABELS[s]}
              </button>
            ))}
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border"
              style={{
                background: category === cat ? "#059669" : "transparent",
                color: category === cat ? "#fff" : "#64748b",
                borderColor: category === cat ? "#059669" : "#e2e8f0",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Discussions list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#94a3b8] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="text-4xl mb-3">💬</div>
            <div className="font-bold text-base text-slate-800 dark:text-white">No discussions found</div>
            <div className="text-xs text-slate-500 mt-1">Try adjusting your filters or start a new discussion.</div>
          </div>
        ) : (
          filtered.map((d) => {
            const isExpanded = expandedId === d.id;
            const isLiked = likedDiscussionIds.has(d.id);
            const threadComments = discussionComments.filter((c) => c.discussionId === d.id);
            return (
              <div
                key={d.id}
                className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-5 sm:p-6 hover:border-emerald-500/60 shadow-xs transition-all"
                style={{ borderColor: d.status === "pending" ? "#fca5a5" : undefined }}
              >
                <div className="flex items-start gap-4">
                  <AuthorAvatar name={d.author} onClick={() => setProfileTarget(d.author)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {d.pinned && (
                        <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          <Pin size={10} /> Official Pin
                        </span>
                      )}
                      {d.status === "pending" && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-50 text-red-700 border border-red-200">
                          Pending Officer Approval
                        </span>
                      )}
                      <span
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{
                          background: `${CAT_COLORS[d.category] ?? "#64748b"}15`,
                          color: CAT_COLORS[d.category] ?? "#64748b",
                        }}
                      >
                        {d.category}
                      </span>
                    </div>

                    <button
                      className="font-bold text-sm sm:text-base text-[#0f172a] dark:text-white mb-1.5 text-left hover:text-emerald-600 transition-colors block"
                      onClick={() => setExpandedId(isExpanded ? null : d.id)}
                    >
                      {d.title}
                    </button>
                    <div
                      className={`text-xs text-slate-600 dark:text-slate-300 leading-relaxed ${
                        isExpanded ? "" : "line-clamp-2"
                      }`}
                    >
                      {d.body}
                    </div>

                    <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400">
                      <button
                        onClick={() => setProfileTarget(d.author)}
                        className="font-semibold text-slate-700 dark:text-slate-300 hover:text-emerald-600 hover:underline transition-colors"
                      >
                        {d.author}
                      </button>
                      <span>•</span>
                      <span>{d.createdAt}</span>
                      <button
                        onClick={() => toggleDiscussionLike(d.id)}
                        className="flex items-center gap-1.5 transition-colors hover:text-emerald-600 font-semibold"
                        style={{ color: isLiked ? "#059669" : undefined }}
                      >
                        <ThumbsUp size={13} fill={isLiked ? "#059669" : "none"} />
                        <span>{d.likes}</span>
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : d.id)}
                        className="flex items-center gap-1.5 hover:text-emerald-600 transition-colors font-semibold"
                      >
                        <MessageSquare size={13} />
                        <span>{d.comments} comments</span>
                        {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                        {threadComments.length === 0 ? (
                          <div className="text-xs text-slate-400 py-2">
                            No comments yet — be the first to contribute to this discussion.
                          </div>
                        ) : (
                          threadComments.map((c) => (
                            <div key={c.id} className="flex items-start gap-2.5">
                              <AuthorAvatar name={c.author} size="sm" onClick={() => setProfileTarget(c.author)} />
                              <div className="flex-1 min-w-0 bg-slate-50 dark:bg-slate-800 rounded-2xl px-3.5 py-2.5">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => setProfileTarget(c.author)}
                                    className="text-xs font-bold text-slate-900 dark:text-white hover:text-emerald-600 hover:underline"
                                  >
                                    {c.author}
                                  </button>
                                  <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                                </div>
                                <div className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                                  {c.body}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                        <div className="flex items-center gap-2 pt-2">
                          <AuthorAvatar name={userName} size="sm" />
                          <input
                            value={commentDraft}
                            onChange={(e) => setCommentDraft(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") handleAddComment(d.id);
                            }}
                            placeholder="Share your perspective or propose a solution..."
                            className="flex-1 px-4 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-full outline-none focus:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                          />
                          <button
                            onClick={() => handleAddComment(d.id)}
                            className="p-2 rounded-full bg-[#059669] text-white hover:bg-[#047857] transition-colors flex-shrink-0"
                            title="Post comment"
                          >
                            <Send size={13} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Submit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-base text-slate-900 dark:text-white">Start a New Discussion</h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-400"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Discussion Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Modernizing public bus schedules with GPS tracking"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Category *
                </label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as DiscussionCategory }))}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 cursor-pointer"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Proposal & Description *
                </label>
                <textarea
                  rows={4}
                  placeholder="Explain your proposal, reasoning, and benefits for citizens..."
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 resize-none leading-relaxed"
                />
              </div>
              <p className="text-xs text-slate-400">
                Your discussion will be queued for municipal moderation to maintain respectful discourse.
              </p>
              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-5 py-2 text-xs font-bold bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors shadow-sm"
                >
                  Submit for Review 🚀
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {profileTarget && <UserProfileModal name={profileTarget} onClose={() => setProfileTarget(null)} />}
    </div>
  );
}
