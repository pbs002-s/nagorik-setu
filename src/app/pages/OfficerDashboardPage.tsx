import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Plus,
  BarChart2,
  Layers,
  Clock,
  Users,
  ListChecks,
  FileText,
  AlertTriangle,
  Send,
  MessageSquare,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  PieChart as PieIcon,
  Radio,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { toast } from "sonner";
import { useData } from "../components/DataContext";
import { useAuth } from "../components/AuthContext";
import { StatusBadge } from "../components/StatusBadge";
import {
  type Poll,
  type Service,
  type ComplaintStatus,
  type AnnouncementType,
  BANGLADESH_DIVISIONS,
  ADMIN_VOLUME,
  ADMIN_CATEGORIES,
} from "../data/mockData";

type Tab = "overview" | "complaints" | "analytics" | "queue" | "add-poll" | "add-service" | "broadcast";

const DISTRICTS = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Sylhet", "Barisal", "Mymensingh", "Rangpur"];
const SERVICE_CATEGORIES = [
  "Identity & Civil Status",
  "Business & Licensing",
  "Financial & Property",
  "Public Services",
] as const;

const CHART_COLORS = ["#059669", "#1d4ed8", "#d97706", "#7c3aed", "#0891b2", "#dc2626"];

function KpiCard({
  label,
  value,
  icon,
  color,
  onClick,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-5 flex items-start gap-4 text-left w-full transition-all duration-200 ${
        onClick ? "hover:border-emerald-500 hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : ""
      }`}
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs"
        style={{ background: `${color}18`, color }}
      >
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black tabular-nums tracking-tight" style={{ color }}>
          {value}
        </div>
        <div className="text-xs font-bold text-[#0f172a] dark:text-white mt-0.5">{label}</div>
        {onClick && <div className="text-[10px] text-emerald-600 font-semibold mt-1">Manage →</div>}
      </div>
    </button>
  );
}

export function OfficerDashboardPage() {
  const {
    complaints,
    updateComplaintStatus,
    addOfficerNote,
    discussions,
    approveDiscussion,
    rejectDiscussion,
    suggestions,
    updateSuggestionStatus,
    polls,
    addPoll,
    services,
    addService,
    announcements,
    addAnnouncement,
  } = useData();

  const { userName } = useAuth();
  const [tab, setTab] = useState<Tab>("overview");

  // Complaint modal & filter state
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [complaintFilter, setComplaintFilter] = useState<string>("all");
  const [officerNoteInput, setOfficerNoteInput] = useState("");
  const [newStatus, setNewStatus] = useState<ComplaintStatus>("progress");

  // Poll form state
  const [pollForm, setPollForm] = useState({
    question: "",
    area: "Dhaka",
    options: ["", "", "", ""],
    closeDate: "14 days",
  });

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    name: "",
    nameBn: "",
    category: "Public Services" as typeof SERVICE_CATEGORIES[number],
    description: "",
    url: "",
  });

  // Emergency Broadcaster form state
  const [broadcastForm, setBroadcastForm] = useState({
    title: "",
    body: "",
    type: "emergency" as AnnouncementType,
  });

  const pendingDiscussions = discussions.filter((d) => d.status === "pending");
  const pendingSuggestions = suggestions.filter((s) => s.status === "submitted");
  const activePollsCount = polls.filter((p) => !p.closed).length;
  const pendingComplaintsCount = complaints.filter((c) => c.status !== "resolved" && c.status !== "rejected").length;

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId);

  const handleUpdateComplaint = () => {
    if (!selectedComplaintId) return;
    updateComplaintStatus(selectedComplaintId, newStatus, userName || "Officer Rahman", officerNoteInput.trim() || undefined);
    setOfficerNoteInput("");
    setSelectedComplaintId(null);
  };

  const handleAddPoll = () => {
    const filledOptions = pollForm.options.filter((o) => o.trim());
    if (!pollForm.question.trim() || filledOptions.length < 2) {
      toast.error("Please enter a question and at least 2 options.");
      return;
    }
    addPoll({
      title: pollForm.question.trim(),
      area: pollForm.area,
      closesIn: pollForm.closeDate || "14 days",
      options: filledOptions.map((label) => ({ label: label.trim(), votes: 0 })),
    });
    setPollForm({ question: "", area: "Dhaka", options: ["", "", "", ""], closeDate: "14 days" });
    setTab("overview");
  };

  const handleAddService = () => {
    if (!serviceForm.name.trim() || !serviceForm.description.trim() || !serviceForm.url.trim()) {
      toast.error("Please fill in the service name, description, and portal URL.");
      return;
    }
    const normalizedUrl = /^https?:\/\//i.test(serviceForm.url.trim())
      ? serviceForm.url.trim()
      : `https://${serviceForm.url.trim()}`;

    addService({
      name: serviceForm.name.trim(),
      nameBn: serviceForm.nameBn.trim() || serviceForm.name.trim(),
      category: serviceForm.category,
      description: serviceForm.description.trim(),
      icon: "Globe",
      url: normalizedUrl,
    });
    setServiceForm({ name: "", nameBn: "", category: "Public Services", description: "", url: "" });
    setTab("overview");
  };

  const handleBroadcastAlert = () => {
    if (!broadcastForm.title.trim() || !broadcastForm.body.trim()) {
      toast.error("Please enter alert title and bulletin body.");
      return;
    }
    addAnnouncement({
      title: broadcastForm.title.trim(),
      body: broadcastForm.body.trim(),
      type: broadcastForm.type,
    });
    setBroadcastForm({ title: "", body: "", type: "emergency" });
    setTab("overview");
  };

  // Category breakdown chart data
  const categoryData = ADMIN_CATEGORIES.map((cat, idx) => ({
    name: cat.category,
    value: cat.count,
    color: CHART_COLORS[idx % CHART_COLORS.length],
  }));

  const filteredComplaints = complaints.filter((c) => {
    if (complaintFilter === "all") return true;
    return c.status === complaintFilter;
  });

  const TABS: { id: Tab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "complaints", label: "Manage Complaints", icon: FileText, badge: pendingComplaintsCount },
    { id: "analytics", label: "Civic Analytics", icon: TrendingUp },
    {
      id: "queue",
      label: "Moderation Queue",
      icon: ListChecks,
      badge: pendingDiscussions.length + pendingSuggestions.length,
    },
    { id: "add-poll", label: "Launch Poll", icon: Plus },
    { id: "add-service", label: "Add Service", icon: Layers },
    { id: "broadcast", label: "Emergency Broadcast", icon: Radio },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white">Municipal Officer Workspace</h1>
        <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          পৌর কর্মকর্তা ও বিভাগীয় প্রশাসন নিয়ন্ত্রণ ড্যাশবোর্ড
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex-wrap">
        {TABS.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === id
                ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Icon size={14} />
            <span>{label}</span>
            {badge !== undefined && badge > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ════ TAB 1: OVERVIEW ════ */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard
              label="Pending Complaints"
              value={pendingComplaintsCount}
              icon={<Clock size={20} />}
              color="#dc2626"
              onClick={() => setTab("complaints")}
            />
            <KpiCard
              label="Active Civic Polls"
              value={activePollsCount}
              icon={<BarChart2 size={20} />}
              color="#1d4ed8"
              onClick={() => setTab("add-poll")}
            />
            <KpiCard
              label="Moderation Queue"
              value={pendingDiscussions.length + pendingSuggestions.length}
              icon={<ListChecks size={20} />}
              color="#d97706"
              onClick={() => setTab("queue")}
            />
            <KpiCard
              label="Public E-Services"
              value={services.length}
              icon={<Layers size={20} />}
              color="#059669"
              onClick={() => setTab("add-service")}
            />
          </div>

          {/* Quick Action Shortcuts */}
          <div className="grid md:grid-cols-3 gap-4">
            <div
              onClick={() => setTab("complaints")}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 cursor-pointer shadow-xs transition-all space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <FileText size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Review & Resolve Complaints</h3>
              <p className="text-xs text-slate-500">
                Update status to In Progress or Resolved, assign inspectors, and append field notes.
              </p>
            </div>

            <div
              onClick={() => setTab("add-poll")}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-blue-500 cursor-pointer shadow-xs transition-all space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <BarChart2 size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Publish New Public Poll</h3>
              <p className="text-xs text-slate-500">
                Consult citizens on traffic reorganizations, park policies, or local budgeting.
              </p>
            </div>

            <div
              onClick={() => setTab("broadcast")}
              className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-red-500 cursor-pointer shadow-xs transition-all space-y-2"
            >
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-600 flex items-center justify-center">
                <Radio size={20} />
              </div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">Broadcast Emergency Alert</h3>
              <p className="text-xs text-slate-500">
                Deploy instant weather, road closure, or water maintenance banner across citizen apps.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ════ TAB 2: COMPLAINTS MANAGEMENT ════ */}
      {tab === "complaints" && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Filter Status:</span>
              <select
                value={complaintFilter}
                onChange={(e) => setComplaintFilter(e.target.value)}
                className="px-3 py-1.5 text-xs font-bold border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200"
              >
                <option value="all">All ({complaints.length})</option>
                <option value="submitted">Submitted</option>
                <option value="review">Under Review</option>
                <option value="progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <span className="text-xs text-slate-500">Click any complaint to assign status or add officer remarks</span>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredComplaints.map((c) => (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedComplaintId(c.id);
                    setNewStatus(c.status);
                  }}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        {c.id}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600">
                        {c.category}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-slate-900 dark:text-white">{c.title}</div>
                    <div className="text-xs text-slate-500 truncate">
                      {c.location}, {c.district} • Filed on {c.date}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <StatusBadge status={c.status} />
                    <button className="text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs">
                      Update Case ↗
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ════ TAB 3: CIVIC ANALYTICS ════ */}
      {tab === "analytics" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Category Breakdown Bar Chart */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <BarChart2 size={16} className="text-emerald-600" />
                Complaints Volume by Municipal Department
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" opacity={0.5} />
                    <XAxis dataKey="name" angle={-25} textAnchor="end" tick={{ fontSize: 10 }} interval={0} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="value" fill="#059669" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Division Resolution Performance Table */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingUp size={16} className="text-blue-600" />
                Bangladesh Division Performance Index
              </h3>
              <div className="space-y-3 overflow-y-auto max-h-64 pr-1">
                {BANGLADESH_DIVISIONS.map((div) => (
                  <div
                    key={div.id}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white">{div.nameEn} Division</span>
                      <span className="text-[10px] text-slate-400 block">{div.districtsCount} Districts</span>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-emerald-600">{div.resolutionRate}% Resolved</div>
                      <div className="text-[10px] text-slate-500">Score: {div.civicHealthScore}/100</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ════ TAB 4: MODERATION QUEUE ════ */}
      {tab === "queue" && (
        <div className="space-y-6">
          {/* Pending Discussions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Pending Discussions for Moderation ({pendingDiscussions.length})
            </h3>
            {pendingDiscussions.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">No pending discussions awaiting approval.</div>
            ) : (
              <div className="space-y-3">
                {pendingDiscussions.map((d) => (
                  <div
                    key={d.id}
                    className="p-4 rounded-2xl border border-amber-200 bg-amber-50/40 dark:bg-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{d.title}</div>
                      <div className="text-slate-600 dark:text-slate-300 mt-1">{d.body}</div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        By {d.author} • Category: {d.category}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => approveDiscussion(d.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Approve ✓
                      </button>
                      <button
                        onClick={() => rejectDiscussion(d.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-red-100 text-red-700 font-bold hover:bg-red-200 transition-colors"
                      >
                        Reject ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Suggestions */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              Submitted Citizen Suggestions ({pendingSuggestions.length})
            </h3>
            {pendingSuggestions.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">No pending suggestions awaiting review.</div>
            ) : (
              <div className="space-y-3">
                {pendingSuggestions.map((s) => (
                  <div
                    key={s.id}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{s.title}</div>
                      <div className="text-slate-600 dark:text-slate-300 mt-1">{s.body}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Proposed by {s.author}</div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => updateSuggestionStatus(s.id, "review")}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
                      >
                        Move to Review
                      </button>
                      <button
                        onClick={() => updateSuggestionStatus(s.id, "accepted")}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors"
                      >
                        Accept Proposal ✓
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ════ TAB 5: ADD POLL ════ */}
      {tab === "add-poll" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-xs space-y-5">
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Publish New Civic Consultation Poll</h2>
            <p className="text-xs text-slate-500">Collect verified citizen sentiment on municipal decisions.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold block mb-1">Poll Question *</label>
              <input
                value={pollForm.question}
                onChange={(e) => setPollForm((f) => ({ ...f, question: e.target.value }))}
                placeholder="e.g. Should Gulshan Avenue introduce dedicated school-hour bus lanes?"
                className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Target District</label>
                <select
                  value={pollForm.area}
                  onChange={(e) => setPollForm((f) => ({ ...f, area: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                >
                  <option value="All City Corporation Areas">All Bangladesh</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold block mb-1">Voting Duration</label>
                <select
                  value={pollForm.closeDate}
                  onChange={(e) => setPollForm((f) => ({ ...f, closeDate: e.target.value }))}
                  className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800"
                >
                  <option value="7 days">7 Days</option>
                  <option value="14 days">14 Days</option>
                  <option value="30 days">30 Days</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1.5">Poll Options (Min 2)</label>
              <div className="space-y-2">
                {pollForm.options.map((opt, i) => (
                  <input
                    key={i}
                    value={opt}
                    onChange={(e) => {
                      const next = [...pollForm.options];
                      next[i] = e.target.value;
                      setPollForm((f) => ({ ...f, options: next }));
                    }}
                    placeholder={`Option ${i + 1} (e.g. ${i === 0 ? "Strongly Agree" : i === 1 ? "Disagree" : "Neutral"})`}
                    className="w-full px-4 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 bg-slate-50 dark:bg-slate-800"
                  />
                ))}
              </div>
            </div>

            <button
              onClick={handleAddPoll}
              className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-md"
            >
              Publish Poll to Citizens 🚀
            </button>
          </div>
        </div>
      )}

      {/* ════ TAB 6: ADD SERVICE ════ */}
      {tab === "add-service" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-xs space-y-5">
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white">Add Government Service to Directory</h2>
            <p className="text-xs text-slate-500">Provide official portal links and procedures for citizens.</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold block mb-1">Service Name (English) *</label>
                <input
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Water Connection Application"
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 bg-slate-50 dark:bg-slate-800"
                />
              </div>
              <div>
                <label className="font-bold block mb-1">Service Name (বাংলা)</label>
                <input
                  value={serviceForm.nameBn}
                  onChange={(e) => setServiceForm((f) => ({ ...f, nameBn: e.target.value }))}
                  placeholder="e.g. নতুন পানির সংযোগ আবেদন"
                  className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Category *</label>
              <select
                value={serviceForm.category}
                onChange={(e) => setServiceForm((f) => ({ ...f, category: e.target.value as any }))}
                className="w-full px-3 py-2 text-xs border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 cursor-pointer"
              >
                {SERVICE_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="font-bold block mb-1">Official Portal URL *</label>
              <input
                value={serviceForm.url}
                onChange={(e) => setServiceForm((f) => ({ ...f, url: e.target.value }))}
                placeholder="https://dwasa.org.bd/services"
                className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Description & Process Summary *</label>
              <textarea
                rows={3}
                value={serviceForm.description}
                onChange={(e) => setServiceForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="Explain the eligibility, submission requirements and expected turnaround days..."
                className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 bg-slate-50 dark:bg-slate-800 resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleAddService}
              className="w-full py-3 rounded-2xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-colors shadow-md"
            >
              Add to E-Services 🚀
            </button>
          </div>
        </div>
      )}

      {/* ════ TAB 7: EMERGENCY BROADCASTER ════ */}
      {tab === "broadcast" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 max-w-2xl mx-auto shadow-xs space-y-5">
          <div>
            <h2 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <Radio size={20} className="text-red-500 animate-pulse" />
              Broadcast Emergency & Maintenance Bulletin
            </h2>
            <p className="text-xs text-slate-500">
              Immediately publish an alert banner visible on all citizen dashboard screens.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="font-bold block mb-1">Alert Category *</label>
              <div className="grid grid-cols-4 gap-2">
                {(["emergency", "maintenance", "celebration", "weather"] as AnnouncementType[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setBroadcastForm((f) => ({ ...f, type: t }))}
                    className={`py-2 px-3 rounded-xl font-bold uppercase tracking-wider text-[10px] border transition-all ${
                      broadcastForm.type === t
                        ? "bg-red-600 text-white border-red-600 shadow-sm"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="font-bold block mb-1">Headline Title *</label>
              <input
                value={broadcastForm.title}
                onChange={(e) => setBroadcastForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="e.g. Heavy Rain & High Waterlogging Advisory for Dhaka North"
                className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-red-500 bg-slate-50 dark:bg-slate-800"
              />
            </div>

            <div>
              <label className="font-bold block mb-1">Bulletin Message *</label>
              <textarea
                rows={3}
                value={broadcastForm.body}
                onChange={(e) => setBroadcastForm((f) => ({ ...f, body: e.target.value }))}
                placeholder="Provide urgent instructions, emergency hotline contacts, and safety advice..."
                className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-red-500 bg-slate-50 dark:bg-slate-800 resize-none leading-relaxed"
              />
            </div>

            <button
              onClick={handleBroadcastAlert}
              className="w-full py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <Radio size={16} /> Broadcast Alert Immediately
            </button>
          </div>
        </div>
      )}

      {/* Complaint Update Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-emerald-600">{selectedComplaint.id}</span>
                <h3 className="font-bold text-base text-slate-900 dark:text-white truncate">
                  {selectedComplaint.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedComplaintId(null)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
              >
                <XCircle size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div>
                <label className="font-bold block mb-1">Update Lifecycle Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as ComplaintStatus)}
                  className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  <option value="review">Under Review (প্রাথমিক পর্যালোচনা)</option>
                  <option value="progress">In Progress (প্রক্রিয়াধীন / কর্মীবাহিনী নিযুক্ত)</option>
                  <option value="resolved">Resolved (সমস্যার সমাধান সম্পন্ন)</option>
                  <option value="rejected">Rejected (বাতিল / অনধিকারভুক্ত)</option>
                </select>
              </div>

              <div>
                <label className="font-bold block mb-1">Official Officer Field Note</label>
                <textarea
                  rows={3}
                  value={officerNoteInput}
                  onChange={(e) => setOfficerNoteInput(e.target.value)}
                  placeholder="e.g. Site inspection conducted. Maintenance crew dispatched with asphalt repair equipment."
                  className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl outline-none focus:border-emerald-500 bg-slate-50 dark:bg-slate-800 resize-none leading-relaxed"
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  onClick={() => setSelectedComplaintId(null)}
                  className="px-4 py-2 font-semibold border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateComplaint}
                  className="px-5 py-2 font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-sm"
                >
                  Save & Notify Citizen ✓
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
