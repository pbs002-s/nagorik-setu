import { useState } from "react";
import { Camera, Save, Eye, EyeOff, Check } from "lucide-react";
import * as Switch from "@radix-ui/react-switch";
import { useAuth, type Role } from "../components/AuthContext";
import { toast } from "sonner";

const DISTRICTS = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Sylhet",
  "Barisal", "Mymensingh", "Rangpur", "Comilla",
];

function SectionCard({ title, titleBn, children }: {
  title: string; titleBn: string; children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-[#e2e8f0]">
        <div className="font-semibold text-sm">{title}</div>
        <div className="text-[10px] text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          {titleBn}
        </div>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function ToggleRow({ label, description, checked, onCheckedChange }: {
  label: string; description: string; checked: boolean; onCheckedChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#f1f5f9] last:border-0">
      <div>
        <div className="text-sm font-medium">{label}</div>
        <div className="text-xs text-[#64748b]">{description}</div>
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

function FormField({ label, value, onChange, type = "text" }: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors bg-white"
      />
    </div>
  );
}

export function ProfilePage() {
  const { userName, setUserName, role, setRole } = useAuth();

  const [name, setName] = useState(userName);
  const [email, setEmail] = useState("demo@opengov.bd");
  const [phone, setPhone] = useState("+880 1700-000000");
  const [nid, setNid] = useState("1234567890123");
  const [district, setDistrict] = useState("Dhaka");
  const [lang, setLang] = useState<"en" | "bn">("en");

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
    toast.success("Profile updated successfully.");
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
    toast.success("Password changed successfully.");
    setPwForm({ current: "", next: "", confirm: "" });
  };

  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold text-[#0f172a]">Profile & Settings</h1>
        <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          প্রোফাইল ও সেটিংস
        </p>
      </div>

      {/* Avatar */}
      <SectionCard title="Profile Photo" titleBn="প্রোফাইল ছবি">
        <div className="flex items-center gap-5">
          <div className="relative">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ background: "#0f172a" }}
            >
              {initials}
            </div>
            <button
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#059669] border-2 border-white flex items-center justify-center"
              title="Upload photo"
            >
              <Camera size={11} className="text-white" />
            </button>
          </div>
          <div>
            <div className="text-sm font-semibold">{name}</div>
            <div
              className="text-xs rounded-full px-2.5 py-0.5 font-semibold inline-block mt-1"
              style={{ background: role === "officer" ? "#1d4ed8" : role === "superadmin" ? "#7c3aed" : "#059669", color: "#fff" }}
            >
              {role === "officer" ? "Govt. Officer" : role === "superadmin" ? "Super Admin" : "Verified Citizen"}
            </div>
            <div className="text-xs text-[#64748b] mt-1">Member since March 2024</div>
          </div>
        </div>
      </SectionCard>

      {/* Personal info */}
      <SectionCard title="Personal Information" titleBn="ব্যক্তিগত তথ্য">
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          <FormField label="Full Name" value={name} onChange={setName} />
          <FormField label="Email Address" value={email} onChange={setEmail} type="email" />
          <FormField label="Phone Number" value={phone} onChange={setPhone} />
          <FormField label="National ID (NID)" value={nid} onChange={setNid} />
          <div>
            <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">
              District
            </label>
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors bg-white"
            >
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
          </div>
        </div>
        <button
          onClick={handleSaveProfile}
          className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl text-white font-semibold bg-[#059669] hover:bg-[#047857] transition-colors"
        >
          <Save size={14} /> Save Changes
        </button>
      </SectionCard>

      {/* Language */}
      <SectionCard title="Language" titleBn="ভাষা">
        <div className="flex gap-3">
          {([["en", "English"], ["bn", "বাংলা"]] as const).map(([value, label]) => (
            <button
              key={value}
              onClick={() => setLang(value)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200"
              style={{
                background: lang === value ? "#ecfdf5" : "#fff",
                borderColor: lang === value ? "#059669" : "#e2e8f0",
                color: lang === value ? "#059669" : "#64748b",
              }}
            >
              {lang === value && <Check size={13} />}
              {label}
            </button>
          ))}
        </div>
        <p className="text-xs text-[#94a3b8] mt-3">
          Language preference applies to the entire platform interface.
        </p>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notification Preferences" titleBn="বিজ্ঞপ্তি পছন্দ">
        <ToggleRow
          label="Email Alerts"
          description="Receive complaint updates by email"
          checked={notifs.email}
          onCheckedChange={(v) => setNotifs((n) => ({ ...n, email: v }))}
        />
        <ToggleRow
          label="SMS Alerts"
          description="Receive complaint updates by SMS"
          checked={notifs.sms}
          onCheckedChange={(v) => setNotifs((n) => ({ ...n, sms: v }))}
        />
        <ToggleRow
          label="In-App Notifications"
          description="Show notifications inside the platform"
          checked={notifs.inApp}
          onCheckedChange={(v) => setNotifs((n) => ({ ...n, inApp: v }))}
        />
        <ToggleRow
          label="Poll Reminders"
          description="Notify when new polls open in your area"
          checked={notifs.pollReminders}
          onCheckedChange={(v) => setNotifs((n) => ({ ...n, pollReminders: v }))}
        />
        <ToggleRow
          label="Badge & Achievement Alerts"
          description="Notify when you earn a new badge"
          checked={notifs.badgeAlerts}
          onCheckedChange={(v) => setNotifs((n) => ({ ...n, badgeAlerts: v }))}
        />
      </SectionCard>

      {/* Change password */}
      <SectionCard title="Change Password" titleBn="পাসওয়ার্ড পরিবর্তন">
        <div className="space-y-4 mb-5">
          {[
            { label: "Current Password", key: "current" },
            { label: "New Password", key: "next" },
            { label: "Confirm New Password", key: "confirm" },
          ].map(({ label, key }) => (
            <div key={key} className="relative">
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-wider mb-1.5">
                {label}
              </label>
              <input
                type={showPw ? "text" : "password"}
                value={pwForm[key as keyof typeof pwForm]}
                onChange={(e) =>
                  setPwForm((f) => ({ ...f, [key]: e.target.value }))
                }
                className="w-full px-4 py-2.5 pr-10 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="flex items-center gap-1.5 text-xs text-[#64748b] hover:text-[#0f172a] transition-colors"
          >
            {showPw ? <EyeOff size={12} /> : <Eye size={12} />}
            {showPw ? "Hide" : "Show"} passwords
          </button>
        </div>
        <button
          onClick={handleSavePassword}
          className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors font-medium"
        >
          <Save size={14} /> Update Password
        </button>
      </SectionCard>

      {/* Demo: role switch */}
      <SectionCard title="Demo: Switch Role" titleBn="ডেমো: ভূমিকা পরিবর্তন">
        <p className="text-sm text-[#64748b] mb-4">
          Toggle between Citizen and Admin Officer views to explore both dashboards. This is a demo feature — in production, roles are assigned by the platform administrator.
        </p>
        <div className="flex gap-2 flex-wrap">
          {([["citizen", "Citizen", "#059669"], ["officer", "Govt. Officer", "#1d4ed8"], ["superadmin", "Super Admin", "#7c3aed"]] as [Role, string, string][]).map(([value, label, color]) => (
            <button
              key={value}
              onClick={() => setRole(value)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-all duration-200"
              style={{
                background: role === value ? color : "#fff",
                borderColor: role === value ? color : "#e2e8f0",
                color: role === value ? "#fff" : "#64748b",
              }}
            >
              {role === value && <Check size={13} />}
              {label}
            </button>
          ))}
        </div>
        {role !== "citizen" && (
          <p className="text-xs text-[#059669] mt-3">
            {role === "officer" ? "Officer Workspace" : "Super Admin Panel"} is now visible in the sidebar navigation.
          </p>
        )}
      </SectionCard>
    </div>
  );
}
