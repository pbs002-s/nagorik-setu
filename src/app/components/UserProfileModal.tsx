import { X, MapPin, Calendar, FileText, Star, BadgeCheck } from "lucide-react";
import { findUserProfile } from "../data/mockData";

const ROLE_STYLE: Record<string, { label: string; color: string }> = {
  citizen: { label: "Citizen", color: "#059669" },
  officer: { label: "Govt. Officer", color: "#1d4ed8" },
  superadmin: { label: "Super Admin", color: "#7c3aed" },
};

export function UserProfileModal({ name, onClose }: { name: string; onClose: () => void }) {
  const profile = findUserProfile(name);
  const initials = profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const roleStyle = ROLE_STYLE[profile.role] ?? ROLE_STYLE.citizen;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-4" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-5 py-4 border-b border-[#e2e8f0] flex items-center justify-between">
          <span className="text-sm font-semibold">Citizen Profile</span>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-[#f8fafc] transition-colors">
            <X size={16} className="text-[#64748b]" />
          </button>
        </div>

        <div className="p-6 text-center">
          <div
            className="w-16 h-16 rounded-full mx-auto flex items-center justify-center text-white text-lg font-bold"
            style={{ background: roleStyle.color }}
          >
            {initials}
          </div>
          <div className="font-bold text-base text-[#0f172a] mt-3">{profile.name}</div>
          <div className="flex items-center justify-center gap-1.5 mt-1.5 flex-wrap">
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-white" style={{ background: roleStyle.color }}>
              {roleStyle.label}
            </span>
            <span className="text-[10px] font-mono text-[#94a3b8] flex items-center gap-0.5">
              <BadgeCheck size={10} /> {profile.id}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-5 text-left">
            <div className="bg-[#f8fafc] rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-1">
                <MapPin size={11} /> District
              </div>
              <div className="text-sm font-semibold text-[#0f172a]">{profile.district}</div>
            </div>
            <div className="bg-[#f8fafc] rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-1">
                <Calendar size={11} /> Joined
              </div>
              <div className="text-sm font-semibold text-[#0f172a]">{profile.joined}</div>
            </div>
            <div className="bg-[#f8fafc] rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-1">
                <FileText size={11} /> Complaints
              </div>
              <div className="text-sm font-semibold text-[#0f172a]">{profile.complaints}</div>
            </div>
            <div className="bg-[#f8fafc] rounded-xl p-3">
              <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#64748b] uppercase tracking-wider mb-1">
                <Star size={11} /> Civic Points
              </div>
              <div className="text-sm font-semibold text-[#7c3aed]">{profile.points.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
