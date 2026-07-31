import { useState } from "react";
import { Search, ThumbsUp, MessageSquare, Pin, Plus, X, Send, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useData } from "../components/DataContext";
import { useAuth } from "../components/AuthContext";
import { UserProfileModal } from "../components/UserProfileModal";
import { type Discussion, type DiscussionCategory } from "../data/mockData";

const CATEGORIES: ("All" | DiscussionCategory)[] = [
  "All", "Infrastructure", "Transportation", "Governance", "Health", "Education", "Environment", "Other",
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
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const dims = size === "sm" ? "w-6 h-6 text-[9px]" : "w-7 h-7 text-[10px]";
  return (
    <button
      onClick={onClick}
      title={onClick ? `View ${name}'s profile` : undefined}
      className={`${dims} rounded-full bg-[#0f172a] text-white font-bold flex items-center justify-center flex-shrink-0 ${onClick ? "hover:ring-2 hover:ring-[#059669] transition-all cursor-pointer" : ""}`}
    >
      {initials}
    </button>
  );
}

export function DiscussionsPage() {
  const { discussions, setDiscussions, discussionComments, addDiscussionComment, likedDiscussionIds, toggleDiscussionLike } = useData();
  const { userName, userId } = useAuth();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"All" | DiscussionCategory>("All");
  const [sort, setSort] = useState<SortKey>("latest");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ title: "", category: "Infrastructure" as DiscussionCategory, body: "" });
  const [myPending, setMyPending] = useState<string[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [commentDraft, setCommentDraft] = useState("");
  const [profileTarget, setProfileTarget] = useState<string | null>(null);

  const handleAddComment = (discussionId: string) => {
    if (!commentDraft.trim()) return;
    addDiscussionComment({
      id: `dc-${Date.now()}`,
      discussionId,
      authorId: userId,
      author: userName,
      body: commentDraft.trim(),
      createdAt: "Just now",
    });
    setCommentDraft("");
  };

  const filtered = discussions
    .filter((d) => {
      if (d.status === "pending" && !myPending.includes(d.id)) return false;
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
    const newDiscussion: Discussion = {
      id: `d-${Date.now()}`,
      title: form.title,
      category: form.category,
      author: "Demo User",
      body: form.body,
      likes: 0,
      comments: 0,
      status: "pending",
      pinned: false,
      createdAt: "Just now",
    };
    setDiscussions([...discussions, newDiscussion]);
    setMyPending((prev) => [...prev, newDiscussion.id]);
    setForm({ title: "", category: "Infrastructure", body: "" });
    setShowModal(false);
    toast.success("Submitted for review — visible after officer approval.");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Community Discussions</h1>
          <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            সামাজিক আলোচনা — নাগরিকদের মতামত
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#059669] text-white text-sm font-semibold rounded-xl hover:bg-[#047857] transition-colors flex-shrink-0"
        >
          <Plus size={15} /> New Discussion
        </button>
      </div>

      {/* Search + sort */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input
            type="text"
            placeholder="Search discussions…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors bg-white"
          />
        </div>
        <div className="flex gap-1 bg-[#f1f5f9] p-1 rounded-xl">
          {(Object.keys(SORT_LABELS) as SortKey[]).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
              style={{
                background: sort === s ? "#fff" : "transparent",
                color: sort === s ? "#0f172a" : "#64748b",
                boxShadow: sort === s ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {SORT_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Category chips */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-all border"
            style={{
              background: category === cat ? "#0f172a" : "#fff",
              color: category === cat ? "#fff" : "#64748b",
              borderColor: category === cat ? "#0f172a" : "#e2e8f0",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Discussions list */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#94a3b8]">
            <div className="text-4xl mb-3">💬</div>
            <div className="font-semibold">No discussions found</div>
            <div className="text-sm">Try adjusting your filters or start a new discussion</div>
          </div>
        ) : (
          filtered.map((d) => {
            const isExpanded = expandedId === d.id;
            const isLiked = likedDiscussionIds.has(d.id);
            const threadComments = discussionComments.filter((c) => c.discussionId === d.id);
            return (
              <div
                key={d.id}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-5 hover:border-[#059669] transition-colors"
                style={{ borderColor: d.status === "pending" ? "#fca5a5" : undefined }}
              >
                <div className="flex items-start gap-4">
                  <AuthorAvatar name={d.author} onClick={() => setProfileTarget(d.author)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1.5">
                      {d.pinned && (
                        <span className="flex items-center gap-1 text-[10px] font-semibold text-[#d97706]">
                          <Pin size={9} /> Pinned
                        </span>
                      )}
                      {d.status === "pending" && (
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#fef2f2] text-[#dc2626]">
                          Pending approval
                        </span>
                      )}
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: `${CAT_COLORS[d.category] ?? "#64748b"}15`, color: CAT_COLORS[d.category] ?? "#64748b" }}
                      >
                        {d.category}
                      </span>
                    </div>
                    <button className="font-semibold text-sm text-[#0f172a] mb-1 text-left hover:text-[#059669] transition-colors" onClick={() => setExpandedId(isExpanded ? null : d.id)}>
                      {d.title}
                    </button>
                    <div className={`text-xs text-[#64748b] leading-relaxed ${isExpanded ? "" : "line-clamp-2"}`}>{d.body}</div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-[#94a3b8]">
                      <button
                        onClick={() => setProfileTarget(d.author)}
                        className="font-medium text-[#64748b] hover:text-[#059669] hover:underline transition-colors"
                      >
                        {d.author}
                      </button>
                      <span>{d.createdAt}</span>
                      <button
                        onClick={() => toggleDiscussionLike(d.id)}
                        className="flex items-center gap-1 transition-colors"
                        style={{ color: isLiked ? "#059669" : undefined }}
                      >
                        <ThumbsUp size={11} fill={isLiked ? "#059669" : "none"} />{d.likes}
                      </button>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : d.id)}
                        className="flex items-center gap-1 hover:text-[#059669] transition-colors"
                      >
                        <MessageSquare size={11} />{d.comments}
                        {isExpanded ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                      </button>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-[#f1f5f9] space-y-3">
                        {threadComments.length === 0 ? (
                          <div className="text-xs text-[#94a3b8]">No comments yet — be the first to weigh in.</div>
                        ) : (
                          threadComments.map((c) => (
                            <div key={c.id} className="flex items-start gap-2.5">
                              <AuthorAvatar name={c.author} size="sm" onClick={() => setProfileTarget(c.author)} />
                              <div className="flex-1 min-w-0 bg-[#f8fafc] rounded-xl px-3 py-2">
                                <div className="flex items-center gap-2">
                                  <button onClick={() => setProfileTarget(c.author)} className="text-xs font-semibold text-[#0f172a] hover:text-[#059669] hover:underline">
                                    {c.author}
                                  </button>
                                  <span className="text-[10px] text-[#94a3b8]">{c.createdAt}</span>
                                </div>
                                <div className="text-xs text-[#475569] mt-0.5 leading-relaxed">{c.body}</div>
                              </div>
                            </div>
                          ))
                        )}
                        <div className="flex items-center gap-2 pt-1">
                          <AuthorAvatar name={userName} size="sm" />
                          <input
                            value={commentDraft}
                            onChange={(e) => setCommentDraft(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") handleAddComment(d.id); }}
                            placeholder="Add a comment…"
                            className="flex-1 px-3 py-1.5 text-xs border border-[#e2e8f0] rounded-full outline-none focus:border-[#059669] transition-colors"
                          />
                          <button
                            onClick={() => handleAddComment(d.id)}
                            className="p-1.5 rounded-full bg-[#059669] text-white hover:bg-[#047857] transition-colors flex-shrink-0"
                            title="Post comment"
                          >
                            <Send size={12} />
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

      {/* Submit modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <h3 className="font-semibold text-sm">Start a Discussion</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-[#f8fafc] transition-colors">
                <X size={16} className="text-[#64748b]" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Title</label>
                <input
                  type="text"
                  placeholder="Discussion topic…"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as DiscussionCategory }))}
                  className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors bg-white"
                >
                  {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Description</label>
                <textarea
                  rows={4}
                  placeholder="Share your thoughts, proposal, or concern in detail…"
                  value={form.body}
                  onChange={(e) => setForm((f) => ({ ...f, body: e.target.value }))}
                  className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors resize-none"
                />
              </div>
              <p className="text-xs text-[#94a3b8]">Your discussion will be reviewed by an officer before it becomes publicly visible.</p>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-[#e2e8f0] rounded-xl hover:bg-[#f8fafc] transition-colors">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="px-5 py-2 text-sm font-semibold bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors">
                  Submit for Review
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
