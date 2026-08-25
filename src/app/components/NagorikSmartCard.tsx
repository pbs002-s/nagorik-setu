import { useState } from "react";
import {
  Shield,
  QrCode,
  Award,
  Sparkles,
  RotateCw,
  Printer,
  Download,
  CheckCircle2,
  Phone,
  Landmark,
  MapPin,
  Calendar,
} from "lucide-react";
import { toast } from "sonner";

interface NagorikSmartCardProps {
  userName: string;
  userId: string;
  district: string;
  points: number;
  role: string;
  joinedDate?: string;
  nid?: string;
}

export function NagorikSmartCard({
  userName,
  userId,
  district,
  points,
  role,
  joinedDate = "March 2024",
  nid = "19942691234567890",
}: NagorikSmartCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const getTier = (pts: number) => {
    if (pts >= 3000) return { name: "Platinum Nagorik Hero", badge: "🏆 Platinum", color: "from-cyan-500 to-blue-600", bg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/30" };
    if (pts >= 2000) return { name: "Gold Civic Reformer", badge: "🥇 Gold", color: "from-amber-400 to-yellow-600", bg: "bg-amber-500/10 text-amber-400 border-amber-500/30" };
    if (pts >= 1000) return { name: "Silver Civic Advocate", badge: "🥈 Silver", color: "from-slate-300 to-slate-500", bg: "bg-slate-400/10 text-slate-300 border-slate-400/30" };
    return { name: "Bronze Active Citizen", badge: "🥉 Bronze", color: "from-emerald-500 to-teal-600", bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" };
  };

  const tier = getTier(points);
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    toast.success("Nagorik Smart Card generated!", {
      description: "Digital verified pass saved to your downloads.",
    });
  };

  return (
    <div className="space-y-4">
      {/* Card Viewport with Perspective */}
      <div className="w-full max-w-md mx-auto perspective-1000 select-none">
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className={`relative w-full h-[240px] sm:h-[260px] rounded-3xl transition-transform duration-700 cursor-pointer transform-style-3d shadow-2xl border border-white/10 ${
            isFlipped ? "rotate-y-180" : ""
          }`}
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ════ FRONT OF CARD ════ */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl p-5 flex flex-col justify-between overflow-hidden backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              background: "linear-gradient(135deg, #0f172a 0%, #064e3b 60%, #022c22 100%)",
            }}
          >
            {/* Holographic overlay shimmer */}
            <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
            <div className="absolute -left-20 -bottom-20 w-60 h-60 rounded-full bg-cyan-400/10 blur-3xl pointer-events-none" />

            {/* Top Bar: Govt Emblem & Title */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-emerald-400 shadow-sm">
                  <Landmark size={18} />
                </div>
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-emerald-300">
                    Government of Bangladesh
                  </div>
                  <div className="text-xs font-extrabold text-white flex items-center gap-1.5">
                    নাগরিক সেতু • Nagorik Smart Pass
                  </div>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border backdrop-blur-md ${tier.bg}`}>
                {tier.badge}
              </span>
            </div>

            {/* Middle: User Info & Photo */}
            <div className="flex items-center gap-4 relative z-10 my-auto">
              <div className="relative">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-2xl bg-slate-900 flex items-center justify-center text-white font-bold text-lg">
                    {initials}
                  </div>
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-white">
                  <CheckCircle2 size={12} />
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <div className="text-base font-bold text-white truncate tracking-tight">{userName}</div>
                <div className="text-[11px] text-emerald-200/80 flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1">
                    <MapPin size={11} /> {district}, BD
                  </span>
                  <span>•</span>
                  <span className="capitalize text-emerald-300 font-semibold">{role}</span>
                </div>
                <div className="text-[10px] font-mono text-slate-300 mt-1">
                  ID: <span className="text-emerald-400 font-semibold tracking-wider">{userId}</span>
                </div>
              </div>

              <div className="hidden sm:flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
                <QrCode size={36} className="text-emerald-300" />
                <span className="text-[8px] text-slate-300 uppercase tracking-wider mt-0.5">Scan to Verify</span>
              </div>
            </div>

            {/* Bottom Bar: Points & NID Verification */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-[10px] text-slate-300 relative z-10">
              <div className="flex items-center gap-3">
                <div>
                  <span className="text-slate-400">Civic Points:</span>{" "}
                  <span className="font-bold text-emerald-400">{points.toLocaleString()} PTS</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1 text-emerald-300">
                  <Shield size={11} />
                  <span>Verified Citizen</span>
                </div>
              </div>
              <div className="text-[9px] text-slate-400 font-mono">Issued {joinedDate}</div>
            </div>
          </div>

          {/* ════ BACK OF CARD ════ */}
          <div
            className="absolute inset-0 w-full h-full rounded-3xl p-5 flex flex-col justify-between overflow-hidden rotate-y-180 backface-hidden"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "linear-gradient(135deg, #020617 0%, #0f172a 70%, #064e3b 100%)",
            }}
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between text-xs text-white pb-2 border-b border-white/10">
              <span className="font-bold flex items-center gap-1.5 text-emerald-400">
                <Shield size={14} /> National Civic Engagement Pass
              </span>
              <span className="text-[10px] text-slate-400 font-mono">NID: {nid.slice(0, 6)}••••••</span>
            </div>

            {/* Middle: Rules & Helplines */}
            <div className="space-y-2 text-[10px] text-slate-300 my-auto leading-relaxed">
              <p>
                • This digital certificate verifies registered participation in municipal grievance tracking, civic
                voting, and public consultations.
              </p>
              <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 grid grid-cols-2 gap-2 text-[10px]">
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Phone size={11} /> <strong>999</strong> - Emergency
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Phone size={11} /> <strong>333</strong> - Citizen Info
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Phone size={11} /> <strong>109</strong> - Women Helpline
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <Phone size={11} /> <strong>106</strong> - ACC / দুদক
                </div>
              </div>
            </div>

            {/* Bottom Bar: Barcode Mock & Stamp */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="space-y-0.5">
                <div className="h-4 w-32 bg-slate-400/30 rounded flex items-center justify-center font-mono text-[8px] tracking-widest text-slate-200">
                  ||||| | |||| ||| |||||
                </div>
                <div className="text-[8px] text-slate-400">Digital Authenticity Hash: #BGD-{userId}</div>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-bold text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                  OFFICIAL PASS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action Controls */}
      <div className="flex items-center justify-center gap-2 pt-2">
        <button
          onClick={() => setIsFlipped(!isFlipped)}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <RotateCw size={13} className="text-emerald-600" />
          {isFlipped ? "Show Front" : "Flip Card"}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Download size={13} className="text-emerald-600" />
          Save Digital Pass
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
        >
          <Printer size={13} className="text-emerald-600" />
          Print ID
        </button>
      </div>
    </div>
  );
}
