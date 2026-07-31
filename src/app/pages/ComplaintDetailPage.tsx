import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, CheckCircle, Clock, Send, MessageSquare } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { COMPLAINTS, type Comment } from "../data/mockData";

export function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const complaint = COMPLAINTS.find((c) => c.id === id);
  const [comments, setComments] = useState<Comment[]>(complaint?.comments ?? []);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);

  if (!complaint) {
    return (
      <div className="p-6 text-center text-[#64748b]">
        <p className="text-lg font-semibold mb-2">Complaint not found</p>
        <button onClick={() => navigate("/complaints")} className="text-sm text-[#059669] hover:underline">
          ← Back to complaints
        </button>
      </div>
    );
  }

  const handleSend = () => {
    if (!newComment.trim()) return;
    setSending(true);
    setTimeout(() => {
      setComments((c) => [...c, {
        id: `c${Date.now()}`,
        author: "You",
        role: "citizen",
        text: newComment.trim(),
        time: "Just now",
      }]);
      setNewComment("");
      setSending(false);
    }, 500);
  };

  const STEP_LABELS: Record<string, { label: string; bn: string }> = {
    submitted: { label: "Submitted", bn: "দাখিল করা হয়েছে" },
    review: { label: "Under Review", bn: "পর্যালোচনায়" },
    progress: { label: "In Progress", bn: "প্রক্রিয়াধীন" },
    resolved: { label: "Resolved", bn: "সমাধান হয়েছে" },
    rejected: { label: "Rejected", bn: "প্রত্যাখ্যাত" },
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Back + header */}
      <div>
        <button onClick={() => navigate("/complaints")}
          className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f172a] transition-colors mb-4 group">
          <ArrowLeft size={15} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to complaints
        </button>
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-mono text-[#94a3b8] mb-1">{complaint.id}</div>
            <h1 className="text-xl font-bold text-[#0f172a]">{complaint.title}</h1>
            <div className="flex items-center gap-3 mt-2 text-xs text-[#64748b]">
              <span>{complaint.category}</span>
              <span>·</span>
              <span>{complaint.location}</span>
              <span>·</span>
              <span className="flex items-center gap-1"><Clock size={10} />{complaint.date}</span>
            </div>
          </div>
          <StatusBadge status={complaint.status} />
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        {/* Left: description + comments */}
        <div className="space-y-5">
          {/* Description */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
            <h2 className="font-semibold text-sm mb-3">Description</h2>
            <p className="text-sm text-[#64748b] leading-relaxed">{complaint.description}</p>
          </div>

          {/* Officer notes */}
          {complaint.officerNotes.length > 0 && (
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
              <h2 className="font-semibold text-sm mb-4">Officer Notes</h2>
              <div className="space-y-4">
                {complaint.officerNotes.map((note, i) => (
                  <div key={i} className="bg-[#f0fdf4] border border-[#a7f3d0] rounded-xl px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-[#059669]">{note.officer}</span>
                      <span className="text-[10px] text-[#94a3b8]">{note.time}</span>
                    </div>
                    <p className="text-sm text-[#0f172a] leading-relaxed">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Comment thread */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
            <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <MessageSquare size={15} />
              Discussion Thread
              <span className="text-xs text-[#94a3b8] font-normal">({comments.length} messages)</span>
            </h2>

            {comments.length === 0 && (
              <p className="text-sm text-[#94a3b8] text-center py-4">No messages yet. Be the first to comment.</p>
            )}

            <div className="space-y-4 mb-5">
              {comments.map((c) => (
                <div key={c.id} className={`flex gap-3 ${c.role === "citizen" ? "flex-row-reverse" : ""}`}>
                  <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: c.role === "officer" ? "#1d4ed8" : "#059669" }}>
                    {c.author[0]}
                  </div>
                  <div className={`max-w-xs ${c.role === "citizen" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                    <div className="text-[10px] text-[#94a3b8]">{c.author} · {c.time}</div>
                    <div className="text-sm px-3.5 py-2.5 rounded-2xl leading-relaxed"
                      style={{
                        background: c.role === "citizen" ? "#ecfdf5" : "#f8fafc",
                        color: "#0f172a",
                        borderRadius: c.role === "citizen" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      }}>
                      {c.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 pt-4 border-t border-[#f1f5f9]">
              <textarea value={newComment} onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                placeholder="Add a comment or follow-up question…"
                rows={2}
                className="flex-1 px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors resize-none" />
              <button onClick={handleSend} disabled={!newComment.trim() || sending}
                className="p-2.5 rounded-xl text-white bg-[#059669] hover:bg-[#047857] transition-colors disabled:opacity-40 disabled:cursor-not-allowed self-end">
                {sending ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin block" /> : <Send size={16} />}
              </button>
            </div>
          </div>
        </div>

        {/* Right: timeline */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5 h-fit">
          <h2 className="font-semibold text-sm mb-5">Status Timeline</h2>
          <div className="space-y-0">
            {complaint.timeline.map((entry, idx) => {
              const isLast = idx === complaint.timeline.length - 1;
              const info = STEP_LABELS[entry.status];
              return (
                <div key={idx} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: isLast ? "#059669" : "#ecfdf5", border: `2px solid ${isLast ? "#059669" : "#a7f3d0"}` }}>
                      {isLast && complaint.status !== "rejected"
                        ? <CheckCircle size={14} className="text-white" />
                        : <div className="w-2 h-2 rounded-full" style={{ background: "#059669" }} />}
                    </div>
                    {idx < complaint.timeline.length - 1 && (
                      <div className="w-px flex-1 my-1 bg-[#e2e8f0]" style={{ minHeight: "32px" }} />
                    )}
                  </div>
                  <div className="pb-6 last:pb-0">
                    <div className="text-sm font-semibold text-[#0f172a]">{info.label}</div>
                    <div className="text-xs text-[#059669]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>{info.bn}</div>
                    <div className="text-[11px] text-[#94a3b8] mt-0.5 flex items-center gap-1">
                      <Clock size={10} />{entry.time}
                    </div>
                    {entry.note && (
                      <div className="text-xs text-[#64748b] mt-1 leading-relaxed">{entry.note}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
