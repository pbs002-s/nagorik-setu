import { useState } from "react";
import { MessageSquare, BarChart2, Award, CheckCheck, Radio, Bell } from "lucide-react";
import { useData } from "../components/DataContext";
import { type Notification } from "../data/mockData";
import { useNavigate } from "react-router";

const TYPE_CONFIG = {
  complaint: {
    icon: <MessageSquare size={16} />,
    color: "#1d4ed8",
    bg: "#eff6ff",
    label: "Complaint Update",
  },
  poll: {
    icon: <BarChart2 size={16} />,
    color: "#d97706",
    bg: "#fef3c7",
    label: "Poll Reminder",
  },
  badge: {
    icon: <Award size={16} />,
    color: "#7c3aed",
    bg: "#f5f3ff",
    label: "Civic Achievement",
  },
  system: {
    icon: <Radio size={16} />,
    color: "#dc2626",
    bg: "#fef2f2",
    label: "System Bulletin",
  },
};

export function NotificationsPage() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useData();
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed = filter === "unread" ? notifications.filter((n) => !n.read) : notifications;

  const handleRowClick = (notif: Notification) => {
    markNotificationAsRead(notif.id);
    if (notif.link) {
      navigate(notif.link);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white">Citizen Activity Notifications</h1>
          <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            অভিযোগের অগ্রগতি, নতুন পোল এবং অর্জন সংক্রান্ত নোটিফিকেশন
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllNotificationsAsRead}
            className="flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 transition-colors"
          >
            <CheckCheck size={14} />
            Mark all read ({unreadCount})
          </button>
        )}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl w-fit">
        {(
          [
            ["all", "All Updates"],
            ["unread", "Unread Only"],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            onClick={() => setFilter(value)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === value
                ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {label}
            {value === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-600 text-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications list */}
      <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        {displayed.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Bell size={40} className="mx-auto mb-3 text-slate-300" />
            <div className="font-bold text-base text-slate-700 dark:text-slate-200">No notifications to display</div>
            <div className="text-xs text-slate-500 mt-1">You are all caught up on civic bulletins!</div>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {displayed.map((n) => {
              const config = TYPE_CONFIG[n.type] ?? TYPE_CONFIG.system;
              return (
                <div
                  key={n.id}
                  onClick={() => handleRowClick(n)}
                  className={`flex items-start gap-4 p-5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                    !n.read ? "bg-emerald-50/40 dark:bg-emerald-950/20" : ""
                  }`}
                >
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs"
                    style={{ background: config.bg, color: config.color }}
                  >
                    {config.icon}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white leading-tight">
                        {n.title}
                      </div>
                      {!n.read && <span className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0 mt-1" />}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{n.body}</p>
                    <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400">
                      <span
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        style={{ background: config.bg, color: config.color }}
                      >
                        {config.label}
                      </span>
                      <span>{n.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
