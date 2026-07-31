import { useNavigate } from "react-router";
import {
  FileText, CheckCircle, Clock, Star, FilePlus, BarChart2,
  ArrowRight, ChevronRight, AlertTriangle, Globe,
  CreditCard, BookOpen, Map, Receipt, Zap, Shield,
  ThumbsUp, MessageSquare,
} from "lucide-react";
import { useAuth } from "../components/AuthContext";
import { useData } from "../components/DataContext";
import { StatusBadge } from "../components/StatusBadge";
import { COMPLAINTS, BADGES, ANNOUNCEMENTS } from "../data/mockData";

function KpiCard({ label, labelBn, value, icon, color, onClick }: {
  label: string; labelBn: string; value: string | number; icon: React.ReactNode; color: string; onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex items-start gap-4 text-left w-full transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-current"
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18`, color }}>
        {icon}
      </div>
      <div>
        <div className="text-2xl font-extrabold tabular-nums" style={{ color }}>{value}</div>
        <div className="text-sm font-medium text-[#0f172a]">{label}</div>
        <div className="text-[10px] text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>{labelBn}</div>
      </div>
    </button>
  );
}

const E_SERVICES = [
  { icon: CreditCard, label: "NID Card", labelBn: "জাতীয় পরিচয়পত্র" },
  { icon: BookOpen, label: "E-Passport", labelBn: "ই-পাসপোর্ট" },
  { icon: Map, label: "Land Record", labelBn: "ভূমি রেকর্ড" },
  { icon: Receipt, label: "Tax / eTIN", labelBn: "কর সেবা" },
  { icon: Zap, label: "Utility Bills", labelBn: "ইউটিলিটি বিল" },
  { icon: Shield, label: "Police Clearance", labelBn: "পুলিশ ক্লিয়ারেন্স" },
];

const ANNOUNCEMENT_TYPE_STYLE: Record<string, { bg: string; color: string; label: string }> = {
  emergency: { bg: "#fef2f2", color: "#dc2626", label: "Emergency" },
  maintenance: { bg: "#fef3c7", color: "#d97706", label: "Maintenance" },
  celebration: { bg: "#ecfdf5", color: "#059669", label: "Celebration" },
  weather: { bg: "#eff6ff", color: "#1d4ed8", label: "Weather" },
};

export function DashboardPage() {
  const navigate = useNavigate();
  const { userName, language, setLanguage } = useAuth();
  const { discussions } = useData();
  const firstName = userName.split(" ")[0];

  const recentActivity = COMPLAINTS.slice(0, 5).map((c) => ({
    id: c.id, title: c.title, status: c.status,
    time: c.timeline[c.timeline.length - 1].time,
  }));
  const unlockedBadges = BADGES.filter((b) => b.unlocked).slice(0, 3);
  const nextBadge = BADGES.find((b) => !b.unlocked);

  const emergency = ANNOUNCEMENTS.find((a) => a.type === "emergency");
  const recentAnnouncements = ANNOUNCEMENTS.slice(0, 4);
  const approvedDiscussions = discussions.filter((d) => d.status === "approved").slice(0, 3);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Emergency alert banner */}
      {emergency && (
        <div className="flex items-start gap-4 p-4 rounded-2xl border border-[#fca5a5]" style={{ background: "#fef2f2" }}>
          <div className="w-9 h-9 rounded-xl bg-[#dc2626] flex items-center justify-center flex-shrink-0">
            <AlertTriangle size={16} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm text-[#991b1b]">{emergency.title}</div>
            <div className="text-xs text-[#dc2626] mt-0.5 leading-relaxed">{emergency.body}</div>
          </div>
          <button className="flex-shrink-0 text-xs font-semibold px-4 py-2 bg-[#dc2626] text-white rounded-xl hover:bg-[#b91c1c] transition-colors whitespace-nowrap">
            Get Help
          </button>
        </div>
      )}

      {/* Greeting + language toggle */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a]">
            {language === "en" ? `Good morning, ${firstName}.` : `সুপ্রভাত, ${firstName}।`}
          </h1>
          <p className="text-sm text-[#64748b] mt-0.5" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            {language === "en" ? "আপনার নাগরিক ড্যাশবোর্ডে স্বাগতম" : "Welcome to your citizen dashboard"}
          </p>
        </div>
        <div className="flex gap-1 bg-[#f1f5f9] p-1 rounded-xl flex-shrink-0">
          {(["en", "bn"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
              style={{
                background: language === l ? "#fff" : "transparent",
                color: language === l ? "#059669" : "#64748b",
                boxShadow: language === l ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
              }}
            >
              {l === "en" ? "EN" : "বাং"}
            </button>
          ))}
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="My Complaints" labelBn="আমার অভিযোগ" value={8} icon={<FileText size={18} />} color="#1d4ed8" onClick={() => navigate("/complaints")} />
        <KpiCard label="Resolved" labelBn="সমাধান হয়েছে" value={5} icon={<CheckCircle size={18} />} color="#059669" onClick={() => navigate("/complaints")} />
        <KpiCard label="Pending" labelBn="অপেক্ষমাণ" value={2} icon={<Clock size={18} />} color="#d97706" onClick={() => navigate("/complaints")} />
        <KpiCard label="Civic Points" labelBn="নাগরিক পয়েন্ট" value="1,240" icon={<Star size={18} />} color="#7c3aed" onClick={() => navigate("/achievements")} />
      </div>

      {/* Announcements strip */}
      <div>
        <div className="text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-2">Announcements</div>
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {recentAnnouncements.map((a) => {
            const style = ANNOUNCEMENT_TYPE_STYLE[a.type] ?? ANNOUNCEMENT_TYPE_STYLE.maintenance;
            return (
              <div
                key={a.id}
                className="flex-shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-xs font-medium max-w-xs"
                style={{ background: style.bg, borderColor: `${style.color}30`, color: style.color }}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full" style={{ background: style.color, color: "#fff" }}>
                  {style.label}
                </span>
                <span className="text-[#0f172a] truncate">{a.title}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid md:grid-cols-2 gap-4">
        <button onClick={() => navigate("/complaints/new")}
          className="flex items-center justify-between p-5 bg-[#059669] text-white rounded-2xl hover:bg-[#047857] transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <FilePlus size={18} />
            </div>
            <div className="text-left">
              <div className="font-semibold">File a Complaint</div>
              <div className="text-xs text-green-100" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>অভিযোগ দাখিল করুন</div>
            </div>
          </div>
          <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
        </button>
        <button onClick={() => navigate("/polls")}
          className="flex items-center justify-between p-5 bg-[#1d4ed8] text-white rounded-2xl hover:bg-[#1e40af] transition-colors group">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
              <BarChart2 size={18} />
            </div>
            <div className="text-left">
              <div className="font-semibold">Vote in Active Poll</div>
              <div className="text-xs text-blue-200" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>সক্রিয় পোলে ভোট দিন</div>
            </div>
          </div>
          <ArrowRight size={18} className="opacity-70 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* E-Services shortcuts */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="font-semibold text-sm flex items-center gap-2">
              <Globe size={14} className="text-[#059669]" />
              E-Services Hub
            </div>
            <div className="text-[10px] text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>ই-সেবা কেন্দ্র</div>
          </div>
          <button onClick={() => navigate("/services")} className="text-xs text-[#059669] font-medium flex items-center gap-1 hover:underline">
            All services <ChevronRight size={12} />
          </button>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
          {E_SERVICES.map(({ icon: Icon, label, labelBn }) => (
            <button
              key={label}
              onClick={() => navigate("/services")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-[#e2e8f0] hover:border-[#059669] hover:bg-[#ecfdf5] transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#f8fafc] group-hover:bg-[#059669] flex items-center justify-center transition-colors">
                <Icon size={16} className="text-[#64748b] group-hover:text-white transition-colors" />
              </div>
              <div className="text-center">
                <div className="text-[10px] font-semibold text-[#0f172a] leading-tight">{label}</div>
                <div className="text-[9px] text-[#94a3b8]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>{labelBn}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Two column: activity + gamification */}
      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        {/* Recent activity */}
        <div className="space-y-4">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">Recent Activity</div>
                <div className="text-[10px] text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>সাম্প্রতিক কার্যক্রম</div>
              </div>
              <button onClick={() => navigate("/complaints")} className="text-xs text-[#059669] font-medium flex items-center gap-1 hover:underline">
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {recentActivity.map((item) => (
                <button key={item.id} onClick={() => navigate(`/complaints/${item.id}`)}
                  className="w-full px-5 py-4 flex items-center justify-between hover:bg-[#f8fafc] transition-colors text-left group">
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium truncate pr-4">{item.title}</div>
                    <div className="text-xs text-[#64748b] mt-0.5 flex items-center gap-1">
                      <Clock size={10} />{item.time}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <StatusBadge status={item.status} />
                    <ChevronRight size={14} className="text-[#94a3b8] group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Community Discussions preview */}
          <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm flex items-center gap-2">
                  <MessageSquare size={13} className="text-[#059669]" />
                  Community Discussions
                </div>
                <div className="text-[10px] text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>সামাজিক আলোচনা</div>
              </div>
              <button onClick={() => navigate("/discussions")} className="text-xs text-[#059669] font-medium flex items-center gap-1 hover:underline">
                View all <ChevronRight size={12} />
              </button>
            </div>
            <div className="divide-y divide-[#f1f5f9]">
              {approvedDiscussions.map((d) => (
                <div key={d.id} className="px-5 py-4">
                  <div className="text-sm font-medium text-[#0f172a] mb-1">{d.title}</div>
                  <div className="flex items-center gap-3 text-xs text-[#64748b]">
                    <span className="px-2 py-0.5 rounded-full bg-[#f1f5f9] text-[#64748b] font-medium">{d.category}</span>
                    <span className="flex items-center gap-1"><ThumbsUp size={10} />{d.likes}</span>
                    <span className="flex items-center gap-1"><MessageSquare size={10} />{d.comments}</span>
                    <span>{d.createdAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gamification */}
        <div className="space-y-4">
          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="font-semibold text-sm">Next Badge</div>
                <div className="text-[10px] text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>পরবর্তী ব্যাজ</div>
              </div>
              <button onClick={() => navigate("/achievements")} className="text-xs text-[#059669] font-medium hover:underline">View all</button>
            </div>
            {nextBadge && (
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl border-2 border-dashed border-[#e2e8f0] flex items-center justify-center text-[#94a3b8] text-lg">🏆</div>
                  <div>
                    <div className="text-sm font-semibold">{nextBadge.name}</div>
                    <div className="text-xs text-[#64748b]">{nextBadge.desc}</div>
                  </div>
                </div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-[#64748b]">Progress</span>
                  <span className="font-semibold tabular-nums" style={{ color: "#059669" }}>{nextBadge.progress}/{nextBadge.total}</span>
                </div>
                <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#059669] transition-all duration-700" style={{ width: `${(nextBadge.progress / nextBadge.total) * 100}%` }} />
                </div>
                <p className="text-xs text-[#64748b] mt-2">{nextBadge.total - nextBadge.progress} more to unlock</p>
              </div>
            )}
          </div>

          <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
            <div className="font-semibold text-sm mb-3">Recent Badges</div>
            <div className="space-y-3">
              {unlockedBadges.map((b) => (
                <div key={b.id} className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex items-center justify-center text-base">
                    {b.icon === "FileText" ? "📄" : b.icon === "BarChart2" ? "📊" : "👁️"}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{b.name}</div>
                    <div className="text-xs text-[#64748b]">{b.desc}</div>
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
