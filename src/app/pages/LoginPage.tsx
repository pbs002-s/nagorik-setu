import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Shield, Eye, EyeOff, Phone, Lock, ChevronRight, Check, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useAuth, type Role } from "../components/AuthContext";

type Tab = "citizen" | "officer" | "superadmin";

const TAB_CONFIG: Record<Tab, {
  label: string;
  labelBn: string;
  color: string;
  demoPhone: string;
  demoPass: string;
  route: string;
  roleName: string;
  roleId: string;
}> = {
  citizen: {
    label: "Citizen",
    labelBn: "নাগরিক",
    color: "#059669",
    demoPhone: "01700000000",
    demoPass: "citizen123",
    route: "/dashboard",
    roleName: "Demo User",
    roleId: "u10",
  },
  officer: {
    label: "Government Officer",
    labelBn: "সরকারি কর্মকর্তা",
    color: "#1d4ed8",
    demoPhone: "01800000001",
    demoPass: "officer123",
    route: "/officer",
    roleName: "Officer Nasrin",
    roleId: "u8",
  },
  superadmin: {
    label: "Super Admin",
    labelBn: "সুপার অ্যাডমিন",
    color: "#7c3aed",
    demoPhone: "01900000099",
    demoPass: "admin2024",
    route: "/superadmin",
    roleName: "Super Admin",
    roleId: "SA-001",
  },
};

export function LoginPage() {
  const navigate = useNavigate();
  const { setRole, setUserName, setUserId } = useAuth();

  const [tab, setTab] = useState<Tab>("citizen");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [otp2fa, setOtp2fa] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const cfg = TAB_CONFIG[tab];

  const fillDemo = () => {
    setPhone(cfg.demoPhone);
    setPassword(cfg.demoPass);
  };

  const handleForgotPassword = () => {
    toast.success("Reset link sent to your registered mobile number.");
  };

  const handleSendOtp = () => {
    setOtpSent(true);
    setOtpValue("123456");
    toast.success("OTP sent! Demo code: 123456");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) {
      toast.error("Please enter your mobile number and password.");
      return;
    }
    if (otp2fa && !otpSent) {
      toast.error("Please send OTP before proceeding.");
      return;
    }
    if (otp2fa && otpValue !== "123456") {
      toast.error("Invalid OTP. Demo code is 123456.");
      return;
    }
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setRole(tab as Role);
    setUserName(cfg.roleName);
    setUserId(cfg.roleId);
    toast.success(`Welcome! Signed in as ${cfg.label}.`);
    navigate(cfg.route);
  };

  return (
    <div
      className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center px-4 py-12"
      style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}
    >
      <div className="w-full max-w-md flex items-center mb-2">
        <Link
          to="/"
          className="flex items-center gap-1.5 text-xs font-semibold text-[#64748b] hover:text-[#0f172a] transition-colors px-2 py-1.5 -ml-2 rounded-lg hover:bg-white"
        >
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <Link to="/" className="flex items-center gap-2.5 mb-8">
        <div className="w-10 h-10 rounded-xl bg-[#059669] flex items-center justify-center">
          <Shield size={20} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-lg leading-none">OpenGovtBD</div>
          <div className="text-[11px] text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            নাগরিক সেতু
          </div>
        </div>
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden shadow-sm">
          {/* Role tabs */}
          <div className="flex border-b border-[#e2e8f0]">
            {(["citizen", "officer", "superadmin"] as Tab[]).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setOtpSent(false); setOtpValue(""); }}
                className="flex-1 py-3.5 text-xs font-semibold transition-all duration-200 border-b-2 -mb-px"
                style={{
                  borderBottomColor: tab === t ? TAB_CONFIG[t].color : "transparent",
                  color: tab === t ? TAB_CONFIG[t].color : "#94a3b8",
                  background: tab === t ? `${TAB_CONFIG[t].color}08` : "transparent",
                }}
              >
                <div>{TAB_CONFIG[t].label}</div>
                <div className="text-[9px] font-normal mt-0.5" style={{ fontFamily: "'Noto Sans Bengali', sans-serif", color: tab === t ? TAB_CONFIG[t].color : "#94a3b8" }}>
                  {TAB_CONFIG[t].labelBn}
                </div>
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <h2 className="text-lg font-bold text-[#0f172a]">Sign in</h2>
              <p className="text-sm text-[#64748b] mt-0.5">
                Access your{" "}
                <span style={{ color: cfg.color }} className="font-semibold">{cfg.label}</span>{" "}
                account
              </p>
            </div>

            {/* Mobile number */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">
                Mobile Number
              </label>
              <div className="flex">
                <div className="flex items-center gap-1.5 px-3 border border-r-0 border-[#e2e8f0] rounded-l-xl bg-[#f8fafc] text-sm text-[#64748b] font-medium whitespace-nowrap">
                  <Phone size={13} />
                  +880
                </div>
                <input
                  type="tel"
                  placeholder="01XXXXXXXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 11))}
                  className="flex-1 px-3 py-2.5 text-sm border border-[#e2e8f0] rounded-r-xl outline-none focus:border-[#059669] transition-colors bg-white"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type={showPw ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-10 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors bg-white"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94a3b8] hover:text-[#64748b]">
                  {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* OTP 2FA toggle */}
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <button
                type="button"
                onClick={() => { setOtp2fa(!otp2fa); setOtpSent(false); setOtpValue(""); }}
                className="w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors"
                style={{ background: otp2fa ? cfg.color : "white", borderColor: otp2fa ? cfg.color : "#e2e8f0" }}
              >
                {otp2fa && <Check size={10} className="text-white" strokeWidth={3} />}
              </button>
              <span className="text-xs text-[#64748b]">Enable OTP / 2FA verification</span>
            </label>

            {/* OTP input */}
            {otp2fa && (
              <div className="bg-[#f8fafc] border border-[#e2e8f0] rounded-xl p-4 space-y-3">
                <div className="text-xs font-semibold text-[#64748b]">One-Time Password (OTP)</div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="6-digit OTP"
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, "").slice(0, 6))}
                    className="flex-1 px-3 py-2 text-sm border border-[#e2e8f0] rounded-lg outline-none focus:border-[#059669] transition-colors bg-white tracking-widest font-mono"
                  />
                  <button type="button" onClick={handleSendOtp} className="px-4 py-2 text-xs font-semibold rounded-lg text-white transition-colors" style={{ background: cfg.color }}>
                    {otpSent ? "Resend" : "Send OTP"}
                  </button>
                </div>
                {otpSent && (
                  <div className="text-[10px] text-[#059669] flex items-center gap-1">
                    <Check size={10} strokeWidth={3} />
                    OTP sent — demo code is 123456
                  </div>
                )}
              </div>
            )}

            {/* Remember me + forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <button
                  type="button"
                  onClick={() => setRememberMe(!rememberMe)}
                  className="w-4 h-4 rounded border-2 flex items-center justify-center transition-colors"
                  style={{ background: rememberMe ? cfg.color : "white", borderColor: rememberMe ? cfg.color : "#e2e8f0" }}
                >
                  {rememberMe && <Check size={10} className="text-white" strokeWidth={3} />}
                </button>
                <span className="text-xs text-[#64748b]">Remember me</span>
              </label>
              <button type="button" onClick={handleForgotPassword} className="text-xs font-semibold hover:underline" style={{ color: cfg.color }}>
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 text-sm font-semibold text-white rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
              style={{ background: loading ? "#94a3b8" : cfg.color }}
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign in <ChevronRight size={15} /></>
              )}
            </button>

            {/* Demo access */}
            <button
              type="button"
              onClick={fillDemo}
              className="w-full py-2.5 text-sm font-medium border border-dashed border-[#e2e8f0] rounded-xl text-[#64748b] hover:bg-[#f8fafc] hover:border-[#059669] hover:text-[#059669] transition-all"
            >
              Demo Access — fill {cfg.label} credentials
            </button>
          </form>

          <div className="px-6 pb-6 border-t border-[#f1f5f9] pt-4">
            <div className="flex items-center justify-center gap-4 mb-4 flex-wrap">
              {["Role-based access", "OTP & 2FA", "Encrypted sessions"].map((item) => (
                <div key={item} className="flex items-center gap-1 text-[10px] text-[#94a3b8]">
                  <Check size={9} className="text-[#059669]" strokeWidth={3} />
                  {item}
                </div>
              ))}
            </div>
            <p className="text-xs text-center text-[#64748b]">
              {"Don't have an account? "}
              <Link to="/register" className="font-semibold text-[#059669] hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
