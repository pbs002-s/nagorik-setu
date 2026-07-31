import { useState } from "react";
import { Search, ExternalLink, Star } from "lucide-react";
import {
  CreditCard, FileText, BookOpen, Car, Briefcase, Map,
  Receipt, Zap, Heart, GraduationCap, Shield, Download,
} from "lucide-react";
import { toast } from "sonner";
import { useData } from "../components/DataContext";
import { type ServiceCategory } from "../data/mockData";

const ICON_MAP: Record<string, React.ElementType> = {
  CreditCard, FileText, BookOpen, Car, Briefcase, Map,
  Receipt, Zap, Heart, GraduationCap, Shield, Download,
};

const CATEGORIES: ("All" | ServiceCategory)[] = [
  "All",
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
  const { services } = useData();
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | ServiceCategory>("All");

  const filtered = services.filter((s) => {
    const matchCat = activeCategory === "All" || s.category === activeCategory;
    const matchQ = !query || s.name.toLowerCase().includes(query.toLowerCase()) || s.nameBn.includes(query);
    return matchCat && matchQ;
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-[#0f172a]">E-Services Directory</h1>
        <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
          ই-সেবা নির্দেশিকা — সরকারি অনলাইন সেবাসমূহ
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
        <input
          type="text"
          placeholder="Search services by name or বাংলা…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors bg-white"
        />
      </div>

      {/* Category tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border"
            style={{
              background: activeCategory === cat ? "#059669" : "#fff",
              color: activeCategory === cat ? "#fff" : "#64748b",
              borderColor: activeCategory === cat ? "#059669" : "#e2e8f0",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Services grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-[#94a3b8]">
          <div className="text-4xl mb-3">🔍</div>
          <div className="font-semibold">No services found</div>
          <div className="text-sm">Try a different search term or category</div>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((service) => {
            const Icon = ICON_MAP[service.icon] ?? FileText;
            const catStyle = CATEGORY_COLORS[service.category] ?? { bg: "#f8fafc", color: "#64748b" };
            return (
              <div
                key={service.id}
                className="bg-white border border-[#e2e8f0] rounded-2xl p-5 flex flex-col gap-4 hover:border-[#059669] hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: catStyle.bg, color: catStyle.color }}>
                    <Icon size={18} />
                  </div>
                  {service.officerAdded && (
                    <div className="flex items-center gap-1 text-[10px] font-semibold px-2 py-1 rounded-full" style={{ background: "#fef3c7", color: "#d97706" }}>
                      <Star size={9} />
                      Officer-curated
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-sm text-[#0f172a]">{service.name}</div>
                  <div className="text-[11px] text-[#94a3b8] mb-2" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>{service.nameBn}</div>
                  <div className="text-xs text-[#64748b] leading-relaxed">{service.description}</div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: catStyle.bg, color: catStyle.color }}>
                    {service.category}
                  </span>
                  <button
                    onClick={() => {
                      toast.success(`Redirecting to ${service.name}'s official portal…`);
                      window.open(service.url, "_blank", "noopener,noreferrer");
                    }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-[#059669] hover:underline"
                  >
                    Access Service <ExternalLink size={11} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
