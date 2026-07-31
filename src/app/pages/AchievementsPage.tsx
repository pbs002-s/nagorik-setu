import { BADGES, LEADERBOARD } from "../data/mockData";

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
  const unlocked = BADGES.filter((b) => b.unlocked);
  const locked = BADGES.filter((b) => !b.unlocked);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#0f172a]">Achievements</h1>
        <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          অর্জনসমূহ ও পুরস্কার
        </p>
      </div>

      {/* Points banner */}
      <div
        className="rounded-2xl px-6 py-5 flex flex-col md:flex-row md:items-center justify-between gap-4"
        style={{ background: "#0f172a" }}
      >
        <div>
          <div className="text-4xl font-extrabold text-white tabular-nums mb-1">1,240</div>
          <div className="text-sm font-medium text-[#94a3b8]">Civic Points earned</div>
          <div
            className="text-sm text-[#64748b] mt-0.5"
            style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
          >
            নাগরিক পয়েন্ট অর্জিত
          </div>
        </div>
        <div className="flex gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-white">{unlocked.length}</div>
            <div className="text-xs text-[#64748b]">Badges earned</div>
          </div>
          <div className="w-px bg-[#1e293b]" />
          <div>
            <div className="text-2xl font-bold" style={{ color: "#059669" }}>#24</div>
            <div className="text-xs text-[#64748b]">City rank</div>
          </div>
          <div className="w-px bg-[#1e293b]" />
          <div>
            <div className="text-2xl font-bold text-white">8</div>
            <div className="text-xs text-[#64748b]">Complaints filed</div>
          </div>
        </div>
      </div>

      {/* Badge gallery */}
      <div>
        <h2 className="font-semibold text-[#0f172a] mb-4">Badge Gallery</h2>
        <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
          {BADGES.map((badge) => (
            <div
              key={badge.id}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all duration-200"
              style={{
                background: badge.unlocked ? "#fff" : "#f8fafc",
                borderColor: badge.unlocked ? "#a7f3d0" : "#e2e8f0",
                opacity: badge.unlocked ? 1 : 0.7,
              }}
              title={badge.desc}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{
                  background: badge.unlocked ? "#ecfdf5" : "#f1f5f9",
                  filter: badge.unlocked ? "none" : "grayscale(1)",
                }}
              >
                {ICON_MAP[badge.icon] ?? "🎯"}
              </div>
              <div className="text-center">
                <div className="text-xs font-semibold text-[#0f172a] leading-tight">{badge.name}</div>
                <div
                  className="text-[10px] text-[#64748b] mt-0.5"
                  style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                >
                  {badge.nameBn}
                </div>
              </div>
              {badge.unlocked ? (
                <div
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                  style={{ background: "#ecfdf5", color: "#059669" }}
                >
                  Earned ✓
                </div>
              ) : (
                <div className="w-full">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-[#94a3b8]">Progress</span>
                    <span className="text-[#64748b] font-medium tabular-nums">
                      {badge.progress}/{badge.total}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#e2e8f0] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${Math.min((badge.progress / badge.total) * 100, 100)}%`,
                        background: "#059669",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="font-semibold text-[#0f172a] mb-4">City Leaderboard</h2>
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
          <div className="hidden md:grid grid-cols-[48px_1fr_120px_80px_80px] px-5 py-3 border-b border-[#e2e8f0] bg-[#f8fafc]">
            {["Rank", "Citizen", "District", "Points", "Badges"].map((h) => (
              <div key={h} className="text-xs font-semibold text-[#64748b] uppercase tracking-wider">
                {h}
              </div>
            ))}
          </div>
          <div className="divide-y divide-[#f1f5f9]">
            {LEADERBOARD.map((entry) => {
              const initials = entry.name
                .split(" ")
                .map((w) => w[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();
              const isCurrentUser = entry.isCurrentUser;
              return (
                <div
                  key={entry.rank}
                  className="flex md:grid md:grid-cols-[48px_1fr_120px_80px_80px] items-center px-5 py-3.5 gap-3"
                  style={{ background: isCurrentUser ? "#f0fdf4" : "transparent" }}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0">
                    {entry.rank <= 3 ? (
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{
                          background:
                            entry.rank === 1
                              ? "#fbbf24"
                              : entry.rank === 2
                              ? "#94a3b8"
                              : "#d97706",
                          color: "#fff",
                        }}
                      >
                        {entry.rank}
                      </div>
                    ) : (
                      <div className="text-sm font-semibold text-[#64748b] pl-1.5">
                        {entry.rank}
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                      style={{ background: isCurrentUser ? "#059669" : "#0f172a" }}
                    >
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium truncate">
                        {entry.name}
                        {isCurrentUser && (
                          <span
                            className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                            style={{ background: "#ecfdf5", color: "#059669" }}
                          >
                            You
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* District */}
                  <div className="hidden md:block text-sm text-[#64748b]">{entry.district}</div>

                  {/* Points */}
                  <div
                    className="text-sm font-bold tabular-nums"
                    style={{ color: isCurrentUser ? "#059669" : "#0f172a" }}
                  >
                    {entry.points.toLocaleString()}
                  </div>

                  {/* Badges */}
                  <div className="hidden md:flex items-center gap-1 text-sm text-[#64748b]">
                    <span>🎖️</span>
                    <span>{entry.badges}</span>
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
