import { useState } from "react";
import { Clock, CheckCircle2, BarChart3, Filter, Award, Sparkles, MapPin } from "lucide-react";
import { type Poll } from "../data/mockData";
import { useData } from "../components/DataContext";

function PollCard({ poll, onVote }: { poll: Poll; onVote: (pollId: string, option: string) => void }) {
  const total = poll.options.reduce((s, o) => s + o.votes, 0);
  const showResults = poll.closed || poll.votedOption !== null;

  return (
    <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 hover:border-emerald-500/50 hover:shadow-md transition-all duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <MapPin size={12} /> {poll.area}
          </span>
          <span
            className={`text-[10px] font-bold rounded-full px-2.5 py-0.5 ${
              poll.closed
                ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
            }`}
          >
            {poll.closed ? "Voting Concluded" : "Open for Voting"}
          </span>
        </div>

        <h3 className="font-bold text-sm text-[#0f172a] dark:text-white leading-snug mb-5">{poll.title}</h3>

        <div className="space-y-3 mb-5">
          {poll.options.map((opt) => {
            const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
            const isVoted = poll.votedOption === opt.label;
            return (
              <div key={opt.label}>
                {!showResults ? (
                  <button
                    onClick={() => onVote(poll.id, opt.label)}
                    className="w-full text-left px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 transition-all flex items-center justify-between group"
                  >
                    <span>{opt.label}</span>
                    <span className="text-[10px] font-bold text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      Vote ↗
                    </span>
                  </button>
                ) : (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-medium">
                      <span
                        className="flex items-center gap-1.5"
                        style={{ color: isVoted ? "#059669" : undefined }}
                      >
                        {isVoted && <CheckCircle2 size={13} className="text-emerald-600 flex-shrink-0" />}
                        <span className={isVoted ? "font-bold text-emerald-700 dark:text-emerald-300" : ""}>
                          {opt.label}
                        </span>
                      </span>
                      <span className="font-bold tabular-nums" style={{ color: isVoted ? "#059669" : undefined }}>
                        {pct}%
                      </span>
                    </div>
                    <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${pct}%`, background: isVoted ? "#059669" : "#94a3b8" }}
                      />
                    </div>
                    <div className="text-[10px] text-slate-400 text-right">{opt.votes.toLocaleString()} votes</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
        <div className="text-slate-400 flex items-center gap-1.5">
          <Clock size={12} />
          <span>
            {total.toLocaleString()} total ballots • {poll.closesIn}
          </span>
        </div>
        {poll.votedOption ? (
          <span className="font-bold text-emerald-600 flex items-center gap-1">
            <CheckCircle2 size={13} /> Recorded (+20 pts)
          </span>
        ) : (
          <span className="text-[11px] font-semibold text-emerald-600">+20 Civic Points</span>
        )}
      </div>
    </div>
  );
}

export function PollsPage() {
  const { polls, votePoll } = useData();
  const [tab, setTab] = useState<"active" | "past">("active");
  const [selectedArea, setSelectedArea] = useState<string>("all");

  const areas = Array.from(new Set(polls.map((p) => p.area)));

  const active = polls.filter((p) => !p.closed && (selectedArea === "all" || p.area === selectedArea));
  const past = polls.filter((p) => p.closed && (selectedArea === "all" || p.area === selectedArea));

  const handleVote = (pollId: string, option: string) => {
    votePoll(pollId, option);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white">Civic Consultation & District Polls</h1>
          <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            গণতান্ত্রিক নাগরিক ভোট ও নীতি নির্ধারণে জনমত জরিপ
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          {(
            [
              ["active", "Active Polls"],
              ["past", "Concluded Polls"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setTab(value)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                tab === value
                  ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {label}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full ${
                  tab === value ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 dark:bg-slate-700"
                }`}
              >
                {value === "active" ? active.length : past.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Filter by Area */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Filter Area:</span>
        <button
          onClick={() => setSelectedArea("all")}
          className={`px-3 py-1.5 rounded-full font-semibold border transition-all ${
            selectedArea === "all"
              ? "bg-emerald-600 text-white border-emerald-600"
              : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"
          }`}
        >
          All Bangladesh
        </button>
        {areas.map((a) => (
          <button
            key={a}
            onClick={() => setSelectedArea(a)}
            className={`px-3 py-1.5 rounded-full font-semibold border whitespace-nowrap transition-all ${
              selectedArea === a
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800"
            }`}
          >
            {a}
          </button>
        ))}
      </div>

      {/* Polls Grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {tab === "active" && active.map((poll) => <PollCard key={poll.id} poll={poll} onVote={handleVote} />)}
        {tab === "past" &&
          past.map((poll) => (
            <PollCard key={poll.id} poll={{ ...poll, closed: true, votedOption: "—" }} onVote={() => {}} />
          ))}
      </div>

      {tab === "active" && active.length === 0 && (
        <div className="text-center py-20 text-[#94a3b8] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
          <div className="text-4xl mb-3">🗳️</div>
          <div className="font-bold text-base text-slate-800 dark:text-white">No active polls in this district</div>
          <div className="text-xs text-slate-500 mt-1">Check back soon when municipal officers launch new civic consultations.</div>
        </div>
      )}
    </div>
  );
}
