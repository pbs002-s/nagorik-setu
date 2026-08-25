import { useState } from "react";
import {
  Users,
  ListChecks,
  Shield,
  BarChart,
  MoreHorizontal,
  Activity,
  UserCheck,
  Ban,
  UserX,
  Radio,
  FileCheck,
  CheckCircle,
  AlertTriangle,
  Building2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { useData } from "../components/DataContext";
import { type ManagedUser, type UserStatus, ADMIN_OFFICERS } from "../data/mockData";

type Tab = "overview" | "users" | "content" | "officers" | "audit";

const STATUS_STYLE: Record<UserStatus, { label: string; bg: string; color: string }> = {
  active: { label: "Active", bg: "#ecfdf5", color: "#059669" },
  suspended: { label: "Suspended", bg: "#fef3c7", color: "#d97706" },
  banned: { label: "Banned", bg: "#fef2f2", color: "#dc2626" },
};

export function SuperAdminPage() {
  const {
    discussions,
    suggestions,
    approveDiscussion,
    rejectDiscussion,
    updateSuggestionStatus,
    users,
    updateUserStatus,
    auditLogs,
  } = useData();

  const [tab, setTab] = useState<Tab>("overview");
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [contentFilter, setContentFilter] = useState<"all" | "pending" | "approved">("all");
  const [userStatusFilter, setUserStatusFilter] = useState<"all" | UserStatus>("all");

  const handleStatusChange = (id: string, status: UserStatus) => {
    updateUserStatus(id, status);
    const label = status === "banned" ? "banned" : status === "suspended" ? "suspended (30 days)" : "restored";
    toast.success(`User status updated to ${label}.`);
    setOpenMenu(null);
  };

  const allContent = [
    ...discussions.map((d) => ({
      id: d.id,
      type: "Discussion" as const,
      title: d.title,
      author: d.author,
      status: d.status,
      date: d.createdAt,
    })),
    ...suggestions.map((s) => ({
      id: s.id,
      type: "Suggestion" as const,
      title: s.title,
      author: s.author,
      status: s.status === "submitted" ? "pending" : s.status,
      date: s.createdAt,
    })),
  ];

  const filteredContent = allContent.filter((c) => {
    if (contentFilter === "pending") return c.status === "pending" || c.status === "submitted";
    if (contentFilter === "approved")
      return c.status === "approved" || c.status === "accepted" || c.status === "implemented";
    return true;
  });

  const citizens = users.filter((u) => u.role === "citizen");
  const officers = users.filter((u) => u.role === "officer");
  const filteredUsers = users.filter((u) => {
    if (userStatusFilter === "all") return true;
    return u.status === userStatusFilter;
  });

  const TABS: { id: Tab; label: string; icon: React.ElementType; count?: number }[] = [
    { id: "overview", label: "Overview", icon: BarChart },
    { id: "users", label: "User Management", icon: Users, count: users.length },
    { id: "content", label: "Content Moderation", icon: ListChecks },
    { id: "officers", label: "Officer Performance", icon: Shield },
    { id: "audit", label: "Live System Audit", icon: Activity, count: auditLogs.length },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white">Super Admin Control Hub</h1>
        <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          সুপার অ্যাডমিন নিয়ন্ত্রণ প্যানেল ও সিস্টেম নজরদারি
        </p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl flex-wrap">
        {TABS.map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === id
                ? "bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900"
            }`}
          >
            <Icon size={14} />
            <span>{label}</span>
            {count !== undefined && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                {count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ════ TAB 1: OVERVIEW ════ */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Total Citizens",
                value: citizens.length,
                color: "#059669",
                onClick: () => {
                  setTab("users");
                  setUserStatusFilter("all");
                },
              },
              {
                label: "Total Officers",
                value: officers.length,
                color: "#1d4ed8",
                onClick: () => setTab("officers"),
              },
              {
                label: "Platform Discussions",
                value: discussions.length,
                color: "#7c3aed",
                onClick: () => {
                  setTab("content");
                  setContentFilter("all");
                },
              },
              {
                label: "Pending Moderation",
                value: allContent.filter((c) => c.status === "pending" || c.status === "submitted").length,
                color: "#dc2626",
                onClick: () => {
                  setTab("content");
                  setContentFilter("pending");
                },
              },
              {
                label: "Banned Accounts",
                value: users.filter((u) => u.status === "banned").length,
                color: "#dc2626",
                onClick: () => {
                  setTab("users");
                  setUserStatusFilter("banned");
                },
              },
              {
                label: "Suspended Accounts",
                value: users.filter((u) => u.status === "suspended").length,
                color: "#d97706",
                onClick: () => {
                  setTab("users");
                  setUserStatusFilter("suspended");
                },
              },
              {
                label: "Active Users",
                value: users.filter((u) => u.status === "active").length,
                color: "#059669",
                onClick: () => {
                  setTab("users");
                  setUserStatusFilter("active");
                },
              },
              {
                label: "Audit Log Events",
                value: auditLogs.length,
                color: "#0891b2",
                onClick: () => setTab("audit"),
              },
            ].map(({ label, value, color, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-5 text-left w-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-purple-500/50"
              >
                <div className="text-2xl font-black tabular-nums tracking-tight" style={{ color }}>
                  {value}
                </div>
                <div className="text-xs font-bold text-[#0f172a] dark:text-white mt-1">{label}</div>
                <div className="text-[10px] text-purple-600 dark:text-purple-400 font-semibold mt-1">Manage →</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ════ TAB 2: USER MANAGEMENT ════ */}
      {tab === "users" && (
        <div className="space-y-4">
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit flex-wrap">
            {(["all", "active", "suspended", "banned"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setUserStatusFilter(k)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  userStatusFilter === k
                    ? "bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {k} ({users.filter((u) => k === "all" || u.status === k).length})
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {["User / ID", "Role", "District", "Civic Points", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredUsers.map((u) => {
                    const style = STATUS_STYLE[u.status] ?? STATUS_STYLE.active;
                    return (
                      <tr key={u.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 text-xs">
                        <td className="px-5 py-3.5">
                          <div className="font-bold text-slate-900 dark:text-white">{u.name}</div>
                          <div className="font-mono text-[10px] text-slate-400">ID: {u.id}</div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-full text-[10px] ${
                              u.role === "officer"
                                ? "bg-blue-100 text-blue-700"
                                : u.role === "superadmin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{u.district}</td>
                        <td className="px-5 py-3.5 font-bold text-emerald-600 tabular-nums">
                          {u.points.toLocaleString()} PTS
                        </td>
                        <td className="px-5 py-3.5">
                          <span
                            className="font-bold px-2.5 py-0.5 rounded-full text-[10px]"
                            style={{ background: style.bg, color: style.color }}
                          >
                            {style.label}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-1.5">
                            {u.status !== "active" && (
                              <button
                                onClick={() => handleStatusChange(u.id, "active")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold hover:bg-emerald-100 text-[11px]"
                              >
                                Restore
                              </button>
                            )}
                            {u.status !== "suspended" && (
                              <button
                                onClick={() => handleStatusChange(u.id, "suspended")}
                                className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 font-bold hover:bg-amber-100 text-[11px]"
                              >
                                Suspend
                              </button>
                            )}
                            {u.status !== "banned" && (
                              <button
                                onClick={() => handleStatusChange(u.id, "banned")}
                                className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 font-bold hover:bg-red-100 text-[11px]"
                              >
                                Ban
                              </button>
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

      {/* ════ TAB 3: CONTENT MODERATION ════ */}
      {tab === "content" && (
        <div className="space-y-4">
          <div className="flex gap-2 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
            {(["all", "pending", "approved"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setContentFilter(k)}
                className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                  contentFilter === k
                    ? "bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-300 shadow-sm"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                {k} Content
              </button>
            ))}
          </div>

          <div className="space-y-3">
            {filteredContent.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 text-[10px]">
                      {item.type}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">{item.id}</span>
                  </div>
                  <div className="font-bold text-sm text-slate-900 dark:text-white mt-1">{item.title}</div>
                  <div className="text-slate-400 mt-0.5">
                    Author: {item.author} • Submitted on {item.date}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      item.status === "approved" || item.status === "accepted"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    {item.status}
                  </span>
                  {item.status === "pending" && (
                    <button
                      onClick={() => {
                        if (item.type === "Discussion") approveDiscussion(item.id);
                        else updateSuggestionStatus(item.id, "accepted");
                      }}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700"
                    >
                      Approve ✓
                    </button>
                  )}
                  <button
                    onClick={() => {
                      if (item.type === "Discussion") rejectDiscussion(item.id);
                      else updateSuggestionStatus(item.id, "declined");
                    }}
                    className="p-1.5 rounded-xl text-red-600 hover:bg-red-50"
                    title="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════ TAB 4: OFFICER PERFORMANCE ════ */}
      {tab === "officers" && (
        <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-base text-slate-900 dark:text-white">
              Municipal Officer Efficiency & Resolution Ratings
            </h3>
            <p className="text-xs text-slate-500">
              Field inspection velocity and citizen satisfaction score per officer.
            </p>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {ADMIN_OFFICERS.map((off) => (
              <div
                key={off.name}
                className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-sm text-slate-900 dark:text-white">{off.name}</div>
                  <div className="text-slate-500">{off.department}</div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Resolved</span>
                    <strong className="text-emerald-600 font-black">
                      {off.resolved}/{off.assigned}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Avg Days</span>
                    <strong className="text-slate-900 dark:text-white">{off.avgDays}d</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Citizen Rating</span>
                    <strong className="text-purple-600 font-black">{off.rating}%</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════ TAB 5: LIVE SYSTEM AUDIT TRAIL ════ */}
      {tab === "audit" && (
        <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <Activity size={18} className="text-cyan-500" />
                Live System Audit Trail & Event Logs
              </h3>
              <p className="text-xs text-slate-500">Chronological security and administrative change log.</p>
            </div>
            <span className="text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-md">
              Live Auditing Active
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-purple-600">{log.action}</span>
                    <span className="text-slate-400">by {log.actor}</span>
                    {log.ip && <span className="text-[10px] text-slate-400">({log.ip})</span>}
                  </div>
                  <div className="text-slate-700 dark:text-slate-300 font-sans text-xs">{log.details}</div>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
