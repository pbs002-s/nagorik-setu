import { useState } from "react";
import {
  Search,
  ExternalLink,
  Star,
  Calculator,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Landmark,
  FileCheck2,
  Bookmark,
  BookmarkCheck,
  CreditCard,
  FileText,
  BookOpen,
  Car,
  Briefcase,
  Map,
  Receipt,
  Zap,
  Heart,
  GraduationCap,
  Shield,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import { useData } from "../components/DataContext";
import { PASSPORT_FEES, NID_FEES, type ServiceCategory, type Service } from "../data/mockData";

const ICON_MAP: Record<string, React.ElementType> = {
  CreditCard,
  FileText,
  BookOpen,
  Car,
  Briefcase,
  Map,
  Receipt,
  Zap,
  Heart,
  GraduationCap,
  Shield,
  Download,
};

const CATEGORIES: ("All" | "Bookmarked" | ServiceCategory)[] = [
  "All",
  "Bookmarked",
  "Identity & Civil Status",
  "Business & Licensing",
  "Financial & Property",
  "Public Services",
];

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  "Identity & Civil Status": { bg: "#eff6ff", color: "#1d4ed8" },
  "Business & Licensing": { bg: "#fef3c7", color: "#d97706" },
  "Financial & Property": { bg: "#ecfdf5", color: "#059669" },
  "Public Services": { bg: "#f5f3ff", color: "#7c3aed" },
};

export function ServicesPage() {
  const { services, favoriteServiceIds, toggleFavoriteService } = useData();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | "Bookmarked" | ServiceCategory>("All");
  const [activeTab, setActiveTab] = useState<"directory" | "calculators" | "checklist">("directory");

  // Passport Calculator State
  const [passportPages, setPassportPages] = useState<"pages48" | "pages64">("pages48");
  const [passportYears, setPassportYears] = useState<"years5" | "years10">("years10");
  const [passportSpeed, setPassportSpeed] = useState<"regular" | "express" | "superExpress">("regular");

  // NID Calculator State
  const [nidType, setNidType] = useState<keyof typeof NID_FEES>("correctionNormal");

  // Document Checklist State
  const [selectedChecklist, setSelectedChecklist] = useState<"passport" | "nid" | "mutation">("passport");
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});

  const passportCost = PASSPORT_FEES[passportPages][passportYears][passportSpeed];
  const nidCost = NID_FEES[nidType];

  const filtered = services.filter((s) => {
    if (activeCategory === "Bookmarked") {
      return favoriteServiceIds.has(s.id);
    }
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchQ = !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.nameBn.includes(query);
    return matchCat && matchQ;
  });

  const toggleDoc = (key: string) => {
    setCheckedDocs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const CHECKLIST_DATA = {
    passport: [
      { key: "p1", text: "Printed Online Application Summary with barcode" },
      { key: "p2", text: "Original National ID (NID) Card or Digital Birth Certificate (BDRIS 17-digit)" },
      { key: "p3", text: "Bank payment deposit receipt / A-Challan payment slip" },
      { key: "p4", text: "Previous original passport (if applying for renewal or reissue)" },
      { key: "p5", text: "GO/NOC (Government Order) if applicant is a public employee" },
    ],
    nid: [
      { key: "n1", text: "Educational Certificate (SSC / HSC / Degree Certificate) copy" },
      { key: "n2", text: "Digital 17-digit Birth Certificate online verified printout" },
      { key: "n3", text: "Citizenship Certificate from Mayor / Ward Councilor / Union Parishad Chairman" },
      { key: "n4", text: "Utility Bill (Electricity/Water/Gas) copy matching resident address" },
    ],
    mutation: [
      { key: "m1", text: "Original Registered Land Purchase Deed (মূল সাফ কবলা দলিল)" },
      { key: "m2", text: "Previous Khatian / CS, SA, RS, BS records lineage" },
      { key: "m3", text: "Up-to-date Land Development Tax Receipt (ভূমি উন্নয়ন কর দাখিলা)" },
      { key: "m4", text: "Applicant's NID and recent passport photograph" },
    ],
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white">National E-Services Portal</h1>
          <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            নাগরিক ই-সেবা নির্দেশিকা, সরকারি ফি ক্যালকুলেটর ও কাগজপত্র যাচাই
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("directory")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === "directory"
                ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            Services ({services.length})
          </button>
          <button
            onClick={() => setActiveTab("calculators")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "calculators"
                ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <Calculator size={13} /> Fee Calculators
          </button>
          <button
            onClick={() => setActiveTab("checklist")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "checklist"
                ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-sm"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            <CheckSquare size={13} /> Document Checklist
          </button>
        </div>
      </div>

      {/* ════ VIEW 1: SERVICES DIRECTORY ════ */}
      {activeTab === "directory" && (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input
              type="text"
              placeholder="Search government services by name (e.g. NID, Passport, Land, Tax, ট্রেড লাইসেন্স)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 text-xs sm:text-sm border border-[#e2e8f0] dark:border-slate-800 rounded-2xl outline-none focus:border-[#059669] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-xs transition-colors"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2 flex-wrap">
            {CATEGORIES.map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border flex items-center gap-1.5"
                  style={{
                    background: isSelected ? "#059669" : "transparent",
                    color: isSelected ? "#fff" : "#64748b",
                    borderColor: isSelected ? "#059669" : "#e2e8f0",
                  }}
                >
                  {cat === "Bookmarked" && <Star size={12} className={isSelected ? "fill-white" : "fill-amber-400 text-amber-400"} />}
                  <span>{cat}</span>
                </button>
              );
            })}
          </div>

          {/* Services Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-[#94a3b8] bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800">
              <div className="text-4xl mb-3">🔍</div>
              <div className="font-bold text-base text-slate-800 dark:text-slate-200">No matching services found</div>
              <div className="text-xs text-slate-500 mt-1">Try searching for NID, Passport, Birth certificate, or Land.</div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((service) => {
                const Icon = ICON_MAP[service.icon] ?? FileText;
                const catStyle = CATEGORY_COLORS[service.category] ?? { bg: "#f8fafc", color: "#64748b" };
                const isFav = favoriteServiceIds.has(service.id);

                return (
                  <div
                    key={service.id}
                    className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-5 flex flex-col justify-between hover:border-emerald-500/60 hover:shadow-md transition-all duration-200 group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div
                          className="w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xs group-hover:scale-110 transition-transform"
                          style={{ background: catStyle.bg, color: catStyle.color }}
                        >
                          <Icon size={20} />
                        </div>

                        <div className="flex items-center gap-1.5">
                          {service.officerAdded && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                              Officer-curated
                            </span>
                          )}
                          <button
                            onClick={() => toggleFavoriteService(service.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title={isFav ? "Remove bookmark" : "Bookmark service"}
                          >
                            <Star size={16} className={isFav ? "fill-amber-400 text-amber-400" : ""} />
                          </button>
                        </div>
                      </div>

                      <div className="font-bold text-sm text-[#0f172a] dark:text-white group-hover:text-emerald-600 transition-colors">
                        {service.name}
                      </div>
                      <div
                        className="text-[11px] text-[#059669] font-medium mb-2"
                        style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}
                      >
                        {service.nameBn}
                      </div>
                      <p className="text-xs text-[#64748b] dark:text-slate-400 leading-relaxed line-clamp-3 mb-4">
                        {service.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                      <span
                        className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                        style={{ background: catStyle.bg, color: catStyle.color }}
                      >
                        {service.category}
                      </span>
                      <button
                        onClick={() => {
                          toast.success(`Opening ${service.name} portal...`);
                          window.open(service.url, "_blank", "noopener,noreferrer");
                        }}
                        className="flex items-center gap-1.5 text-xs font-bold text-[#059669] hover:text-[#047857] hover:underline"
                      >
                        Launch Portal <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ════ VIEW 2: INTERACTIVE CALCULATORS ════ */}
      {activeTab === "calculators" && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* E-Passport Fee Calculator */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <BookOpen size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">e-Passport Fee Estimator</h3>
                <div className="text-xs text-slate-500" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  ই-পাসপোর্ট সরকারি ফি হিসাব করুন
                </div>
              </div>
            </div>

            {/* Passport Options */}
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Booklet Pages</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPassportPages("pages48")}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      passportPages === "pages48"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    48 Pages (৪৮ পৃষ্ঠা)
                  </button>
                  <button
                    onClick={() => setPassportPages("pages64")}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      passportPages === "pages64"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    64 Pages (৬৪ পৃষ্ঠা)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Validity Period</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setPassportYears("years5")}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      passportYears === "years5"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    5 Years (৫ বছর)
                  </button>
                  <button
                    onClick={() => setPassportYears("years10")}
                    className={`py-2 px-3 rounded-xl font-bold border transition-all ${
                      passportYears === "years10"
                        ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    10 Years (১০ বছর)
                  </button>
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Delivery Velocity</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { key: "regular", label: "Regular (15-21d)" },
                    { key: "express", label: "Express (7-10d)" },
                    { key: "superExpress", label: "Super Express (2d)" },
                  ].map((s) => (
                    <button
                      key={s.key}
                      onClick={() => setPassportSpeed(s.key as any)}
                      className={`py-2 px-2 rounded-xl text-[11px] font-bold border transition-all ${
                        passportSpeed === s.key
                          ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Passport Calculated Result Box */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-slate-900 dark:text-slate-100 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300">
                  Total Govt Fee (Incl. 15% VAT)
                </div>
                <div className="text-2xl font-black text-emerald-800 dark:text-emerald-200">
                  ৳{passportCost.toLocaleString()} BDT
                </div>
              </div>
              <button
                onClick={() => window.open("https://www.epassport.gov.bd/", "_blank")}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
              >
                Apply Online ↗
              </button>
            </div>
          </div>

          {/* NID Correction & Reissue Fee Calculator */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-xs space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
                <CreditCard size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base text-slate-900 dark:text-white">NID Fee & Reissue Calculator</h3>
                <div className="text-xs text-slate-500" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                  জাতীয় পরিচয়পত্র সংশোধন ও রি-ইস্যু ফি
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Select NID Service Type</label>
              {[
                { key: "correctionNormal", label: "Information Correction (Regular)", cost: 230 },
                { key: "correctionUrgent", label: "Information Correction (Urgent)", cost: 345 },
                { key: "reissueNormal", label: "Damaged Card Reissue (Regular)", cost: 230 },
                { key: "reissueUrgent", label: "Damaged Card Reissue (Urgent)", cost: 345 },
                { key: "reissueLost", label: "Lost NID Card Reissue (With GD)", cost: 575 },
              ].map((item) => (
                <button
                  key={item.key}
                  onClick={() => setNidType(item.key as any)}
                  className={`w-full p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    nidType === item.key
                      ? "border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-950/40 dark:text-blue-200 font-bold"
                      : "border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <span>{item.label}</span>
                  <span className="font-mono font-bold">৳{item.cost}</span>
                </button>
              ))}
            </div>

            {/* NID Result Box */}
            <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-blue-700 dark:text-blue-300">Total Payable Fee</div>
                <div className="text-2xl font-black text-blue-900 dark:text-blue-200">৳{nidCost} BDT</div>
              </div>
              <button
                onClick={() => window.open("https://services.nidw.gov.bd/", "_blank")}
                className="px-3.5 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
              >
                NID Portal ↗
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ════ VIEW 3: DOCUMENT CHECKLIST ════ */}
      {activeTab === "checklist" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Official Document Readiness Checklist
              </h3>
              <div className="text-xs text-slate-500" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
                সরকারি অফিসে যাওয়ার পূর্বে প্রয়োজনীয় কাগজপত্র ঠিক আছে কি না নিশ্চিত করুন
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setSelectedChecklist("passport")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedChecklist === "passport" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                e-Passport
              </button>
              <button
                onClick={() => setSelectedChecklist("nid")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedChecklist === "nid" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                NID Card
              </button>
              <button
                onClick={() => setSelectedChecklist("mutation")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedChecklist === "mutation" ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600"
                }`}
              >
                Land Mutation (নামজারি)
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {CHECKLIST_DATA[selectedChecklist].map((doc) => {
              const isChecked = !!checkedDocs[doc.key];
              return (
                <div
                  key={doc.key}
                  onClick={() => toggleDoc(doc.key)}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center gap-3.5 transition-all select-none ${
                    isChecked
                      ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-100"
                      : "bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <div
                    className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                      isChecked ? "bg-emerald-600 text-white" : "border-2 border-slate-300 dark:border-slate-600"
                    }`}
                  >
                    {isChecked && <CheckSquare size={16} />}
                  </div>
                  <span className={`text-xs font-medium ${isChecked ? "line-through opacity-80" : ""}`}>
                    {doc.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
