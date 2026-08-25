import { useState } from "react";
import { BADGES, LEADERBOARD } from "../data/mockData";
import { useData } from "../components/DataContext";
import { useAuth } from "../components/AuthContext";
import { Trophy, Award, Star, Shield, Sparkles, TrendingUp, Medal } from "lucide-react";

const ICON_MAP: Record<string, string> = {
  FileText: "📄",
  BarChart2: "📊",
  Eye: "👁️",
  Users: "👥",
  Calendar: "📅",
  Trophy: "🏆",
  Award: "🎖️",
  Star: "⭐",
  Shield: "🛡️",
};

export function AchievementsPage() {
  const { civicPoints, complaints, polls } = useData();
  const { userName } = useAuth();

  const votedPollsCount = polls.filter((p) => p.votedOption !== null).length;
  const complaintsCount = complaints.length;

  // Calculate dynamic badges based on real user activity
  const dynamicBadges = BADGES.map((b) => {
    let unlocked = b.unlocked;
    let progress = b.progress;

    if (b.id === "b1") {
      progress = Math.min(complaintsCount, 1);
      unlocked = complaintsCount >= 1;
    } else if (b.id === "b2") {
      progress = Math.min(votedPollsCount, 5);
      unlocked = votedPollsCount >= 5;
    } else if (b.id === "b3") {
      progress = Math.min(complaintsCount, 5);
      unlocked = complaintsCount >= 5;
    } else if (b.id === "b6") {
      progress = Math.min(votedPollsCount, 20);
      unlocked = votedPollsCount >= 20;
    } else if (b.id === "b7") {
      progress = Math.min(civicPoints, 1000);
      unlocked = civicPoints >= 1000;
    } else if (b.id === "b8") {
      progress = Math.min(complaintsCount, 20);
      unlocked = complaintsCount >= 20;
    }

    return {
      ...b,
      unlocked,
      progress,
    };
  });

  const unlocked = dynamicBadges.filter((b) => b.unlocked);

  const dynamicLeaderboard = LEADERBOARD.map((entry) => {
    if (entry.isCurrentUser) {
      return {
        ...entry,
        name: `${userName} (You)`,
        points: civicPoints,
        badges: unlocked.length,
      };
    }
    return entry;
  }).sort((a, b) => b.points - a.points);

  const myRank = dynamicLeaderboard.findIndex((e) => e.isCurrentUser) + 1;

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white">Civic Achievements & Leaderboard</h1>
        <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          নাগরিক অর্জনসমূহ, সম্মাননা পদক ও জাতীয় মেধা তালিকা
        </p>
      </div>

      {/* Points Banner */}
      <div className="rounded-3xl p-7 bg-gradient-to-r from-[#0f172a] via-[#134e4a] to-[#064e3b] text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <div className="text-4xl sm:text-5xl font-black tabular-nums tracking-tight text-emerald-400">
            {civicPoints.toLocaleString()}
          </div>
          <div className="text-sm font-bold text-slate-200">Total Civic Reputation Points</div>
          <div
            className="text-xs text-emerald-200/80 mt-0.5"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            অভিযোগ দাখিল, ভোট প্রদান ও জনমত গঠনে অর্জিত স্কোর
          </div>
        </div>

        <div className="flex gap-6 text-center relative z-10">
          <div className="space-y-0.5">
            <div className="text-2xl font-black text-white">{unlocked.length} / 9</div>
            <div className="text-xs text-slate-300">Badges Earned</div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="space-y-0.5">
            <div className="text-2xl font-black text-emerald-400">#{myRank || 24}</div>
            <div className="text-xs text-slate-300">National Rank</div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="space-y-0.5">
            <div className="text-2xl font-black text-white">{complaintsCount}</div>
            <div className="text-xs text-slate-300">Reports Filed</div>
          </div>
        </div>
      </div>

      {/* Badge Gallery */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-[#0f172a] dark:text-white flex items-center gap-2">
            <Medal size={18} className="text-emerald-600" />
            Official Civic Badges ({unlocked.length}/{dynamicBadges.length})
          </h2>
          <span className="text-xs text-slate-500">Unlocks automatically via platform participation</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {dynamicBadges.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center justify-between gap-3 p-4 rounded-3xl border transition-all duration-200 hover:shadow-sm"
              style={{
                background: badge.unlocked ? "#fff" : "#f8fafc",
                borderColor: badge.unlocked ? "#a7f3d0" : "#e2e8f0",
                opacity: badge.unlocked ? 1 : 0.65,
              }}
              title={badge.desc}
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xs"
                style={{
                  background: badge.unlocked ? "#ecfdf5" : "#f1f5f9",
                  filter: badge.unlocked ? "none" : "grayscale(1)",
                }}
              >
                {ICON_MAP[badge.icon] ?? "🎯"}
              </div>

              <div className="text-center">
                <div className="text-xs font-bold text-[#0f172a] leading-tight">{badge.name}</div>
                <div
                  className="text-[10px] text-[#64748b] mt-0.5"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  {badge.nameBn}
                </div>
              </div>

              {badge.unlocked ? (
                <div
                  className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                  style={{ background: "#ecfdf5", color: "#059669" }}
                >
                  Earned ✓
                </div>
              ) : (
                <div className="w-full space-y-1">
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Progress</span>
                    <span className="font-bold text-slate-600">
                      {badge.progress}/{badge.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#059669]"
                      style={{ width: `${Math.min((badge.progress / badge.total) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-[#0f172a] dark:text-white flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            Bangladesh Civic Champions Leaderboard
          </h2>
          <span className="text-xs text-slate-500">Updated hourly</span>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
          <div className="hidden md:grid grid-cols-[60px_1fr_140px_120px_100px] px-6 py-3.5 border-b border-[#e2e8f0] dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-800/50 text-xs font-bold text-[#64748b] uppercase tracking-wider">
            {["Rank", "Citizen", "District", "Civic Points", "Badges"].map((h) => (
              <div key={h}>{h}</div>
            ))}
          </div>

          <div className="divide-y divide-[#f1f5f9] dark:divide-slate-800">
            {dynamicLeaderboard.map((entry, idx) => {
              const initials = entry.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const rankDisplay = idx + 1;
              const isTop3 = rankDisplay <= 3;

              return (
                <div
                  key={entry.name}
                  className={`px-6 py-4 flex flex-col md:grid md:grid-cols-[60px_1fr_140px_120px_100px] items-center gap-2 transition-colors ${
                    entry.isCurrentUser
                      ? "bg-emerald-50/70 dark:bg-emerald-950/40 font-bold"
                      : "hover:bg-slate-50/60 dark:hover:bg-slate-800/40"
                  }`}
                >
                  <div className="flex items-center gap-2 font-black text-sm">
                    {isTop3 ? (
                      <span className="text-lg">{rankDisplay === 1 ? "🥇" : rankDisplay === 2 ? "🥈" : "🥉"}</span>
                    ) : (
                      <span className="text-slate-400">#{rankDisplay}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 w-full">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: entry.isCurrentUser ? "#059669" : "#0f172a" }}
                    >
                      {initials}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#0f172a] dark:text-white">{entry.name}</div>
                      {entry.isCurrentUser && (
                        <span className="text-[10px] text-emerald-600 font-semibold">Your Profile</span>
                      )}
                    </div>
                  </div>

                  <div className="text-xs text-slate-500">{entry.district}, BD</div>

                  <div className="text-xs font-black text-[#059669] tabular-nums">
                    {entry.points.toLocaleString()} PTS
                  </div>

                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    🎖️ {entry.badges} Badges
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
