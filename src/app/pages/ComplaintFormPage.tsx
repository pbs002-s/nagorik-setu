import { useState } from "react";
import { useNavigate } from "react-router";
import { Upload, Check, ArrowRight, ArrowLeft, MapPin, ChevronDown } from "lucide-react";
import { toast } from "sonner";

const CATEGORIES = [
  "Roads & Infrastructure", "Waste Management", "Electricity & Lighting",
  "Water Supply", "Drainage & Waterlogging", "Environment & Noise",
  "Public Transport", "Parks & Recreation", "Government Office",
];

const DISTRICTS = [
  "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Sylhet",
  "Barisal", "Mymensingh", "Rangpur", "Comilla",
];

function StepIndicator({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }, (_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition-all duration-300"
            style={{
              background: i < step ? "#059669" : i === step ? "#059669" : "#f1f5f9",
              color: i <= step ? "#fff" : "#94a3b8",
            }}>
            {i < step ? <Check size={12} /> : i + 1}
          </div>
          {i < total - 1 && (
            <div className="h-0.5 w-12 rounded transition-colors duration-500"
              style={{ background: i < step ? "#059669" : "#e2e8f0" }} />
          )}
        </div>
      ))}
      <div className="ml-3 text-xs text-[#64748b]">Step {step + 1} of {total}</div>
    </div>
  );
}

function SelectField({ label, options, value, onChange }: {
  label: string; options: string[]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="relative">
      <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-2">{label}</label>
      <div className="relative">
        <select value={value} onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none px-4 py-3 text-sm border border-[#e2e8f0] rounded-xl bg-white outline-none focus:border-[#059669] transition-colors cursor-pointer"
          style={{ boxShadow: "none" }}>
          <option value="">Select {label.toLowerCase()}…</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none" />
      </div>
    </div>
  );
}

export function ComplaintFormPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    category: "", district: "", location: "",
    description: "", photos: [] as string[],
  });
  const [submitting, setSubmitting] = useState(false);
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handlePhotoAdd = () => {
    if (form.photos.length < 4) {
      setForm((f) => ({ ...f, photos: [...f.photos, `photo-${Date.now()}`] }));
    }
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setTimeout(() => {
      toast.success("Complaint submitted successfully!", {
        description: "Reference: BGD-2024-" + Math.floor(Math.random() * 1000 + 800),
      });
      navigate("/complaints");
    }, 1200);
  };

  const canNext = [
    form.category && form.district && form.location,
    form.description.length >= 20,
    true,
  ][step];

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0f172a]">File a Complaint</h1>
        <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>অভিযোগ দাখিল করুন</p>
      </div>

      <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 shadow-sm">
        <StepIndicator step={step} total={3} />

        {/* Step 0: Category & Location */}
        {step === 0 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-semibold mb-1">Category & Location</h2>
              <p className="text-xs text-[#64748b] mb-5">Select what type of issue you are reporting and where it is.</p>
            </div>
            <SelectField label="Category" options={CATEGORIES} value={form.category} onChange={set("category")} />
            <SelectField label="District" options={DISTRICTS} value={form.district} onChange={set("district")} />
            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-2">Specific Location</label>
              <div className="relative">
                <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" />
                <input value={form.location} onChange={(e) => set("location")(e.target.value)}
                  placeholder="e.g. Mirpur-10 Roundabout, near the metro station"
                  className="w-full pl-10 pr-4 py-3 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors" />
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Description & Photos */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-semibold mb-1">Describe the Issue</h2>
              <p className="text-xs text-[#64748b] mb-5">Provide as much detail as possible to help the officer understand and resolve it quickly.</p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-2">Description</label>
              <textarea value={form.description} onChange={(e) => set("description")(e.target.value)}
                placeholder="Describe the issue in detail. What is it? How long has it been there? What impact is it having on the community?"
                rows={5}
                className="w-full px-4 py-3 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors resize-none" />
              <div className="text-xs text-right mt-1" style={{ color: form.description.length >= 20 ? "#059669" : "#94a3b8" }}>
                {form.description.length} characters {form.description.length < 20 && "(minimum 20)"}
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#64748b] uppercase tracking-widest mb-2">
                Photos <span className="text-[#94a3b8] font-normal normal-case">(optional, max 4)</span>
              </label>
              <div className="grid grid-cols-4 gap-3">
                {form.photos.map((p, i) => (
                  <div key={p} className="aspect-square rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] flex flex-col items-center justify-center text-[#059669] text-xs font-medium">
                    <div className="text-2xl mb-1">🖼️</div>
                    <span>Photo {i + 1}</span>
                  </div>
                ))}
                {form.photos.length < 4 && (
                  <button type="button" onClick={handlePhotoAdd}
                    className="aspect-square rounded-xl border-2 border-dashed border-[#e2e8f0] flex flex-col items-center justify-center gap-1 hover:border-[#059669] hover:bg-[#f0fdf4] transition-all group">
                    <Upload size={18} className="text-[#94a3b8] group-hover:text-[#059669] transition-colors" />
                    <span className="text-xs text-[#94a3b8] group-hover:text-[#059669] transition-colors">Add photo</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Review */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-semibold mb-1">Review & Submit</h2>
              <p className="text-xs text-[#64748b] mb-5">Please verify your complaint details before submitting.</p>
            </div>
            <div className="border border-[#e2e8f0] rounded-xl overflow-hidden divide-y divide-[#f1f5f9]">
              {[["Category", form.category], ["District", form.district], ["Location", form.location]].map(([k, v]) => (
                <div key={k} className="px-4 py-3 flex justify-between text-sm">
                  <span className="text-[#64748b]">{k}</span>
                  <span className="font-medium text-right max-w-xs">{v}</span>
                </div>
              ))}
              <div className="px-4 py-3 text-sm">
                <div className="text-[#64748b] mb-1">Description</div>
                <div className="text-[#0f172a] leading-relaxed">{form.description}</div>
              </div>
              {form.photos.length > 0 && (
                <div className="px-4 py-3 text-sm">
                  <span className="text-[#64748b]">Photos</span>
                  <span className="font-medium ml-4">{form.photos.length} attached</span>
                </div>
              )}
            </div>
            <div className="bg-[#f0fdf4] border border-[#a7f3d0] rounded-xl px-4 py-3 text-xs text-[#059669] leading-relaxed">
              By submitting, your complaint will be assigned to the relevant authority. You will receive updates via notifications and can track progress on your dashboard.
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-[#f1f5f9]">
          <button onClick={() => step > 0 ? setStep((s) => s - 1) : navigate("/complaints")}
            className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors text-[#64748b]">
            <ArrowLeft size={15} />{step === 0 ? "Cancel" : "Back"}
          </button>
          {step < 2 ? (
            <button onClick={() => setStep((s) => s + 1)} disabled={!canNext}
              className="flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl text-white font-semibold bg-[#059669] hover:bg-[#047857] transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
              Continue <ArrowRight size={15} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center gap-2 text-sm px-6 py-2.5 rounded-xl text-white font-semibold bg-[#059669] hover:bg-[#047857] transition-colors disabled:opacity-70">
              {submitting ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Submitting…</>
              ) : (
                <>Submit Complaint <ArrowRight size={15} /></>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
