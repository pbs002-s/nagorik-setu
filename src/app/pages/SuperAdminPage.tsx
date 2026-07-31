import { useState } from "react";
import { Users, ListChecks, Shield, BarChart, MoreHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useData } from "../components/DataContext";
import { MANAGED_USERS, type ManagedUser, type UserStatus } from "../data/mockData";

type Tab = "overview" | "users" | "content" | "officers";

const STATUS_STYLE: Record<UserStatus, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "#ecfdf5", color: "#059669" },
  suspended: { label: "Suspended", bg: "#fef3c7", color: "#d97706" },
  banned: { label: "Banned", bg: "#fef2f2", color: "#dc2626" },
};

export function SuperAdminPage() {
  const { discussions, suggestions, setDiscussions, setSuggestions } = useData();
  const [tab, setTab] = useState<Tab>("overview");
  const [users, setUsers] = useState<ManagedUser[]>(MANAGED_USERS);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [contentFilter, setContentFilter] = useState<"all" | "pending" | "approved">("all");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | UserStatus>("all");

  const updateUserStatus = (id: string, status: UserStatus) => {
    setUsers((us) => us.map((u) => u.id === id ? { ...u, status } : u));
    const label = status === "banned" ? "banned" : status === "suspended" ? "suspended (30 days)" : "restored";
    toast.success(`User ${label}.`);
    setOpenMenu(null);
  };

  const allContent = [
    ...discussions.map((d) => ({ id: d.id, type: "Discussion" as const, title: d.title, author: d.author, status: d.status, date: d.createdAt })),
    ...suggestions.map((s) => ({ id: s.id, type: "Suggestion" as const, title: s.title, author: s.author, status: s.status === "submitted" ? "pending" : s.status, date: s.createdAt })),
  ];

  const filteredContent = allContent.filter((c) => {
    if (contentFilter === "pending") return c.status === "pending" || c.status === "submitted";
    if (contentFilter === "approved") return c.status === "approved" || c.status === "accepted" || c.status === "implemented";
    return true;
  });

  const approveContent = (id: string, type: "Discussion" | "Suggestion") => {
    if (type === "Discussion") {
      setDiscussions(discussions.map((d) => d.id === id ? { ...d, status: "approved" } : d));
    } else {
      setSuggestions(suggestions.map((s) => s.id === id ? { ...s, status: "accepted" } : s));
    }
    toast.success("Content approved.");
  };

  const deleteContent = (id: string, type: "Discussion" | "Suggestion") => {
    if (type === "Discussion") setDiscussions(discussions.filter((d) => d.id !== id));
    else setSuggestions(suggestions.filter((s) => s.id !== id));
    toast.success("Content deleted.");
  };

  const citizens = users.filter((u) => u.role === "citizen");
  const officers = users.filter((u) => u.role === "officer");

  const TABS: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: "overview", label: "Overview", icon: BarChart },
    { id: "users", label: "User Management", icon: Users },
    { id: "content", label: "All Content", icon: ListChecks },
    { id: "officers", label: "Officer Management", icon: Shield },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#0f172a]">Super Admin Panel</h1>
        <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          সুপার অ্যাডমিন নিয়ন্ত্রণ প্যানেল
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
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Total Citizens", value: citizens.length, color: "#059669", onClick: () => { setTab("users"); setUserStatusFilter("all"); } },
            { label: "Total Officers", value: officers.length, color: "#1d4ed8", onClick: () => setTab("officers") },
            { label: "Discussions", value: discussions.length, color: "#7c3aed", onClick: () => { setTab("content"); setContentFilter("all"); } },
            { label: "Suggestions", value: suggestions.length, color: "#d97706", onClick: () => { setTab("content"); setContentFilter("all"); } },
            { label: "Pending Content", value: allContent.filter((c) => c.status === "pending" || c.status === "submitted").length, color: "#dc2626", onClick: () => { setTab("content"); setContentFilter("pending"); } },
            { label: "Banned Users", value: users.filter((u) => u.status === "banned").length, color: "#dc2626", onClick: () => { setTab("users"); setUserStatusFilter("banned"); } },
            { label: "Suspended Users", value: users.filter((u) => u.status === "suspended").length, color: "#d97706", onClick: () => { setTab("users"); setUserStatusFilter("suspended"); } },
            { label: "Active Users", value: users.filter((u) => u.status === "active").length, color: "#059669", onClick: () => { setTab("users"); setUserStatusFilter("active"); } },
          ].map(({ label, value, color, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className="bg-white border border-[#e2e8f0] rounded-2xl p-5 text-left w-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[#059669]"
            >
              <div className="text-2xl font-extrabold tabular-nums" style={{ color }}>{value}</div>
              <div className="text-sm font-medium text-[#0f172a] mt-0.5">{label}</div>
              <div className="text-[10px] text-[#94a3b8] mt-0.5">View list →</div>
            </button>
          ))}
        </div>
      )}

      {/* User Management */}
      {tab === "users" && (
        <div className="space-y-4">
          <div className="flex gap-1 bg-[#f1f5f9] p-1 rounded-xl w-fit flex-wrap">
            {(["all", "active", "suspended", "banned"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setUserStatusFilter(k)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium capitalize transition-all duration-200"
                style={{
                  background: userStatusFilter === k ? "#fff" : "transparent",
                  color: userStatusFilter === k ? "#0f172a" : "#64748b",
                  boxShadow: userStatusFilter === k ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {k}
              </button>
            ))}
          </div>
          <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e2e8f0]">
            <div className="font-semibold text-sm">Citizen Accounts</div>
            <div className="text-xs text-[#64748b]">Manage access and account status</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                  {["Name", "Role", "District", "Joined", "Complaints", "Points", "Status", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f1f5f9]">
                {users.filter((u) => userStatusFilter === "all" || u.status === userStatusFilter).map((u) => {
                  const st = STATUS_STYLE[u.status];
                  return (
                    <tr key={u.id} className="hover:bg-[#f8fafc] transition-colors" style={{ background: u.status === "banned" ? "#fef2f2" : u.status === "suspended" ? "#fffbeb" : undefined }}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-[#0f172a] text-white text-xs font-bold flex items-center justify-center">
                            {u.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                          </div>
                          <span className="font-medium">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: u.role === "officer" ? "#eff6ff" : "#f1f5f9", color: u.role === "officer" ? "#1d4ed8" : "#64748b" }}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#64748b]">{u.district}</td>
                      <td className="px-5 py-3.5 text-[#64748b]">{u.joined}</td>
                      <td className="px-5 py-3.5 tabular-nums font-semibold">{u.complaints}</td>
                      <td className="px-5 py-3.5 tabular-nums text-[#7c3aed] font-semibold">{u.points.toLocaleString()}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: st.bg, color: st.color }}>{st.label}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                            className="p-1.5 rounded-lg hover:bg-[#f1f5f9] transition-colors"
                          >
                            <MoreHorizontal size={15} className="text-[#64748b]" />
                          </button>
                          {openMenu === u.id && (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-[#e2e8f0] rounded-xl shadow-lg z-10 min-w-[140px] overflow-hidden">
                              {u.status !== "active" && (
                                <button onClick={() => updateUserStatus(u.id, "active")} className="w-full px-4 py-2.5 text-xs text-left hover:bg-[#ecfdf5] text-[#059669] font-medium">Restore Access</button>
                              )}
                              {u.status !== "suspended" && (
                                <button onClick={() => updateUserStatus(u.id, "suspended")} className="w-full px-4 py-2.5 text-xs text-left hover:bg-[#fef3c7] text-[#d97706] font-medium">Suspend (30d)</button>
                              )}
                              {u.status !== "banned" && (
                                <button onClick={() => updateUserStatus(u.id, "banned")} className="w-full px-4 py-2.5 text-xs text-left hover:bg-[#fef2f2] text-[#dc2626] font-medium">Ban Account</button>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          </div>
        </div>
      )}

      {/* All Content */}
      {tab === "content" && (
        <div className="space-y-4">
          <div className="flex gap-1 bg-[#f1f5f9] p-1 rounded-xl w-fit">
            {([["all", "All"], ["pending", "Pending"], ["approved", "Approved"]] as const).map(([k, label]) => (
              <button
                key={k}
                onClick={() => setContentFilter(k)}
                className="px-4 py-1.5 rounded-lg text-xs font-medium transition-all duration-200"
                style={{
                  background: contentFilter === k ? "#fff" : "transparent",
                  color: contentFilter === k ? "#0f172a" : "#64748b",
                  boxShadow: contentFilter === k ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                    {["Type", "Title", "Author", "Status", "Date", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {filteredContent.map((c) => (
                    <tr key={c.id} className="hover:bg-[#f8fafc] transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: c.type === "Discussion" ? "#eff6ff" : "#f5f3ff", color: c.type === "Discussion" ? "#1d4ed8" : "#7c3aed" }}>
                          {c.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 max-w-xs">
                        <div className="font-medium truncate">{c.title}</div>
                      </td>
                      <td className="px-5 py-3.5 text-[#64748b]">{c.author}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize"
                          style={{
                            background: c.status === "approved" || c.status === "accepted" || c.status === "implemented" ? "#ecfdf5" : c.status === "pending" || c.status === "submitted" ? "#fef3c7" : "#f1f5f9",
                            color: c.status === "approved" || c.status === "accepted" || c.status === "implemented" ? "#059669" : c.status === "pending" || c.status === "submitted" ? "#d97706" : "#64748b",
                          }}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[#64748b] whitespace-nowrap">{c.date}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          {(c.status === "pending" || c.status === "submitted") && (
                            <button onClick={() => approveContent(c.id, c.type)} className="text-xs font-semibold text-[#059669] hover:underline">Approve</button>
                          )}
                          <button onClick={() => deleteContent(c.id, c.type)} className="text-xs font-semibold text-[#dc2626] hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Officer Management */}
      {tab === "officers" && (
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-[#e2e8f0]">
            <div className="font-semibold text-sm">Government Officers</div>
            <div className="text-xs text-[#64748b]">Manage officer accounts and permissions</div>
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {officers.map((o) => (
              <div key={o.id} className="px-5 py-4 flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-[#1d4ed8] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                  {o.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm">{o.name}</div>
                  <div className="text-xs text-[#64748b]">{o.district} · Joined {o.joined}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 bg-[#eff6ff] text-[#1d4ed8] rounded-full">{o.status}</span>
                  <button
                    onClick={() => { updateUserStatus(o.id, o.status === "active" ? "suspended" : "active"); }}
                    className="text-xs font-semibold px-3 py-1.5 border border-[#e2e8f0] rounded-xl hover:bg-[#f8fafc] transition-colors"
                  >
                    {o.status === "active" ? "Suspend" : "Restore"}
                  </button>
                  <button
                    onClick={() => { toast.success("Officer role removed."); setUsers((us) => us.map((u) => u.id === o.id ? { ...u, role: "citizen" } : u)); }}
                    className="text-xs font-semibold px-3 py-1.5 border border-[#fca5a5] text-[#dc2626] rounded-xl hover:bg-[#fef2f2] transition-colors"
                  >
                    Remove Officer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
