import { useState } from "react";
import { Camera, Save, Eye, EyeOff, Check, RotateCcw, Shield, Sparkles, UserCheck } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { useAuth, type Role } from "../components/AuthContext";
import { useData } from "../components/DataContext";
import { NagorikSmartCard } from "../components/NagorikSmartCard";
import { toast } from "sonner";

const DISTRICTS = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Khulna",
  "Sylhet",
  "Barisal",
  "Mymensingh",
  "Rangpur",
  "Comilla",
];

function SectionCard({
  title,
  titleBn,
  children,
}: {
  title: string;
  titleBn: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800">
        <div className="font-bold text-sm text-slate-900 dark:text-white">{title}</div>
        <div className="text-[11px] text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          {titleBn}
        </div>
      </div>
      <div className="p-6 space-y-4">{children}</div>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onCheckedChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-100 dark:border-slate-800 last:border-0">
      <div>
        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">{label}</div>
        <div className="text-[11px] text-slate-500">{description}</div>
      </div>
      <Switch.Root
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="w-10 h-6 rounded-full relative outline-none cursor-pointer transition-colors duration-200"
        style={{ background: checked ? "#059669" : "#e2e8f0" }}
      >
        <Switch.Thumb
          className="block w-4 h-4 bg-white rounded-full shadow transition-transform duration-200"
          style={{ transform: checked ? "translateX(20px)" : "translateX(4px)", marginTop: "4px" }}
        />
      </Switch.Root>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 transition-colors"
      />
    </div>
  );
}

export function ProfilePage() {
  const { userName, setUserName, role, setRole, userId, language, setLanguage } = useAuth();
  const { civicPoints, resetAllData } = useData();

  const [name, setName] = useState(userName);
  const [email, setEmail] = useState("pritam.nagorik@gov.bd");
  const [phone, setPhone] = useState("+880 1700-000000");
  const [nid, setNid] = useState("19942691234567890");
  const [district, setDistrict] = useState("Dhaka");

  const [notifs, setNotifs] = useState({
    email: true,
    sms: false,
    inApp: true,
    pollReminders: true,
    badgeAlerts: true,
  });

  const [pwForm, setPwForm] = useState({ current: "", next: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);

  const handleSaveProfile = () => {
    setUserName(name);
    toast.success("Profile details updated successfully.");
  };

  const handleSavePassword = () => {
    if (pwForm.next !== pwForm.confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (pwForm.next.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }
    toast.success("Security password updated.");
    setPwForm({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white">Profile & Civic Identity</h1>
        <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          ডিজিটাল নাগরিক পরিচয়পত্র, নিরাপত্তা ও ব্যক্তিগত সেটিংস
        </p>
      </div>

      {/* ════ DIGITAL SMART CARD FEATURE ════ */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-950 p-6 sm:p-8 rounded-3xl text-white shadow-xl space-y-6 border border-emerald-500/20">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-300">
                Official Digital Citizen Pass
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Verified
              </span>
            </div>
            <h2 className="text-lg font-bold mt-0.5">National Smart Nagorik Card (স্মার্ট পরিচয়পত্র)</h2>
          </div>
          <div className="text-xs font-mono text-emerald-400">ID: {userId}</div>
        </div>

        <NagorikSmartCard
          userName={name}
          userId={userId}
          district={district}
          points={civicPoints}
          role={role}
          nid={nid}
        />
      </div>

      {/* ════ DEMO ROLE SWITCHER & DATA RESET ════ */}
      <SectionCard title="Testing & Demo Role Switcher" titleBn="ডেমো ভূমিকা পরিবর্তন ও ডেটা রিসেট">
        <p className="text-xs text-slate-500">
          Easily test the platform from the perspective of a Citizen, Government Officer, or Super Administrator.
        </p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { r: "citizen" as Role, label: "Citizen Dashboard", color: "#059669" },
            { r: "officer" as Role, label: "Officer Workspace", color: "#1d4ed8" },
            { r: "superadmin" as Role, label: "Super Admin Panel", color: "#7c3aed" },
          ].map((item) => (
            <button
              key={item.r}
              onClick={() => {
                setRole(item.r);
                toast.success(`Role switched to ${item.label}`);
              }}
              className="p-3.5 rounded-2xl border text-center font-bold text-xs transition-all flex flex-col items-center gap-1"
              style={{
                borderColor: role === item.r ? item.color : "#e2e8f0",
                background: role === item.r ? `${item.color}15` : "transparent",
                color: role === item.r ? item.color : "#64748b",
              }}
            >
              <UserCheck size={16} />
              <span>{item.label}</span>
              {role === item.r && <span className="text-[9px] font-bold">Active Role ✓</span>}
            </button>
          ))}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-800 dark:text-slate-200">Reset Demo Data</div>
            <div className="text-[11px] text-slate-500">Restore all complaints, discussions, and polls to initial seed state</div>
          </div>
          <button
            onClick={resetAllData}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-red-50 hover:text-red-600 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <RotateCcw size={13} />
            Reset All Data
          </button>
        </div>
      </SectionCard>

      {/* ════ PERSONAL DETAILS ════ */}
      <SectionCard title="Personal Information" titleBn="ব্যক্তিগত তথ্য">
        <div className="grid sm:grid-cols-2 gap-4">
          <FormField label="Full Name" value={name} onChange={setName} />
          <FormField label="Email Address" value={email} onChange={setEmail} type="email" />
          <FormField label="Registered Mobile" value={phone} onChange={setPhone} />
          <FormField label="National ID (NID) Number" value={nid} onChange={setNid} />
        </div>

        <div>
          <label className="block text-xs font-bold text-[#64748b] uppercase tracking-wider mb-1.5">Home District</label>
          <select
            value={district}
            onChange={(e) => setDistrict(e.target.value)}
            className="w-full px-4 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 outline-none focus:border-emerald-500"
          >
            {DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSaveProfile}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] text-white text-xs font-bold transition-all shadow-sm"
          >
            <Save size={14} /> Save Profile Changes
          </button>
        </div>
      </SectionCard>

      {/* ════ NOTIFICATION PREFERENCES ════ */}
      <SectionCard title="Notifications & Alert Channels" titleBn="বিজ্ঞপ্তি ও সতর্কতা পছন্দসমূহ">
        <ToggleRow
          label="In-App Push Alerts"
          description="Instant notification on complaint progress and officer notes"
          checked={notifs.inApp}
          onCheckedChange={(v) => setNotifs((n) => ({ ...n, inApp: v }))}
        />
        <ToggleRow
          label="Email Status Updates"
          description="Weekly summary of municipal actions in your area"
          checked={notifs.email}
          onCheckedChange={(v) => setNotifs((n) => ({ ...n, email: v }))}
        />
        <ToggleRow
          label="SMS Emergency Bulletins"
          description="Critical weather & cyclone alerts on your registered phone"
          checked={notifs.sms}
          onCheckedChange={(v) => setNotifs((n) => ({ ...n, sms: v }))}
        />
      </SectionCard>

      {/* ════ PASSWORD CHANGE ════ */}
      <SectionCard title="Security & Password" titleBn="নিরাপত্তা ও পাসওয়ার্ড">
        <div className="grid sm:grid-cols-3 gap-4">
          <FormField
            label="Current Password"
            value={pwForm.current}
            onChange={(v) => setPwForm((p) => ({ ...p, current: v }))}
            type="password"
          />
          <FormField
            label="New Password"
            value={pwForm.next}
            onChange={(v) => setPwForm((p) => ({ ...p, next: v }))}
            type="password"
          />
          <FormField
            label="Confirm Password"
            value={pwForm.confirm}
            onChange={(v) => setPwForm((p) => ({ ...p, confirm: v }))}
            type="password"
          />
        </div>
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleSavePassword}
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors"
          >
            Update Password
          </button>
        </div>
      </SectionCard>
    </div>
  );
}
