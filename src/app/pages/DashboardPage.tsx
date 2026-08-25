import { useNavigate } from "react-router";
import {
  FileText,
  CheckCircle,
  Clock,
  Star,
  FilePlus,
  BarChart2,
  ArrowRight,
  ChevronRight,
  AlertTriangle,
  Globe,
  CreditCard,
  BookOpen,
  Map,
  Receipt,
  Zap,
  Shield,
  ThumbsUp,
  MessageSquare,
  Sparkles,
  Award,
  TrendingUp,
  QrCode,
  PhoneCall,
  Flame,
} from "lucide-react";
import { useAuth } from "../components/AuthContext";
import { useData } from "../components/DataContext";
import { StatusBadge } from "../components/StatusBadge";
import { BADGES, BANGLADESH_DIVISIONS } from "../data/mockData";

function KpiCard({
  label,
  labelBn,
  value,
  icon,
  color,
  onClick,
}: {
  label: string;
  labelBn: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-2xl p-5 flex items-start gap-4 text-left w-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-emerald-500/50 group"
    >
      <div
        className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm transition-transform group-hover:scale-110"
        style={{ background: `${color}18`, color }}
      >
        {icon}
      </div>
      <div>
        <div className="text-2xl font-black tabular-nums tracking-tight" style={{ color }}>
          {value}
        </div>
        <div className="text-sm font-semibold text-[#0f172a] dark:text-white mt-0.5">{label}</div>
        <div
          className="text-[11px] text-[#64748b] dark:text-slate-400"
          style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
        >
          {labelBn}
        </div>
      </div>
    </button>
  );
}

const E_SERVICES_QUICK = [
  { icon: CreditCard, label: "NID Card", labelBn: "জাতীয় পরিচয়পত্র", path: "/services" },
  { icon: BookOpen, label: "E-Passport", labelBn: "ই-পাসপোর্ট", path: "/services" },
  { icon: Map, label: "Land Record", labelBn: "ভূমি রেকর্ড", path: "/services" },
  { icon: Receipt, label: "Tax / eTIN", labelBn: "কর সেবা", path: "/services" },
  { icon: Zap, label: "Utility Bills", labelBn: "ইউটিলিটি বিল", path: "/services" },
  { icon: Shield, label: "Police Clearance", labelBn: "পুলিশ ক্লিয়ারেন্স", path: "/services" },
];

const ANNOUNCEMENT_TYPE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  emergency: { bg: "#fef2f2", color: "#dc2626", label: "Emergency" },
  maintenance: { bg: "#fef3c7", color: "#d97706", label: "Maintenance" },
  celebration: { bg: "#ecfdf5", color: "#059669", label: "Celebration" },
  weather: { bg: "#eff6ff", color: "#1d4ed8", label: "Weather" },
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { userName, language, setLanguage, userId } = useAuth();
  const { complaints, discussions, announcements, polls, civicPoints } = useData();
  const firstName = userName.split(" ")[0];

  // Dynamic calculated stats
  const totalComplaints = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === "resolved").length;
  const pendingCount = complaints.filter((c) => c.status !== "resolved" && c.status !== "rejected").length;

  const recentActivity = complaints.slice(0, 4).map((c) => ({
    id: c.id,
    title: c.title,
    status: c.status,
    time: c.timeline[c.timeline.length - 1]?.time || c.date,
  }));

  const unlockedBadges = BADGES.filter((b) => b.unlocked).slice(0, 3);
  const emergency = announcements.find((a) => a.type === "emergency");
  const recentAnnouncements = announcements.slice(0, 5);
  const approvedDiscussions = discussions.filter((d) => d.status === "approved").slice(0, 3);
  const activePolls = polls.filter((p) => !p.closed).slice(0, 2);

  const dhakaStat = BANGLADESH_DIVISIONS[0];

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Emergency alert banner */}
      {emergency && (
        <div
          className="flex items-start gap-4 p-4 rounded-2xl border border-red-300 dark:border-red-900 shadow-sm"
          style={{ background: "linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)" }}
        >
          <div className="w-10 h-10 rounded-xl bg-[#dc2626] flex items-center justify-center flex-shrink-0 shadow-md">
            <AlertTriangle size={18} className="text-white animate-bounce" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white px-2 py-0.5 rounded-md">
                HIGH PRIORITY ALERT
              </span>
              <span className="font-bold text-sm text-[#991b1b]">{emergency.title}</span>
            </div>
            <div className="text-xs text-[#dc2626] mt-1 leading-relaxed">{emergency.body}</div>
          </div>
          <button
            onClick={() => navigate("/notifications")}
            className="flex-shrink-0 text-xs font-semibold px-4 py-2 bg-[#dc2626] text-white rounded-xl hover:bg-[#b91c1c] transition-colors whitespace-nowrap shadow-sm"
          >
            Emergency Info
          </button>
        </div>
      )}

      {/* Greeting + Smart Banner */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#134e4a] to-[#064e3b] rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -right-16 -top-16 w-48 h-48 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-300 flex items-center gap-1">
              <Sparkles size={13} /> Official Nagorik Portal
            </span>
            <span className="text-slate-400">•</span>
            <span className="text-xs text-slate-300 font-mono">ID: {userId}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {language === "en" ? `Good day, ${firstName} 👋` : `শুভদিন, ${firstName} 👋`}
          </h1>
          <p
            className="text-xs sm:text-sm text-emerald-100/80 max-w-xl leading-relaxed"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            {language === "en"
              ? "Track your municipal requests, vote on local development polls, and access verified government e-services in one place."
              : "আপনার এলাকার নাগরিক সমস্যা দাখিল ও সমাধান পর্যবেক্ষণ করুন, সরাসরি ভোটে মতামত দিন এবং ডিজিটাল ই-সেবা গ্রহণ করুন।"}
          </p>
        </div>

        {/* Language switch & Smart Card action */}
        <div className="flex items-center gap-3 relative z-10 flex-shrink-0">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold backdrop-blur-md transition-all duration-200"
          >
            <QrCode size={15} className="text-emerald-300" />
            <span>Digital ID Card</span>
          </button>

          <div className="flex gap-1 bg-black/30 p-1 rounded-2xl border border-white/10 backdrop-blur-md">
            {(["en", "bn"] as const).map((l) => (
              <button
                key={l}
                onClick={() => setLanguage(l)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200"
                style={{
                  background: language === l ? "#059669" : "transparent",
                  color: language === l ? "#fff" : "#94a3b8",
                  boxShadow: language === l ? "0 2px 8px rgba(5,150,105,0.4)" : "none",
                }}
              >
                {l === "en" ? "EN" : "বাং"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="My Complaints"
          labelBn="আমার অভিযোগ"
          value={totalComplaints}
          icon={<FileText size={20} />}
          color="#1d4ed8"
          onClick={() => navigate("/complaints")}
        />
        <KpiCard
          label="Resolved"
          labelBn="সমাধান হয়েছে"
          value={resolvedCount}
          icon={<CheckCircle size={20} />}
          color="#059669"
          onClick={() => navigate("/complaints")}
        />
        <KpiCard
          label="Pending Action"
          labelBn="অপেক্ষমাণ / প্রক্রিয়াধীন"
          value={pendingCount}
          icon={<Clock size={20} />}
          color="#d97706"
          onClick={() => navigate("/complaints")}
        />
        <KpiCard
          label="Civic Points"
          labelBn="নাগরিক পয়েন্ট"
          value={civicPoints.toLocaleString()}
          icon={<Star size={20} />}
          color="#7c3aed"
          onClick={() => navigate("/achievements")}
        />
      </div>

      {/* Announcements ticker */}
      <div>
        <div className="flex items-center justify-between mb-2.5">
          <div className="text-xs font-bold text-[#64748b] uppercase tracking-wider flex items-center gap-1.5">
            <Flame size={14} className="text-amber-500" /> Platform Announcements & Bulletins
          </div>
          <span className="text-xs text-[#94a3b8]">Live Updates</span>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
          {recentAnnouncements.map((a) => {
            const style = ANNOUNCEMENT_TYPE_STYLE[a.type] ?? ANNOUNCEMENT_TYPE_STYLE.maintenance;
            return (
              <div
                key={a.id}
                className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border text-xs font-medium max-w-sm transition-all hover:scale-[1.01]"
                style={{ background: style.bg, borderColor: `${style.color}30`, color: style.color }}
              >
                <span
                  className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md shadow-xs"
                  style={{ background: style.color, color: "#fff" }}
                >
                  {style.label}
                </span>
                <span className="text-[#0f172a] dark:text-slate-200 font-semibold truncate">{a.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Grid: 2 Column Layout */}
      <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* Left Column: Quick Actions + Recent Complaints + E-Services */}
        <div className="space-y-6">
          {/* Quick Primary Actions */}
          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={() => navigate("/complaints/new")}
              className="flex items-center justify-between p-5 bg-gradient-to-tr from-[#059669] to-[#10b981] text-white rounded-2xl hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-inner">
                  <FilePlus size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm">File a Complaint</div>
                  <div className="text-xs text-emerald-100" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                    নাগরিক সমস্যা জানান
                  </div>
                </div>
              </div>
              <ArrowRight size={18} className="opacity-80 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/polls")}
              className="flex items-center justify-between p-5 bg-gradient-to-tr from-[#1d4ed8] to-[#3b82f6] text-white rounded-2xl hover:shadow-lg hover:scale-[1.01] active:scale-[0.99] transition-all group"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center text-white shadow-inner">
                  <BarChart2 size={20} />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm">Live Civic Polls</div>
                  <div className="text-xs text-blue-100" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                    মতামত ও ভোট দিন
                  </div>
                </div>
              </div>
              <ArrowRight size={18} className="opacity-80 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Recent Complaints Stream */}
          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-bold text-sm text-[#0f172a] dark:text-white">Recent Complaint Activity</h2>
                <div className="text-[10px] text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  সাম্প্রতিক অভিযোগ ও অগ্রগতি
                </div>
              </div>
              <button
                onClick={() => navigate("/complaints")}
                className="text-xs font-semibold text-[#059669] hover:underline flex items-center gap-1"
              >
                View all ({totalComplaints}) <ChevronRight size={13} />
              </button>
            </div>

            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentActivity.map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/complaints/${item.id}`)}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-2 rounded-xl cursor-pointer transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono text-slate-400">{item.id}</span>
                      <span className="text-xs font-semibold text-[#0f172a] dark:text-slate-200 truncate">
                        {item.title}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {item.time}
                    </div>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Quick E-Services Grid */}
          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-bold text-sm text-[#0f172a] dark:text-white">Government E-Services</h2>
                <div className="text-[10px] text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  জাতীয় ডিজিটাল সেবাসমূহ
                </div>
              </div>
              <button
                onClick={() => navigate("/services")}
                className="text-xs font-semibold text-[#059669] hover:underline flex items-center gap-1"
              >
                All 12 Services <ChevronRight size={13} />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {E_SERVICES_QUICK.map((s, i) => {
                const Icon = s.icon;
                return (
                  <button
                    key={i}
                    onClick={() => navigate(s.path)}
                    className="flex flex-col items-start p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-emerald-50/30 dark:hover:bg-emerald-950/20 text-left transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-[#059669] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                      <Icon size={16} />
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-tight">{s.label}</div>
                    <div
                      className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 truncate"
                      style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                    >
                      {s.labelBn}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: AI Assistant Card + Civic Health + Trending Discussions */}
        <div className="space-y-6">
          {/* Setu AI Feature Highlight */}
          <div className="rounded-3xl p-5 bg-gradient-to-br from-slate-900 to-slate-800 text-white border border-slate-700/60 shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-md">
                <Sparkles size={16} />
              </div>
              <div>
                <div className="text-xs font-extrabold text-white flex items-center gap-1">
                  Setu AI Citizen Assistant
                </div>
                <div className="text-[10px] text-emerald-300" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  স্মার্ট অভিযোগ ও সেবা সহায়ক
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              Need help structuring a complaint, estimating passport fees, or verifying NID rules? Setu AI generates
              official draft complaints in seconds.
            </p>
            <button
              onClick={() => {
                const btn = document.getElementById("setu-ai-launcher");
                if (btn) btn.click();
              }}
              className="w-full py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
            >
              <Sparkles size={13} />
              Launch Setu AI Assistant
            </button>
          </div>

          {/* Division Civic Health Score */}
          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Dhaka Division Civic Index</h3>
                <div className="text-sm font-bold text-slate-900 dark:text-white">নাগরিক সেবা সন্তুষ্টি সূচক</div>
              </div>
              <span className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                {dhakaStat.civicHealthScore}/100
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden mb-3">
              <div className="bg-[#059669] h-full rounded-full" style={{ width: `${dhakaStat.resolutionRate}%` }} />
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-400">Resolved Rate:</span>{" "}
                <strong className="text-slate-900 dark:text-slate-200">{dhakaStat.resolutionRate}%</strong>
              </div>
              <div>
                <span className="text-slate-400">Top Issue:</span>{" "}
                <strong className="text-slate-900 dark:text-slate-200 truncate">{dhakaStat.topCategory}</strong>
              </div>
            </div>
          </div>

          {/* Trending Citizen Discussions */}
          <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-[#0f172a] dark:text-white flex items-center gap-1.5">
                <MessageSquare size={14} className="text-emerald-600" />
                Trending Community Discussions
              </h3>
              <button
                onClick={() => navigate("/discussions")}
                className="text-xs font-semibold text-[#059669] hover:underline"
              >
                Join
              </button>
            </div>

            <div className="space-y-2.5">
              {approvedDiscussions.map((d) => (
                <div
                  key={d.id}
                  onClick={() => navigate("/discussions")}
                  className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-emerald-50/40 dark:hover:bg-slate-800 border border-slate-100 dark:border-slate-800 cursor-pointer transition-colors"
                >
                  <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">{d.title}</div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1.5">
                    <span>By {d.author}</span>
                    <div className="flex items-center gap-2">
                      <span>👍 {d.likes}</span>
                      <span>💬 {d.comments}</span>
                    </div>
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
