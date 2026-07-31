import { useState } from "react";
import { Clock, CheckCircle } from "lucide-react";
import { type Poll } from "../data/mockData";
import { useData } from "../components/DataContext";

function PollCard({ poll, onVote }: { poll: Poll; onVote: (pollId: string, option: string) => void }) {
  const total = poll.options.reduce((s, o) => s + o.votes, 0);
  const showResults = poll.closed || poll.votedOption !== null;

  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 hover:border-[#059669]/30 hover:shadow-sm transition-all duration-300">
      <div className="flex items-start justify-between gap-4 mb-1">
        <div className="text-xs text-[#94a3b8]">{poll.area}</div>
        <span className="text-[10px] font-semibold rounded-full px-2.5 py-0.5 flex-shrink-0"
          style={{
            background: poll.closed ? "#f1f5f9" : "#ecfdf5",
            color: poll.closed ? "#64748b" : "#059669",
          }}>
          {poll.closed ? "Closed" : "Active"}
        </span>
      </div>
      <h3 className="font-semibold text-sm leading-relaxed mb-5">{poll.title}</h3>

      <div className="space-y-3 mb-5">
        {poll.options.map((opt) => {
          const pct = total > 0 ? Math.round((opt.votes / total) * 100) : 0;
          const isVoted = poll.votedOption === opt.label;
          return (
            <div key={opt.label}>
              {!showResults ? (
                <button onClick={() => onVote(poll.id, opt.label)}
                  className="w-full text-left px-4 py-2.5 rounded-xl border text-sm transition-all duration-200 hover:border-[#059669] hover:bg-[#f0fdf4]"
                  style={{ borderColor: "#e2e8f0", color: "#0f172a" }}>
                  {opt.label}
                </button>
              ) : (
                <div>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1.5" style={{ color: isVoted ? "#059669" : "#64748b", fontWeight: isVoted ? 600 : 400 }}>
                      {isVoted && <CheckCircle size={12} />}
                      {opt.label}
                    </span>
                    <span className="font-semibold tabular-nums" style={{ color: isVoted ? "#059669" : "#0f172a" }}>{pct}%</span>
                  </div>
                  <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: isVoted ? "#059669" : "#cbd5e1" }} />
                  </div>
                  <div className="text-[10px] text-[#94a3b8] mt-0.5 text-right">{opt.votes.toLocaleString()} votes</div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-[#f1f5f9]">
        <div className="text-xs text-[#94a3b8] flex items-center gap-1.5">
          <Clock size={11} />{total.toLocaleString()} votes · {poll.closesIn}
        </div>
        {poll.votedOption && <p className="text-xs font-medium text-[#059669]">Vote recorded ✓</p>}
      </div>
    </div>
  );
}

export function PollsPage() {
  const { polls, setPolls } = useData();
  const [tab, setTab] = useState<"active" | "past">("active");

  const handleVote = (pollId: string, option: string) => {
    setPolls(polls.map((p) => p.id === pollId ? {
      ...p,
      votedOption: option,
      options: p.options.map((o) => o.label === option ? { ...o, votes: o.votes + 1 } : o),
    } : p));
  };

  const active = polls.filter((p) => !p.closed);
  const past = polls.filter((p) => p.closed);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#0f172a]">Polls & Voting</h1>
        <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>গণতান্ত্রিক ভোটদান</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[#f1f5f9] p-1 rounded-xl w-fit">
        {([["active", "Active Polls"], ["past", "Past Polls"]] as const).map(([value, label]) => (
          <button key={value} onClick={() => setTab(value)}
            className="px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200"
            style={{
              background: tab === value ? "#fff" : "transparent",
              color: tab === value ? "#0f172a" : "#64748b",
              boxShadow: tab === value ? "0 1px 3px rgba(0,0,0,0.08)" : "none",
            }}>
            {label}
            <span className="ml-2 text-xs rounded-full px-1.5 py-0.5"
              style={{ background: tab === value ? "#ecfdf5" : "transparent", color: tab === value ? "#059669" : "#94a3b8" }}>
              {value === "active" ? active.length : past.length}
            </span>
          </button>
        ))}
      </div>

      {/* Polls grid */}
      <div className="grid md:grid-cols-2 gap-5">
        {tab === "active" && active.map((poll) => (
          <PollCard key={poll.id} poll={poll} onVote={handleVote} />
        ))}
        {tab === "past" && past.map((poll) => (
          <PollCard key={poll.id} poll={{ ...poll, votedOption: "—" }} onVote={() => {}} />
        ))}
      </div>

      {tab === "active" && active.length === 0 && (
        <div className="text-center py-16 text-[#94a3b8]">
          <div className="text-4xl mb-3">🗳️</div>
          <div className="font-semibold">No active polls</div>
          <div className="text-sm">Check back soon for new polls in your area.</div>
        </div>
      )}
    </div>
  );
}
