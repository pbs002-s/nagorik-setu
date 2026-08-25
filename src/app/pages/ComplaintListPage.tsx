import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import {
  Search,
  FilePlus,
  ChevronRight,
  ChevronLeft,
  Inbox,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Sparkles,
} from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { useData } from "../components/DataContext";
import { type ComplaintStatus } from "../data/mockData";

const FILTERS: { label: string; value: ComplaintStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Submitted", value: "submitted" },
  { label: "Under Review", value: "review" },
  { label: "In Progress", value: "progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Rejected", value: "rejected" },
];

const PER_PAGE = 7;

export function ComplaintListPage() {
  const navigate = useNavigate();
  const { complaints } = useData();

  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ComplaintStatus | "all">("all");
  const [districtFilter, setDistrictFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest");
  const [page, setPage] = useState(0);

  const districts = useMemo(() => {
    const list = Array.from(new Set(complaints.map((c) => c.district))).filter(Boolean);
    return list;
  }, [complaints]);

  const filtered = useMemo(() => {
    let list = [...complaints];
    if (filter !== "all") list = list.filter((c) => c.status === filter);
    if (districtFilter !== "all") list = list.filter((c) => c.district === districtFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          (c.location && c.location.toLowerCase().includes(q))
      );
    }
    if (sortBy === "oldest") {
      list.reverse();
    }
    return list;
  }, [complaints, query, filter, districtFilter, sortBy]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const handleFilterChange = (v: ComplaintStatus | "all") => {
    setFilter(v);
    setPage(0);
  };

  const getStatusCount = (st: ComplaintStatus | "all") => {
    if (st === "all") return complaints.length;
    return complaints.filter((c) => c.status === st).length;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#0f172a] dark:text-white">Official Complaints Directory</h1>
          <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            আমার দাখিলকৃত ও স্থানীয় পৌর অভিযোগসমূহ ({complaints.length} মোট)
          </p>
        </div>
        <button
          onClick={() => navigate("/complaints/new")}
          className="flex items-center justify-center gap-2 text-xs px-5 py-3 rounded-2xl text-white font-bold bg-[#059669] hover:bg-[#047857] shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          <FilePlus size={16} /> File New Complaint
        </button>
      </div>

      {/* Search & Multifilters Bar */}
      <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(0);
              }}
              placeholder="Search by title, location, category, or tracking ID (e.g. BGD-2024-0847)..."
              className="w-full pl-11 pr-4 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-emerald-500 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-slate-100 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* District Selector */}
            <select
              value={districtFilter}
              onChange={(e) => {
                setDistrictFilter(e.target.value);
                setPage(0);
              }}
              className="px-3 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="all">All Districts ({districts.length})</option>
              {districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2.5 text-xs border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 outline-none cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Status Filter Chips with live count */}
        <div className="flex gap-2 flex-wrap pt-1 border-t border-slate-100 dark:border-slate-800">
          {FILTERS.map(({ label, value }) => {
            const count = getStatusCount(value);
            const isSelected = filter === value;
            return (
              <button
                key={value}
                onClick={() => handleFilterChange(value)}
                className="text-xs px-3.5 py-1.5 rounded-full border font-semibold transition-all duration-200 flex items-center gap-1.5"
                style={{
                  background: isSelected ? "#059669" : "transparent",
                  color: isSelected ? "#fff" : "#64748b",
                  borderColor: isSelected ? "#059669" : "#e2e8f0",
                }}
              >
                <span>{label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Complaints Table & Grid */}
      <div className="bg-white dark:bg-slate-900 border border-[#e2e8f0] dark:border-slate-800 rounded-3xl overflow-hidden shadow-xs">
        {paginated.length === 0 ? (
          <div className="py-20 text-center">
            <Inbox size={44} className="mx-auto text-slate-300 mb-3" />
            <div className="font-bold text-base text-slate-800 dark:text-white mb-1">No complaints found</div>
            <div className="text-xs text-slate-500 max-w-sm mx-auto">
              No complaint matches the current query or filter. You can file a new complaint to notify municipal
              authorities.
            </div>
            <button
              onClick={() => navigate("/complaints/new")}
              className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-colors"
            >
              <FilePlus size={14} /> File Complaint Now
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50">
                    {["Tracking ID", "Subject & Category", "Location", "Filed Date", "Priority", "Status", ""].map(
                      (h) => (
                        <th
                          key={h}
                          className="px-5 py-3.5 text-left text-xs font-bold text-[#64748b] uppercase tracking-wider whitespace-nowrap"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9] dark:divide-slate-800/60">
                  {paginated.map((c) => (
                    <tr
                      key={c.id}
                      className="hover:bg-emerald-50/30 dark:hover:bg-slate-800/40 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/complaints/${c.id}`)}
                    >
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-800">
                          {c.id}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-bold text-xs text-[#0f172a] dark:text-white max-w-sm truncate group-hover:text-emerald-600 transition-colors">
                          {c.title}
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{c.category}</div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        <div>{c.location}</div>
                        <div className="text-[10px] text-slate-400">
                          {c.upazila ? `${c.upazila}, ` : ""}
                          {c.district}
                        </div>
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">{c.date}</td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            c.priority === "urgent"
                              ? "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300"
                              : c.priority === "high"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300"
                              : "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                          }`}
                        >
                          {c.priority || "Normal"}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="px-5 py-4 text-right">
                        <ChevronRight
                          size={18}
                          className="text-[#94a3b8] group-hover:text-emerald-600 group-hover:translate-x-1 transition-all inline-block"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[#f1f5f9] dark:divide-slate-800">
              {paginated.map((c) => (
                <button
                  key={c.id}
                  onClick={() => navigate(`/complaints/${c.id}`)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-emerald-600 font-mono font-bold">{c.id}</span>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                        {c.priority || "normal"}
                      </span>
                    </div>
                    <div className="text-xs font-bold truncate text-slate-900 dark:text-white">{c.title}</div>
                    <div className="text-[11px] text-slate-500">
                      {c.category} • {c.district}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <StatusBadge status={c.status} />
                    <ChevronRight size={14} className="text-slate-400" />
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-[#e2e8f0] dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-[#64748b]">
                  Showing {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    disabled={page === 0}
                    onClick={() => setPage((p) => p - 1)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <span className="text-xs font-bold px-2">
                    {page + 1} / {totalPages}
                  </span>
                  <button
                    disabled={page >= totalPages - 1}
                    onClick={() => setPage((p) => p + 1)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-30 hover:bg-slate-100 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
