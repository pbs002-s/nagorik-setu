import { useState } from "react";
import { MessageSquare, BarChart2, Award, CheckCheck } from "lucide-react";
import { NOTIFICATIONS, type Notification } from "../data/mockData";

const TYPE_CONFIG = {
  complaint: {
    icon: <MessageSquare size={15} />,
    color: "#1d4ed8",
    bg: "#eff6ff",
    label: "Complaint Update",
  },
  poll: {
    icon: <BarChart2 size={15} />,
    color: "#d97706",
    bg: "#fef3c7",
    label: "Poll Reminder",
  },
  badge: {
    icon: <Award size={15} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    label: "Achievement",
  },
};

function NotifRow({
  notif,
  onRead,
}: {
  notif: Notification;
  onRead: (id: string) => void;
}) {
  const config = TYPE_CONFIG[notif.type];
  return (
    <div
      className="flex gap-4 px-5 py-4 border-b border-[#f1f5f9] last:border-0 transition-colors cursor-pointer hover:bg-[#f8fafc]"
      style={{ background: notif.read ? "transparent" : "#f0fdf4" }}
      onClick={() => onRead(notif.id)}
    >
      {/* Icon */}
      <div
        className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
        style={{ background: config.bg, color: config.color }}
      >
        {config.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm font-semibold leading-tight">{notif.title}</div>
          {!notif.read && (
            <div className="w-2 h-2 rounded-full bg-[#059669] flex-shrink-0 mt-1.5" />
          )}
        </div>
        <div className="text-sm text-[#64748b] mt-0.5 leading-relaxed">{notif.body}</div>
        <div className="flex items-center gap-3 mt-1.5">
          <span
            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: config.bg, color: config.color }}
          >
            {config.label}
          </span>
          <span className="text-[11px] text-[#94a3b8]">{notif.time}</span>
        </div>
      </div>
    </div>
  );
}

export function NotificationsPage() {
  const [notifs, setNotifs] = useState(NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markAllRead = () => setNotifs((ns) => ns.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifs((ns) => ns.map((n) => n.id === id ? { ...n, read: true } : n));

  const unreadCount = notifs.filter((n) => !n.read).length;
  const displayed = filter === "unread" ? notifs.filter((n) => !n.read) : notifs;

  // Group by type
  const groups: { type: Notification["type"]; label: string; items: Notification[] }[] = [
    { type: "complaint", label: "Complaint Updates", items: displayed.filter((n) => n.type === "complaint") },
    { type: "poll", label: "Poll Reminders", items: displayed.filter((n) => n.type === "poll") },
    { type: "badge", label: "Achievements", items: displayed.filter((n) => n.type === "badge") },
  ].filter((g) => g.items.length > 0);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Notifications</h1>
          <p
            className="text-sm text-[#64748b]"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            বিজ্ঞপ্তিসমূহ
          </p>
        </div>
        <div className="flex items-center gap-3">
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#059669] hover:underline"
            >
              <CheckCheck size={13} />
              Mark all read
            </button>
          )}
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-[#f1f5f9] p-1 rounded-xl w-fit">
        {([["all", "All"], ["unread", "Unread"]] as const).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: filter === value ? "#fff" : "transparent",
              color: filter === value ? "#0f172a" : "#64748b",
              boxShadow: filter === value ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}
          >
            {label}
            {value === "unread" && unreadCount > 0 && (
              <span
                className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: "#059669", color: "#fff" }}
              >
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Grouped notifications */}
      {groups.length === 0 ? (
        <div className="text-center py-16 text-[#94a3b8]">
          <div className="text-4xl mb-3">🔔</div>
          <div className="font-semibold">No unread notifications</div>
          <div className="text-sm">You&apos;re all caught up!</div>
        </div>
      ) : (
        groups.map((group) => {
          const config = TYPE_CONFIG[group.type];
          return (
            <div key={group.type} className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
              <div
                className="px-5 py-3 border-b border-[#e2e8f0] flex items-center gap-2"
                style={{ background: config.bg }}
              >
                <span style={{ color: config.color }}>{config.icon}</span>
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: config.color }}
                >
                  {group.label}
                </span>
                <span
                  className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: "#fff", color: config.color }}
                >
                  {group.items.length}
                </span>
              </div>
              <div>
                {group.items.map((n) => (
                  <NotifRow key={n.id} notif={n} onRead={markRead} />
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
