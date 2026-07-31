import { useState } from "react";
import { CheckCircle, XCircle, Plus, BarChart2, Layers, Clock, Users, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { useData } from "../components/DataContext";
import { type Poll, type Service } from "../data/mockData";

type Tab = "overview" | "queue" | "add-poll" | "add-service" | "my-polls";

const DISTRICTS = ["Dhaka", "Chittagong", "Rajshahi", "Khulna", "Sylhet", "Barisal", "Mymensingh", "Rangpur"];
const SERVICE_CATEGORIES = ["Identity & Civil Status", "Business & Licensing", "Financial & Property", "Public Services"] as const;

function KpiCard({ label, value, icon, color, onClick }: { label: string; value: string | number; icon: React.ReactNode; color: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      className={`bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-start gap-4 text-left w-full transition-all duration-200 ${onClick ? "hover:border-current hover:shadow-md hover:-translate-y-0.5 cursor-pointer" : ""}`}
      style={{ borderColor: undefined }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-extrabold tabular-nums" style={{ color }}>{value}</div>
        <div className="text-sm font-medium text-[#0f172a]">{label}</div>
        {onClick && <div className="text-[10px] text-[#94a3b8] mt-0.5">View list →</div>}
      </div>
    </button>
  );
}

export function OfficerDashboardPage() {
  const { discussions, setDiscussions, suggestions, setSuggestions, polls, setPolls, services, setServices } = useData();
  const [tab, setTab] = useState<Tab>("overview");

  // Poll form state
  const [pollForm, setPollForm] = useState({
    question: "", area: "Dhaka",
    options: ["", "", "", ""],
    closeDate: "",
  });

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    name: "", nameBn: "", category: "Public Services" as typeof SERVICE_CATEGORIES[number],
    description: "", url: "",
  });

  const pendingDiscussions = discussions.filter((d) => d.status === "pending");
  const pendingSuggestions = suggestions.filter((s) => s.status === "submitted");
  const myPolls = polls.filter((p) => (p as Poll & { addedByOfficer?: boolean }).addedByOfficer);

  const approveDiscussion = (id: string) => {
    setDiscussions(discussions.map((d) => d.id === id ? { ...d, status: "approved" } : d));
    toast.success("Discussion approved and published.");
  };

  const rejectDiscussion = (id: string) => {
    setDiscussions(discussions.filter((d) => d.id !== id));
    toast.success("Discussion rejected and removed.");
  };

  const approveSuggestion = (id: string) => {
    setSuggestions(suggestions.map((s) => s.id === id ? { ...s, status: "review" } : s));
    toast.success("Suggestion moved to Under Review.");
  };

  const rejectSuggestion = (id: string) => {
    setSuggestions(suggestions.map((s) => s.id === id ? { ...s, status: "declined" } : s));
    toast.error("Suggestion declined.");
  };

  const handleAddPoll = () => {
    const filledOptions = pollForm.options.filter((o) => o.trim());
    if (!pollForm.question.trim() || filledOptions.length < 2) {
      toast.error("Please enter a question and at least 2 options.");
      return;
    }
    const newPoll: Poll & { addedByOfficer?: boolean } = {
      id: `p-${Date.now()}`,
      title: pollForm.question,
      area: pollForm.area,
      closed: false,
      votedOption: null,
      closesIn: pollForm.closeDate || "Open",
      totalVotes: 0,
      options: filledOptions.map((label) => ({ label, votes: 0 })),
      addedByOfficer: true,
    };
    setPolls([...polls, newPoll]);
    setPollForm({ question: "", area: "Dhaka", options: ["", "", "", ""], closeDate: "" });
    toast.success("Poll published! Citizens can now vote.");
  };

  const handleAddService = () => {
    if (!serviceForm.name.trim() || !serviceForm.description.trim() || !serviceForm.url.trim()) {
      toast.error("Please fill in the name, description, and official portal URL.");
      return;
    }
    const normalizedUrl = /^https?:\/\//i.test(serviceForm.url.trim())
      ? serviceForm.url.trim()
      : `https://${serviceForm.url.trim()}`;
    const newService: Service = {
      id: `s-${Date.now()}`,
      name: serviceForm.name,
      nameBn: serviceForm.nameBn || serviceForm.name,
      category: serviceForm.category,
      description: serviceForm.description,
      icon: "Globe",
      officerAdded: true,
      url: normalizedUrl,
    };
    setServices([...services, newService]);
    setServiceForm({ name: "", nameBn: "", category: "Public Services", description: "", url: "" });
    toast.success("Service added to the E-Services directory.");
  };

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: BarChart2 },
    { id: "queue", label: `Approval Queue (${pendingDiscussions.length + pendingSuggestions.length})`, icon: ListChecks },
    { id: "add-poll", label: "Add Poll", icon: Plus },
    { id: "add-service", label: "Add Service", icon: Layers },
    { id: "my-polls", label: "My Polls", icon: BarChart2 },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#0f172a]">Officer Workspace</h1>
        <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          কর্মকর্তার কার্যক্ষেত্র
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[#f1f5f9] p-1 rounded-xl flex-wrap">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all duration-200"
            style={{
              background: tab === id ? "#fff" : "transparent",
              color: tab === id ? "#0f172a" : "#64748b",
              boxShadow: tab === id ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            <Icon size={13} />
            {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <KpiCard label="Pending Approvals" value={pendingDiscussions.length + pendingSuggestions.length} icon={<Clock size={18} />} color="#d97706" onClick={() => setTab("queue")} />
            <KpiCard label="Active Polls" value={polls.filter((p) => !p.closed).length} icon={<BarChart2 size={18} />} color="#1d4ed8" onClick={() => setTab("my-polls")} />
            <KpiCard label="Services Added" value={services.filter((s) => s.officerAdded).length} icon={<Layers size={18} />} color="#059669" onClick={() => setTab("add-service")} />
            <KpiCard label="Citizens Helped" value="2,341" icon={<Users size={18} />} color="#7c3aed" />
          </div>
          <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e2e8f0]">
              <div className="font-semibold text-sm">All Officer Functions</div>
              <div className="text-xs text-[#64748b]">Every tool in your workspace, listed for quick access</div>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {[
                { id: "queue" as Tab, icon: ListChecks, label: "Approval Queue", desc: "Review and approve/reject pending discussions and suggestions", count: pendingDiscussions.length + pendingSuggestions.length },
                { id: "add-poll" as Tab, icon: Plus, label: "Add Poll", desc: "Publish a new civic poll — instantly visible to all citizens", count: null },
                { id: "add-service" as Tab, icon: Layers, label: "Add Service", desc: "Add a government service to the citizen E-Services directory", count: null },
                { id: "my-polls" as Tab, icon: BarChart2, label: "My Polls", desc: "Track live results for polls you've created", count: polls.filter((p) => !p.closed).length },
              ].map(({ id, icon: Icon, label, desc, count }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-[#f8fafc] transition-colors"
                >
                  <div className="w-9 h-9 rounded-xl bg-[#ecfdf5] text-[#059669] flex items-center justify-center flex-shrink-0">
                    <Icon size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-[#0f172a]">{label}</div>
                    <div className="text-xs text-[#64748b]">{desc}</div>
                  </div>
                  {count !== null && count > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#d97706] text-white flex-shrink-0">{count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
            <div className="font-semibold text-sm mb-3">Quick Tips</div>
            <ul className="space-y-2 text-sm text-[#64748b]">
              <li className="flex items-start gap-2"><span className="text-[#059669] mt-0.5">•</span> Review pending discussions and suggestions in the Approval Queue tab.</li>
              <li className="flex items-start gap-2"><span className="text-[#059669] mt-0.5">•</span> Add a new civic poll — it will be immediately visible to all citizens.</li>
              <li className="flex items-start gap-2"><span className="text-[#059669] mt-0.5">•</span> New services you add appear in the citizen-facing E-Services directory with an "Officer-curated" badge.</li>
            </ul>
          </div>
        </div>
      )}

      {/* Approval Queue */}
      {tab === "queue" && (
        <div className="space-y-6">
          {/* Pending Discussions */}
          <div>
            <div className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">
              Pending Discussions ({pendingDiscussions.length})
            </div>
            {pendingDiscussions.length === 0 ? (
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center text-[#94a3b8]">
                <CheckCircle size={24} className="mx-auto mb-2 text-[#059669]" />
                <div className="font-semibold">No pending discussions</div>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingDiscussions.map((d) => (
                  <div key={d.id} className="bg-white border border-[#fca5a5] rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm mb-1">{d.title}</div>
                        <div className="text-xs text-[#64748b] leading-relaxed line-clamp-2 mb-2">{d.body}</div>
                        <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                          <span>{d.author}</span>
                          <span className="px-2 py-0.5 bg-[#f1f5f9] rounded-full">{d.category}</span>
                          <span>{d.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => approveDiscussion(d.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#059669] text-white rounded-xl hover:bg-[#047857] transition-colors"
                        >
                          <CheckCircle size={12} /> Approve
                        </button>
                        <button
                          onClick={() => rejectDiscussion(d.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-[#e2e8f0] text-[#dc2626] rounded-xl hover:bg-[#fef2f2] transition-colors"
                        >
                          <XCircle size={12} /> Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Suggestions */}
          <div>
            <div className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">
              Submitted Suggestions ({pendingSuggestions.length})
            </div>
            {pendingSuggestions.length === 0 ? (
              <div className="bg-white border border-[#e2e8f0] rounded-2xl p-8 text-center text-[#94a3b8]">
                <CheckCircle size={24} className="mx-auto mb-2 text-[#059669]" />
                <div className="font-semibold">No pending suggestions</div>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingSuggestions.map((s) => (
                  <div key={s.id} className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-sm mb-1">{s.title}</div>
                        <div className="text-xs text-[#64748b] leading-relaxed line-clamp-2 mb-2">{s.body}</div>
                        <div className="flex items-center gap-3 text-xs text-[#94a3b8]">
                          <span>{s.author}</span>
                          <span>{s.createdAt}</span>
                          <span>{s.upvotes - s.downvotes} net votes</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <button
                          onClick={() => approveSuggestion(s.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#1d4ed8] text-white rounded-xl hover:bg-[#1e40af] transition-colors"
                        >
                          <CheckCircle size={12} /> Accept
                        </button>
                        <button
                          onClick={() => rejectSuggestion(s.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold border border-[#e2e8f0] text-[#dc2626] rounded-xl hover:bg-[#fef2f2] transition-colors"
                        >
                          <XCircle size={12} /> Decline
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Poll */}
      {tab === "add-poll" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 max-w-xl space-y-5">
          <div className="font-semibold text-sm">Create a New Poll</div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Poll Question *</label>
            <input
              type="text"
              placeholder="What do you want citizens to weigh in on?"
              value={pollForm.question}
              onChange={(e) => setPollForm((f) => ({ ...f, question: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">District / Area</label>
            <select
              value={pollForm.area}
              onChange={(e) => setPollForm((f) => ({ ...f, area: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors bg-white"
            >
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Answer Options (min 2)</label>
            <div className="space-y-2">
              {pollForm.options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}${i < 2 ? " *" : ""}`}
                  value={opt}
                  onChange={(e) => {
                    const next = [...pollForm.options];
                    next[i] = e.target.value;
                    setPollForm((f) => ({ ...f, options: next }));
                  }}
                  className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors"
                />
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Close Date (optional)</label>
            <input
              type="date"
              value={pollForm.closeDate}
              onChange={(e) => setPollForm((f) => ({ ...f, closeDate: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors bg-white"
            />
          </div>
          <button
            onClick={handleAddPoll}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#059669] text-white text-sm font-semibold rounded-xl hover:bg-[#047857] transition-colors"
          >
            <Plus size={14} /> Publish Poll
          </button>
        </div>
      )}

      {/* Add Service */}
      {tab === "add-service" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 max-w-xl space-y-5">
          <div className="font-semibold text-sm">Add Government Service</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Service Name (EN) *</label>
              <input
                type="text"
                placeholder="e.g. Voter Registration"
                value={serviceForm.name}
                onChange={(e) => setServiceForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Service Name (বাংলা)</label>
              <input
                type="text"
                placeholder="e.g. ভোটার নিবন্ধন"
                value={serviceForm.nameBn}
                onChange={(e) => setServiceForm((f) => ({ ...f, nameBn: e.target.value }))}
                className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors"
                style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Category</label>
            <select
              value={serviceForm.category}
              onChange={(e) => setServiceForm((f) => ({ ...f, category: e.target.value as typeof SERVICE_CATEGORIES[number] }))}
              className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors bg-white"
            >
              {SERVICE_CATEGORIES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Description *</label>
            <textarea
              rows={3}
              placeholder="Describe what this service provides and how to access it…"
              value={serviceForm.description}
              onChange={(e) => setServiceForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors resize-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">Official Portal URL *</label>
            <input
              type="text"
              placeholder="e.g. https://services.example.gov.bd/"
              value={serviceForm.url}
              onChange={(e) => setServiceForm((f) => ({ ...f, url: e.target.value }))}
              className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors"
            />
            <p className="text-[11px] text-[#94a3b8] mt-1">This is where "Access Service" will take citizens.</p>
          </div>
          <button
            onClick={handleAddService}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1d4ed8] text-white text-sm font-semibold rounded-xl hover:bg-[#1e40af] transition-colors"
          >
            <Plus size={14} /> Add Service
          </button>
        </div>
      )}

      {/* My Polls */}
      {tab === "my-polls" && (
        <div>
          <div className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-3">Polls You Created</div>
          {myPolls.length === 0 ? (
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-12 text-center text-[#94a3b8]">
              <BarChart2 size={32} className="mx-auto mb-3 opacity-30" />
              <div className="font-semibold">No polls yet</div>
              <div className="text-sm">Add a poll and it will appear here.</div>
            </div>
          ) : (
            <div className="space-y-3">
              {myPolls.map((p) => {
                const total = p.options.reduce((s, o) => s + o.votes, 0);
                return (
                  <div key={p.id} className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="font-semibold text-sm">{p.title}</div>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: p.closed ? "#f1f5f9" : "#ecfdf5", color: p.closed ? "#64748b" : "#059669" }}>
                        {p.closed ? "Closed" : "Active"}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {p.options.map((opt) => (
                        <div key={opt.label} className="flex items-center gap-3 text-xs">
                          <div className="w-28 text-[#64748b] truncate">{opt.label}</div>
                          <div className="flex-1 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                            <div className="h-full bg-[#059669] rounded-full" style={{ width: total ? `${(opt.votes / total) * 100}%` : "0%" }} />
                          </div>
                          <div className="tabular-nums font-semibold w-6 text-right">{opt.votes}</div>
                        </div>
                      ))}
                    </div>
                    <div className="text-xs text-[#94a3b8] mt-3">{total} total votes · {p.area}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
