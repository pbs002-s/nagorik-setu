import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import {
  Menu, X, ArrowRight, CheckCircle, Clock,
  MessageSquare, BarChart2, Award, Globe,
  ChevronRight, Bell, FileText, TrendingUp, Users, Shield,
} from "lucide-react";

type Status = "submitted" | "review" | "progress" | "resolved";
const STEPS: { key: Status; label: string; bn: string; time: string }[] = [
  { key: "submitted", label: "Submitted", bn: "দাখিল করা হয়েছে", time: "Mar 12, 09:14" },
  { key: "review", label: "Under Review", bn: "পর্যালোচনায়", time: "Mar 12, 14:30" },
  { key: "progress", label: "In Progress", bn: "প্রক্রিয়াধীন", time: "Mar 13, 10:05" },
  { key: "resolved", label: "Resolved", bn: "সমাধান হয়েছে", time: "Mar 15, 16:20" },
];

function useCounter(target: number, duration = 2000, active = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    const tick = (now: number) => {
      if (!start) start = now;
      const p = Math.min((now - start) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
      else setCount(target);
    };
    requestAnimationFrame(tick);
  }, [active, target, duration]);
  return count;
}

export function LandingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [status, setStatus] = useState<Status>("review");
  const [statsActive, setStatsActive] = useState(false);
  const [votedOption, setVotedOption] = useState<string | null>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const resolved = useCounter(12847, 2200, statsActive);
  const citizens = useCounter(45230, 2000, statsActive);
  const depts = useCounter(64, 1500, statsActive);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsActive(true); }, { threshold: 0.4 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, []);

  const currentStep = STEPS.findIndex((s) => s.key === status);
  const pollOptions = [
    { label: "Strongly agree", percent: votedOption ? 48 : 46 },
    { label: "Agree", percent: votedOption ? 27 : 28 },
    { label: "Neutral", percent: 13 },
    { label: "Disagree", percent: votedOption ? 12 : 13 },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      {/* NAV */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#059669] flex items-center justify-center flex-shrink-0">
              <Shield size={14} className="text-white" />
            </div>
            <div className="leading-none">
              <div className="font-bold text-base tracking-tight">OpenGovtBD</div>
              <div className="text-[10px] text-muted-foreground" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>নাগরিক সেতু</div>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How It Works", "Impact", "Polls"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate("/login")}
              className="text-sm px-4 py-2 rounded-xl border border-border hover:bg-muted transition-colors">
              Login / লগইন
            </button>
            <button onClick={() => navigate("/register")}
              className="text-sm px-4 py-2.5 rounded-xl text-white font-semibold bg-[#059669] hover:bg-[#047857] transition-colors">
              Register / নিবন্ধন
            </button>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background px-6 py-5 flex flex-col gap-4">
            {["Features", "How It Works", "Impact", "Polls"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                className="text-sm text-muted-foreground" onClick={() => setMenuOpen(false)}>{item}</a>
            ))}
            <div className="flex gap-3 pt-3 border-t border-border">
              <button onClick={() => navigate("/login")} className="flex-1 text-sm py-2.5 rounded-xl border border-border">Login</button>
              <button onClick={() => navigate("/register")} className="flex-1 text-sm py-2.5 rounded-xl text-white font-semibold bg-[#059669]">Register</button>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid md:grid-cols-[1fr_420px] gap-16 items-start">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold rounded-full px-3 py-1 mb-8 border bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
            Bangladesh&apos;s Official Civic Platform
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.05] tracking-tight mb-4" style={{ letterSpacing: "-0.02em" }}>
            Your voice,<br /><span style={{ color: "#059669" }}>accountable</span><br />governance.
          </h1>
          <p className="text-xl font-medium mb-6" style={{ fontFamily: "'Noto Sans Bengali', sans-serif", color: "#64748b" }}>
            আপনার কণ্ঠস্বর, জবাবদিহিমূলক সরকার।
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-md mb-10">
            File complaints, participate in democratic polls, and track every step of your government&apos;s response — all on one transparent platform built for the citizens of Bangladesh.
          </p>
          <div className="flex flex-wrap gap-3 mb-12">
            <button onClick={() => navigate("/register")}
              className="flex items-center gap-2 text-sm px-5 py-3 rounded-xl text-white font-semibold bg-[#059669] hover:bg-[#047857] transition-colors">
              File a Complaint <ArrowRight size={15} />
            </button>
            <button onClick={() => { document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" }); }}
              className="text-sm px-5 py-3 rounded-xl border border-border hover:bg-muted transition-colors">
              See How It Works
            </button>
          </div>
          <div className="flex items-center gap-6">
            {[{ n: "12,847", label: "Resolved" }, { n: "45,230", label: "Citizens" }, { n: "48 hrs", label: "Avg. response", green: true }].map(({ n, label, green }) => (
              <div key={label}>
                <div className="text-2xl font-extrabold tabular-nums" style={green ? { color: "#059669" } : {}}>{n}</div>
                <div className="text-xs text-muted-foreground">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive complaint tracker */}
        <div className="border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-border bg-muted flex items-center justify-between">
            <div>
              <div className="text-xs text-muted-foreground mb-0.5">Complaint #BGD-2024-0847</div>
              <div className="font-semibold text-sm">Road damage on Mirpur-10 circle</div>
            </div>
            <span className="text-xs font-medium rounded-full px-2.5 py-0.5 border bg-[#fff7ed] text-[#ea580c] border-[#fed7aa]">
              {STEPS[currentStep].label}
            </span>
          </div>
          <div className="px-5 py-5">
            {STEPS.map((step, idx) => {
              const done = idx <= currentStep;
              const active = idx === currentStep;
              return (
                <div key={step.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500"
                      style={{ background: done ? "#059669" : "#fff", borderColor: done ? "#059669" : "#e2e8f0" }}>
                      {done ? <CheckCircle size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-[#e2e8f0]" />}
                    </div>
                    {idx < STEPS.length - 1 && (
                      <div className="w-px flex-1 my-1 transition-colors duration-500"
                        style={{ background: done && idx < currentStep ? "#059669" : "#e2e8f0", minHeight: "28px" }} />
                    )}
                  </div>
                  <div className="pb-5 last:pb-0">
                    <div className="text-sm font-semibold transition-colors duration-300"
                      style={{ color: active ? "#059669" : done ? "#0f172a" : "#94a3b8" }}>
                      {step.label}
                    </div>
                    <div className="text-xs" style={{ fontFamily: "'Noto Sans Bengali', sans-serif", color: active ? "#059669" : "#94a3b8" }}>
                      {step.bn}
                    </div>
                    {done && (
                      <div className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Clock size={10} />{step.time}
                      </div>
                    )}
                    {active && <div className="text-[11px] mt-1 text-[#059669]">Officer: Abdul Karim · DCC Ward 15</div>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="px-5 pb-5">
            <div className="flex gap-2">
              <button onClick={() => { if (currentStep > 0) setStatus(STEPS[currentStep - 1].key); }}
                disabled={currentStep === 0}
                className="flex-1 text-xs py-2.5 rounded-xl border border-border hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                ← Previous
              </button>
              <button onClick={() => { if (currentStep < STEPS.length - 1) setStatus(STEPS[currentStep + 1].key); }}
                disabled={currentStep === STEPS.length - 1}
                className="flex-1 text-xs py-2.5 rounded-xl text-white font-semibold bg-[#059669] hover:bg-[#047857] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                Advance Status →
              </button>
            </div>
            <p className="text-center text-[11px] text-muted-foreground mt-2.5">Interactive demo — advance the complaint lifecycle</p>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section id="impact" ref={statsRef} className="border-y border-border bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
          {[{ count: resolved, label: "Complaints resolved", sub: "across Bangladesh" },
            { count: citizens, label: "Active citizen accounts", sub: "and growing", green: true },
            { count: depts, label: "Government departments", sub: "connected to the platform" }].map(({ count, label, sub, green }) => (
            <div key={label} className="text-center py-8 md:py-0">
              <div className="text-5xl font-extrabold mb-2 tabular-nums" style={green ? { color: "#059669" } : {}}>{count.toLocaleString()}</div>
              <div className="text-sm font-medium mb-1">{label}</div>
              <div className="text-xs text-muted-foreground">{sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <div className="text-xs font-semibold uppercase tracking-widest mb-3 text-[#059669]">The Process</div>
          <h2 className="text-3xl font-bold tracking-tight" style={{ letterSpacing: "-0.01em" }}>Simple. Transparent. Accountable.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[{ step: "01", icon: <Users size={18} />, title: "Register as a Citizen", bn: "নাগরিক হিসেবে নিবন্ধন করুন",
              desc: "Create your account with your national ID. One verified account gives you full access to all civic services." },
            { step: "02", icon: <FileText size={18} />, title: "File Your Complaint", bn: "আপনার অভিযোগ দাখিল করুন",
              desc: "Describe the issue, attach photos, and pin the exact location. Your complaint goes directly to the responsible authority." },
            { step: "03", icon: <TrendingUp size={18} />, title: "Track & Get Resolved", bn: "ট্র্যাক করুন এবং সমাধান পান",
              desc: "Receive real-time updates as officers respond. Rate the resolution and earn civic participation points." }
          ].map(({ step, icon, title, bn, desc }) => (
            <div key={step} className="p-6 border border-border rounded-2xl hover:border-[#059669]/40 hover:shadow-sm transition-all duration-300">
              <div className="flex items-start justify-between mb-5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#ecfdf5] text-[#059669]">{icon}</div>
                <span className="text-3xl font-extrabold text-[#e2e8f0]" style={{ letterSpacing: "-0.03em" }}>{step}</span>
              </div>
              <h3 className="font-semibold mb-1">{title}</h3>
              <p className="text-xs mb-3 text-[#059669]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>{bn}</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-y border-border bg-[#f8fafc]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="text-center mb-16">
            <div className="text-xs font-semibold uppercase tracking-widest mb-3 text-[#059669]">Platform Features</div>
            <h2 className="text-3xl font-bold tracking-tight" style={{ letterSpacing: "-0.01em" }}>Everything a Citizen Needs</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            {[{ icon: <MessageSquare size={18} />, title: "Complaint Filing & Tracking", bn: "অভিযোগ দাখিল ও ট্র্যাকিং",
                desc: "Submit issues with photos and location. Follow the full lifecycle from submission to resolution.", tag: "Core" },
              { icon: <BarChart2 size={18} />, title: "Democratic Polls & Voting", bn: "গণতান্ত্রিক ভোটদান",
                desc: "Participate in neighborhood and city-wide polls. See real-time anonymous results.", tag: "Civic" },
              { icon: <Award size={18} />, title: "Gamification & Rewards", bn: "পুরস্কার ও অ্যাচিভমেন্ট",
                desc: "Earn points and badges for every civic act. Climb city leaderboards.", tag: "Engagement" },
              { icon: <Globe size={18} />, title: "Full Bengali & English Support", bn: "বাংলা ও ইংরেজি দ্বিভাষিক সহায়তা",
                desc: "The entire platform works in Bengali and English — designed for Bangladesh.", tag: "Accessibility" },
              { icon: <Bell size={18} />, title: "Real-time Notifications", bn: "রিয়েল-টাইম বিজ্ঞপ্তি",
                desc: "Instant alerts when your complaint status changes, polls close, or badges are earned.", tag: "Updates" },
              { icon: <Shield size={18} />, title: "Verified & Secure", bn: "যাচাইকৃত ও নিরাপদ",
                desc: "National ID verification ensures every account is a real citizen. Role-based access.", tag: "Security" }
            ].map(({ icon, title, bn, desc, tag }) => (
              <div key={title} className="bg-white border border-border rounded-2xl p-6 hover:border-[#059669]/30 hover:shadow-sm transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#ecfdf5] text-[#059669] flex-shrink-0">{icon}</div>
                  <span className="text-xs bg-[#f1f5f9] text-[#64748b] rounded-full px-2.5 py-0.5">{tag}</span>
                </div>
                <h3 className="font-semibold mb-1 text-sm">{title}</h3>
                <p className="text-xs mb-3 text-[#059669]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>{bn}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POLLS DEMO */}
      <section id="polls" className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest mb-3 text-[#059669]">Live Polling</div>
            <h2 className="text-3xl font-bold tracking-tight mb-4" style={{ letterSpacing: "-0.01em" }}>Your opinion,<br />measured and counted.</h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Participate in active city polls on infrastructure, services, and governance. Every vote is anonymous, verified, and results are publicly reported.
            </p>
            <button onClick={() => navigate("/login")} className="flex items-center gap-1.5 text-sm font-semibold text-[#059669] group">
              Browse active polls <ChevronRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
          <div className="border border-border rounded-2xl p-6 bg-white">
            <div className="text-xs text-muted-foreground mb-1">Active Poll · Dhaka North City Corporation</div>
            <h4 className="font-semibold mb-5 text-sm leading-relaxed">Should Gulshan-2 circle be redesigned to prioritize pedestrians over private vehicles?</h4>
            <div className="space-y-3 mb-5">
              {pollOptions.map((opt) => (
                <button key={opt.label} onClick={() => setVotedOption(opt.label)} className="w-full text-left">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span style={{ color: votedOption === opt.label ? "#059669" : "#64748b", fontWeight: votedOption === opt.label ? 600 : 400 }}>
                      {opt.label}{votedOption === opt.label && " ✓"}
                    </span>
                    <span className="font-medium tabular-nums">{votedOption ? `${opt.percent}%` : "—"}</span>
                  </div>
                  <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700"
                      style={{ width: votedOption ? `${opt.percent}%` : "0%", background: votedOption === opt.label ? "#059669" : "#cbd5e1" }} />
                  </div>
                </button>
              ))}
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                <Clock size={11} />{votedOption ? "3,848 votes · Closes in 2 days" : "3,847 votes · Closes in 2 days"}
              </div>
              {!votedOption
                ? <button onClick={() => setVotedOption("Strongly agree")} className="text-xs px-3.5 py-1.5 rounded-lg text-white font-semibold bg-[#059669] hover:bg-[#047857] transition-colors">Cast Vote</button>
                : <button onClick={() => setVotedOption(null)} className="text-xs px-3.5 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors">Reset</button>
              }
            </div>
            {votedOption && <p className="text-center text-xs mt-3 text-[#059669]">Your vote has been recorded anonymously.</p>}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0f172a] text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h2 className="text-4xl font-extrabold mb-3" style={{ letterSpacing: "-0.02em" }}>Join the civic movement.</h2>
          <p className="text-xl font-medium mb-2 text-[#94a3b8]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>নাগরিক আন্দোলনে যোগ দিন।</p>
          <p className="text-sm mb-10 max-w-md mx-auto leading-relaxed text-[#94a3b8]">
            45,000+ citizens are already shaping the future of Bangladesh through OpenGovtBD. Your complaint gets heard. Your vote gets counted.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => navigate("/register")}
              className="flex items-center gap-2 text-sm px-6 py-3.5 rounded-xl text-white font-semibold bg-[#059669] hover:bg-[#047857] transition-colors">
              Register as Citizen <ArrowRight size={15} />
            </button>
            <button onClick={() => navigate("/login")}
              className="text-sm px-6 py-3.5 rounded-xl font-medium border border-white/20 text-white hover:bg-white/5 transition-colors">
              Login to Dashboard
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-[#059669] flex items-center justify-center">
              <Shield size={12} className="text-white" />
            </div>
            <div className="leading-none">
              <div className="font-bold text-sm">OpenGovtBD</div>
              <div className="text-[10px] text-muted-foreground" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>নাগরিক সেতু</div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground text-center">A civic technology initiative for the people of Bangladesh · © 2024 OpenGovtBD</p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Contact"].map((link) => (
              <a key={link} href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
