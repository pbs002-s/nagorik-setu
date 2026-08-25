import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Upload,
  Check,
  ArrowRight,
  ArrowLeft,
  MapPin,
  ChevronDown,
  Sparkles,
  AlertCircle,
  X,
  FileText,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { useData } from "../components/DataContext";
import { useAuth } from "../components/AuthContext";
import { UPAZILAS_BY_DISTRICT, type ComplaintPriority } from "../data/mockData";

const CATEGORIES = [
  "Roads & Infrastructure",
  "Waste Management",
  "Electricity & Lighting",
  "Water Supply",
  "Drainage & Waterlogging",
  "Environment & Noise",
  "Public Transport",
  "Parks & Recreation",
  "Government Office",
];

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

const PRIORITIES: { key: ComplaintPriority; label: string; color: string; desc: string }[] = [
  { key: "low", label: "Low", color: "#64748b", desc: "Minor aesthetic or non-urgent issue" },
  { key: "medium", label: "Medium", color: "#1d4ed8", desc: "Standard civic issue affecting neighborhood" },
  { key: "high", label: "High", color: "#d97706", desc: "Causes daily disruption to traffic or water" },
  { key: "urgent", label: "Urgent", color: "#dc2626", desc: "Immediate public safety or hazard risk" },
];

function StepIndicator({ step, total }: { step: number; total: number }) {
  const stepTitles = ["Location & Category", "Issue Details & Photos", "Review & Submit"];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2">
        {Array.from({ length: total }, (_, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold transition-all duration-300 shadow-xs"
              style={{
                background: i < step ? "#059669" : i === step ? "#059669" : "#f1f5f9",
                color: i <= step ? "#fff" : "#94a3b8",
              }}
            >
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            {i < total - 1 && (
              <div
                className="h-1 w-12 sm:w-20 rounded transition-colors duration-500"
                style={{ background: i < step ? "#059669" : "#e2e8f0" }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
        Step {step + 1}: <span className="text-emerald-600">{stepTitles[step]}</span>
      </div>
    </div>
  );
}

function SelectField({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-1.5">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full appearance-none px-4 py-3 text-sm border border-[#e2e8f0] dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-[#059669] transition-colors cursor-pointer disabled:opacity-50"
        >
          <option value="">Select {label.toLowerCase()}…</option>
          {options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none" />
      </div>
    </div>
  );
}

export function ComplaintFormPage() {
  const navigate = useNavigate();
  const { addComplaint } = useData();
  const { userName, userId } = useAuth();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    title: "",
    category: "",
    district: "",
    upazila: "",
    location: "",
    priority: "medium" as ComplaintPriority,
    description: "",
    photos: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);

  const availableUpazilas = form.district ? UPAZILAS_BY_DISTRICT[form.district] || [] : [];

  const set = (k: keyof typeof form) => (v: any) => {
    if (k === "district") {
      setForm((f) => ({ ...f, district: v, upazila: "" }));
    } else {
      setForm((f) => ({ ...f, [k]: v }));
    }
  };

  const handlePhotoAdd = () => {
    if (form.photos.length < 4) {
      const mockLabels = ["Site photo - Day", "Pothole depth overview", "Water level close-up", "Warning sign area"];
      const nextLabel = mockLabels[form.photos.length] || `Attachment #${form.photos.length + 1}`;
      setForm((f) => ({ ...f, photos: [...f.photos, nextLabel] }));
      toast.success("Photo attachment added.");
    }
  };

  const handlePhotoRemove = (index: number) => {
    setForm((f) => ({ ...f, photos: f.photos.filter((_, i) => i !== index) }));
  };

  const handleAIEnhance = () => {
    if (!form.description.trim()) {
      toast.error("Please type a brief description first, then AI can enhance it.");
      return;
    }
    const enhanced = `[MUNICIPAL REPORT]: Issue observed at ${form.location || "the designated location"}, ${form.district || "Dhaka"}.\n\nDETAILS: ${form.description.trim()}\n\nIMPACT: Severe inconvenience to resident commutes and public hygiene. Urgent inspection and allocation of maintenance contractor is requested.`;
    setForm((f) => ({
      ...f,
      description: enhanced,
      title: f.title || `${f.category || "Civic Hazard"} at ${f.location || f.district || "Area"}`,
    }));
    toast.success("Setu AI enhanced your complaint description!");
  };

  const handleSubmit = () => {
    setSubmitting(true);
    const finalTitle = form.title.trim() || `${form.category} at ${form.location || form.district}`;

    setTimeout(() => {
      const newId = addComplaint({
        title: finalTitle,
        category: form.category,
        district: form.district,
        upazila: form.upazila,
        location: form.location,
        priority: form.priority,
        description: form.description,
        photos: form.photos,
        citizenId: userId,
        citizenName: userName,
      });

      setSubmitting(false);
      navigate(`/complaints/${newId}`);
    }, 900);
  };

  const canNext = [
    form.category && form.district && form.location.trim(),
    form.description.trim().length >= 15,
    true,
  ][step];

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white">File an Official Civic Complaint</h1>
        <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          পৌর কর্তৃপক্ষ ও সিটি কর্পোরেশনে সমস্যা দাখিল করুন
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        <StepIndicator step={step} total={3} />

        {/* ════ STEP 0: Category & Location ════ */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">Location & Category Classification</h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Select the government department category and exact geographical location for fast routing.
              </p>
            </div>

            <SelectField
              label="Department Category *"
              options={CATEGORIES}
              value={form.category}
              onChange={set("category")}
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <SelectField label="District *" options={DISTRICTS} value={form.district} onChange={set("district")} />
              <SelectField
                label="Upazila / Thana"
                options={availableUpazilas}
                value={form.upazila}
                onChange={set("upazila")}
                disabled={!form.district}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-1.5">
                Specific Landmark / Street Address *
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input
                  value={form.location}
                  onChange={(e) => set("location")(e.target.value)}
                  placeholder="e.g. Mirpur-10 Roundabout, near Metro Pillar #42"
                  className="w-full pl-11 pr-4 py-3 text-sm border border-[#e2e8f0] dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-[#059669] transition-colors"
                />
              </div>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-2">
                Severity / Urgency Level
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {PRIORITIES.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => set("priority")(p.key)}
                    className="p-3 rounded-2xl border text-left transition-all"
                    style={{
                      borderColor: form.priority === p.key ? p.color : "#e2e8f0",
                      background: form.priority === p.key ? `${p.color}10` : "transparent",
                    }}
                  >
                    <div className="text-xs font-bold" style={{ color: p.color }}>
                      {p.label}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-tight line-clamp-2">{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ════ STEP 1: Title, Description & Photos ════ */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">Describe the Civic Issue</h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Provide clear specifics to assist field inspectors in scheduling equipment and work orders.
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-1.5">
                Subject / Title (Optional)
              </label>
              <input
                value={form.title}
                onChange={(e) => set("title")(e.target.value)}
                placeholder="e.g. Deep crater pothole causing vehicle breakdown"
                className="w-full px-4 py-2.5 text-sm border border-[#e2e8f0] dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-[#059669] transition-colors"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-[#64748b] uppercase tracking-widest">
                  Detailed Description *
                </label>
                <button
                  type="button"
                  onClick={handleAIEnhance}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-800 transition-colors"
                >
                  <Sparkles size={13} />
                  Enhance with Setu AI
                </button>
              </div>

              <textarea
                value={form.description}
                onChange={(e) => set("description")(e.target.value)}
                placeholder="Explain the problem in detail. How long has it persisted? How is it impacting school children, traffic, safety, or health?"
                rows={5}
                className="w-full px-4 py-3 text-sm border border-[#e2e8f0] dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 outline-none focus:border-[#059669] transition-colors resize-none leading-relaxed"
              />
              <div
                className="text-xs text-right mt-1"
                style={{ color: form.description.length >= 15 ? "#059669" : "#94a3b8" }}
              >
                {form.description.length} characters {form.description.length < 15 && "(minimum 15)"}
              </div>
            </div>

            {/* Photo Upload Section */}
            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-1.5">
                Photo Evidence Attachments (Max 4)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {form.photos.map((photo, i) => (
                  <div
                    key={i}
                    className="relative p-3 rounded-2xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-950/30 flex flex-col items-center justify-center text-center group"
                  >
                    <FileText size={22} className="text-emerald-600 mb-1" />
                    <span className="text-[11px] font-semibold text-slate-700 dark:text-slate-300 truncate w-full">
                      {photo}
                    </span>
                    <button
                      type="button"
                      onClick={() => handlePhotoRemove(i)}
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}

                {form.photos.length < 4 && (
                  <button
                    type="button"
                    onClick={handlePhotoAdd}
                    className="p-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 hover:border-emerald-500 hover:bg-emerald-50/30 text-slate-400 hover:text-emerald-600 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-semibold"
                  >
                    <Upload size={18} />
                    <span>Attach Photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ════ STEP 2: Summary Review ════ */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">Review & Confirm Submission</h2>
              <p className="text-xs text-[#64748b] mt-0.5">
                Verify all case data before dispatching to the official municipal docket.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3.5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {form.title || `${form.category} at ${form.location}`}
                </span>
                <span className="px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[10px] bg-amber-100 text-amber-800">
                  {form.priority} Priority
                </span>
              </div>

              <div className="grid sm:grid-cols-2 gap-2 text-slate-600 dark:text-slate-300">
                <div>
                  <strong className="text-slate-900 dark:text-white">Category:</strong> {form.category}
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Location:</strong> {form.location},{" "}
                  {form.upazila ? `${form.upazila}, ` : ""}
                  {form.district}
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Citizen Name:</strong> {userName}
                </div>
                <div>
                  <strong className="text-slate-900 dark:text-white">Attachments:</strong> {form.photos.length} photos
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <strong className="block text-slate-900 dark:text-white mb-1">Description:</strong>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed">
                  {form.description}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-200">
              <ShieldCheck size={18} className="flex-shrink-0" />
              <span>
                Filing this complaint awards <strong>+50 Civic Points</strong> toward your next citizen rank badge!
              </span>
            </div>
          </div>
        )}

        {/* ════ FOOTER BUTTONS ════ */}
        <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
          {step > 0 ? (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors"
            >
              <ArrowLeft size={14} /> Back
            </button>
          ) : (
            <button
              type="button"
              onClick={() => navigate("/complaints")}
              className="text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
          )}

          {step < 2 ? (
            <button
              type="button"
              disabled={!canNext}
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] disabled:opacity-40 text-white text-xs font-bold transition-all shadow-sm"
            >
              Continue <ArrowRight size={14} />
            </button>
          ) : (
            <button
              type="button"
              disabled={submitting}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#059669] hover:bg-[#047857] disabled:opacity-50 text-white text-xs font-bold transition-all shadow-md"
            >
              {submitting ? "Registering Complaint..." : "Submit Complaint 🚀"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
