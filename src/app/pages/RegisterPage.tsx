import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { Eye, EyeOff, Shield, ArrowRight, Check, ArrowLeft } from "lucide-react";
import { useAuth } from "../components/AuthContext";

function FloatingInput({ label, type = "text", value, onChange, error }: {
  label: string; type?: string; value: string; onChange: (v: string) => void; error?: string;
}) {
  const [focused, setFocused] = useState(false);
  const lifted = focused || value.length > 0;
  return (
    <div className="relative">
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className="w-full px-4 pt-5 pb-2 text-sm border rounded-xl outline-none transition-all duration-200 bg-white"
        style={{ borderColor: error ? "#dc2626" : focused ? "#059669" : "#e2e8f0",
          boxShadow: focused ? `0 0 0 3px ${error ? "#fecaca" : "#a7f3d0"}40` : "none" }} />
      <label className="absolute left-4 pointer-events-none transition-all duration-200"
        style={{ top: lifted ? "6px" : "50%", transform: lifted ? "none" : "translateY(-50%)",
          fontSize: lifted ? "10px" : "14px", fontWeight: lifted ? 500 : 400,
          color: error ? "#dc2626" : focused ? "#059669" : "#64748b" }}>
        {label}
      </label>
      {error && <p className="text-xs text-[#dc2626] mt-1 px-1">{error}</p>}
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const strength = password.length === 0 ? 0
    : password.length < 6 ? 1
    : password.length < 10 || !/\d/.test(password) ? 2
    : !/[A-Z]/.test(password) ? 3
    : 4;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#dc2626", "#d97706", "#1d4ed8", "#059669"];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{ background: i <= strength ? colors[strength] : "#e2e8f0" }} />
        ))}
      </div>
      {password.length > 0 && (
        <p className="text-xs" style={{ color: colors[strength] }}>{labels[strength]} password</p>
      )}
    </div>
  );
}

export function RegisterPage() {
  const navigate = useNavigate();
  const { setUserName, setRole, setUserId } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [nid, setNid] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [role, setRoleLocal] = useState<"citizen" | "officer">("citizen");
  const [agreed, setAgreed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Full name is required.";
    if (!email.includes("@")) e.email = "Enter a valid email address.";
    if (nid.length < 10) e.nid = "Enter a valid National ID number.";
    if (password.length < 6) e.password = "Password must be at least 6 characters.";
    if (!agreed) e.agreed = "You must agree to the terms.";
    return e;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setLoading(true);
    setUserName(name);
    setRole(role);
    setUserId(`NC-${Math.floor(100000 + Math.random() * 900000)}`);
    setTimeout(() => navigate("/dashboard"), 900);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center px-4 py-10" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#64748b] hover:text-[#0f172a] transition-colors px-2 py-1.5 -ml-2 mb-4 rounded-lg hover:bg-white"
        >
          <ArrowLeft size={14} /> Back
        </Link>
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#059669] flex items-center justify-center">
              <Shield size={18} className="text-white" />
            </div>
            <div className="leading-none text-left">
              <div className="font-bold text-lg tracking-tight text-[#0f172a]">OpenGovtBD</div>
              <div className="text-[11px] text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>নাগরিক সেতু</div>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-[#0f172a] mb-1">Create your account</h1>
          <p className="text-sm text-[#64748b]">Join 45,000+ citizens already on the platform</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-[#e2e8f0] rounded-2xl p-8 shadow-sm space-y-5">
          {/* Role toggle */}
          <div>
            <p className="text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-2">I am registering as</p>
            <div className="flex gap-2">
              {(["citizen", "officer"] as const).map((r) => (
                <button key={r} type="button" onClick={() => setRoleLocal(r)}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 flex items-center justify-center gap-2"
                  style={{
                    background: role === r ? "#ecfdf5" : "#fff",
                    borderColor: role === r ? "#059669" : "#e2e8f0",
                    color: role === r ? "#059669" : "#64748b",
                  }}>
                  {role === r && <Check size={13} />}
                  {r === "citizen" ? "Citizen / নাগরিক" : "Officer / কর্মকর্তা"}
                </button>
              ))}
            </div>
          </div>

          <FloatingInput label="Full Name" value={name} onChange={setName} error={errors.name} />
          <FloatingInput label="Email address" type="email" value={email} onChange={setEmail} error={errors.email} />
          <FloatingInput label="National ID (NID) Number" value={nid} onChange={setNid} error={errors.nid} />

          <div className="relative">
            <FloatingInput label="Password" type={showPw ? "text" : "password"} value={password} onChange={setPassword} error={errors.password} />
            <button type="button" onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-4 text-[#64748b] hover:text-[#0f172a] transition-colors">
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
            <PasswordStrength password={password} />
          </div>

          <div>
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 rounded border-[#e2e8f0] accent-[#059669]" />
              <span className="text-sm text-[#64748b]">
                I agree to the{" "}
                <a href="#" className="text-[#059669] hover:underline">Terms of Service</a>{" "}
                and{" "}
                <a href="#" className="text-[#059669] hover:underline">Privacy Policy</a>
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-[#dc2626] mt-1 px-1">{errors.agreed}</p>}
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-70 bg-[#059669] hover:bg-[#047857]">
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Creating account…
              </span>
            ) : (
              <><span>Create Account / নিবন্ধন করুন</span><ArrowRight size={15} /></>
            )}
          </button>
        </form>

        <p className="text-center text-sm text-[#64748b] mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-[#059669] font-semibold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
