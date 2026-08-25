import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Send,
  MessageSquare,
  Printer,
  Shield,
  MapPin,
  Calendar,
  AlertTriangle,
  User,
  FileText,
  BadgeCheck,
} from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { useData } from "../components/DataContext";
import { useAuth } from "../components/AuthContext";
import { toast } from "sonner";

export function ComplaintDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { complaints, addComplaintComment } = useData();
  const { userName, role } = useAuth();

  const complaint = complaints.find((c) => c.id === id);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);

  if (!complaint) {
    return (
      <div className="p-12 text-center text-slate-500 max-w-md mx-auto space-y-4">
        <AlertTriangle size={48} className="mx-auto text-amber-500" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Complaint Record Not Found</h2>
        <p className="text-xs text-slate-500">The requested reference docket "{id}" does not exist or was removed.</p>
        <button
          onClick={() => navigate("/complaints")}
          className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
        >
          <ArrowLeft size={14} /> Back to My Complaints
        </button>
      </div>
    );
  }

  const handleSend = () => {
    if (!newComment.trim()) return;
    setSending(true);
    setTimeout(() => {
      addComplaintComment(complaint.id, userName, role === "officer" ? "officer" : "citizen", newComment.trim());
      setNewComment("");
      setSending(false);
      toast.success("Follow-up response posted to case docket.");
    }, 400);
  };

  const handlePrint = () => {
    window.print();
  };

  const STEP_KEYS = ["submitted", "review", "progress", "resolved"] as const;
  const currentStepIndex = STEP_KEYS.indexOf(complaint.status as any);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Back button & Action bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("/complaints")}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Back to Complaints Directory
        </button>

        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition-colors"
        >
          <Printer size={13} className="text-emerald-600" />
          Print Docket Receipt
        </button>
      </div>

      {/* Header Docket Card */}
      <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                {complaint.id}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                  complaint.priority === "urgent"
                    ? "bg-red-100 text-red-700"
                    : complaint.priority === "high"
                    ? "bg-amber-100 text-amber-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {complaint.priority || "Normal"} Priority
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] dark:text-white leading-tight">
              {complaint.title}
            </h1>

            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="font-semibold text-slate-700 dark:text-slate-300">{complaint.category}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={12} className="text-emerald-600" /> {complaint.location}, {complaint.district}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={12} /> Filed {complaint.date}
              </span>
              {complaint.citizenName && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <User size={12} /> Filed by {complaint.citizenName}
                  </span>
                </>
              )}
            </div>
          </div>

          <div className="flex-shrink-0">
            <StatusBadge status={complaint.status} />
          </div>
        </div>
      </div>

      {/* Main 2 Column Grid */}
      <div className="grid md:grid-cols-[1.3fr_1fr] gap-6">
        {/* Left Column: Description + Evidence Photos + Discussion Thread */}
        <div className="space-y-6">
          {/* Description Card */}
          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3">
            <h2 className="font-bold text-sm text-[#0f172a] dark:text-white">Official Problem Description</h2>
            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {complaint.description}
            </p>

            {/* Photo Attachments if present */}
            {complaint.photos && complaint.photos.length > 0 && (
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Photo Evidence</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {complaint.photos.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center flex items-center justify-center gap-2"
                    >
                      <FileText size={16} className="text-emerald-600" />
                      <span className="text-xs text-slate-700 dark:text-slate-200 font-medium truncate">{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Officer Notes Card */}
          {complaint.officerNotes.length > 0 && (
            <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-3.5">
              <h2 className="font-bold text-sm text-[#0f172a] dark:text-white flex items-center gap-2">
                <BadgeCheck size={16} className="text-emerald-600" />
                Official Officer Field Remarks
              </h2>
              <div className="space-y-3">
                {complaint.officerNotes.map((note, i) => (
                  <div
                    key={i}
                    className="bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-2xl p-4 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                        <Shield size={13} /> {note.officer}
                      </span>
                      <span className="text-[10px] text-slate-400">{note.time}</span>
                    </div>
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-relaxed">{note.note}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Citizen & Officer Follow-up Discussion Thread */}
          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-sm text-[#0f172a] dark:text-white flex items-center gap-2">
                <MessageSquare size={16} className="text-emerald-600" />
                Case Follow-up Thread
              </h2>
              <span className="text-xs text-slate-400">{complaint.comments.length} updates</span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {complaint.comments.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No citizen follow-up messages on this docket yet.
                </div>
              ) : (
                complaint.comments.map((c) => (
                  <div
                    key={c.id}
                    className={`flex gap-2.5 ${c.role === "citizen" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: c.role === "officer" ? "#1d4ed8" : "#059669" }}
                    >
                      {c.author[0]}
                    </div>
                    <div className={`max-w-[80%] ${c.role === "citizen" ? "text-right" : "text-left"}`}>
                      <div className="text-[10px] text-slate-400 mb-0.5">
                        {c.author} • {c.time}
                      </div>
                      <div
                        className={`text-xs p-3 rounded-2xl leading-relaxed inline-block ${
                          c.role === "citizen"
                            ? "bg-emerald-600 text-white rounded-br-none"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none"
                        }`}
                      >
                        {c.text}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input message */}
            <div className="flex gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
              <input
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                placeholder="Type a follow-up query or update for the municipal inspector..."
                className="flex-1 px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 text-slate-900 dark:text-slate-100"
              />
              <button
                onClick={handleSend}
                disabled={sending || !newComment.trim()}
                className="px-4 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] disabled:opacity-40 text-white text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Send size={13} />
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Complete Lifecycle Timeline */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h2 className="font-bold text-sm text-[#0f172a] dark:text-white flex items-center gap-1.5">
              <Clock size={16} className="text-emerald-600" />
              Resolution Lifecycle & Timeline
            </h2>

            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-800">
              {complaint.timeline.map((t, i) => (
                <div key={i} className="relative">
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-[#059669] border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-xs">
                    <CheckCircle size={12} />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between">
                      <span>{t.label}</span>
                      <span className="text-[10px] text-slate-400 font-normal">{t.time}</span>
                    </div>
                    <div
                      className="text-[11px] text-[#059669] font-medium mt-0.5"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {t.bn}
                    </div>
                    {t.note && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-xl border border-slate-100 dark:border-slate-800">
                        {t.note}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
