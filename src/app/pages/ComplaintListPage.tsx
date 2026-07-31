import { useState, useMemo } from "react";
import { useNavigate } from "react-router";
import { Search, FilePlus, ChevronRight, ChevronLeft, Inbox } from "lucide-react";
import { StatusBadge } from "../components/StatusBadge";
import { COMPLAINTS, type ComplaintStatus } from "../data/mockData";

const FILTERS: { label: string; value: ComplaintStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Submitted", value: "submitted" },
  { label: "Under Review", value: "review" },
  { label: "In Progress", value: "progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Rejected", value: "rejected" },
];

const PER_PAGE = 5;

export function ComplaintListPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ComplaintStatus | "all">("all");
  const [page, setPage] = useState(0);

  const filtered = useMemo(() => {
    let list = COMPLAINTS;
    if (filter !== "all") list = list.filter((c) => c.status === filter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.id.toLowerCase().includes(q));
    }
    return list;
  }, [query, filter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);

  const handleFilterChange = (v: ComplaintStatus | "all") => { setFilter(v); setPage(0); };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">My Complaints</h1>
          <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>আমার অভিযোগ তালিকা</p>
        </div>
        <button onClick={() => navigate("/complaints/new")}
          className="flex items-center gap-2 text-sm px-4 py-2.5 rounded-xl text-white font-semibold bg-[#059669] hover:bg-[#047857] transition-colors">
          <FilePlus size={15} /> File New Complaint
        </button>
      </div>

      {/* Search + filters */}
      <div className="space-y-3">
        <div className="relative">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
          <input value={query} onChange={(e) => { setQuery(e.target.value); setPage(0); }}
            placeholder="Search by title, category, or complaint ID…"
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-[#e2e8f0] rounded-xl outline-none focus:border-[#059669] transition-colors bg-white" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(({ label, value }) => (
            <button key={value} onClick={() => handleFilterChange(value)}
              className="text-xs px-3.5 py-1.5 rounded-full border font-medium transition-all duration-200"
              style={{
                background: filter === value ? "#059669" : "#fff",
                color: filter === value ? "#fff" : "#64748b",
                borderColor: filter === value ? "#059669" : "#e2e8f0",
              }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
        {paginated.length === 0 ? (
          <div className="py-20 text-center">
            <Inbox size={40} className="mx-auto text-[#e2e8f0] mb-4" />
            <div className="font-semibold text-[#0f172a] mb-1">No complaints found</div>
            <div className="text-sm text-[#64748b]">Try adjusting your search or filter criteria.</div>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                    {["ID", "Title", "Category", "Location", "Date", "Status", ""].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#f1f5f9]">
                  {paginated.map((c) => (
                    <tr key={c.id} className="hover:bg-[#f8fafc] transition-colors cursor-pointer" onClick={() => navigate(`/complaints/${c.id}`)}>
                      <td className="px-5 py-4">
                        <span className="text-xs font-mono text-[#64748b]">{c.id}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-medium text-[#0f172a] max-w-xs truncate">{c.title}</div>
                      </td>
                      <td className="px-5 py-4 text-[#64748b] whitespace-nowrap">{c.category}</td>
                      <td className="px-5 py-4 text-[#64748b] whitespace-nowrap">{c.district}</td>
                      <td className="px-5 py-4 text-[#64748b] whitespace-nowrap">{c.date}</td>
                      <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                      <td className="px-5 py-4">
                        <ChevronRight size={16} className="text-[#94a3b8]" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-[#f1f5f9]">
              {paginated.map((c) => (
                <button key={c.id} onClick={() => navigate(`/complaints/${c.id}`)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between hover:bg-[#f8fafc] transition-colors">
                  <div className="min-w-0 flex-1">
                    <div className="text-xs text-[#94a3b8] font-mono mb-0.5">{c.id}</div>
                    <div className="text-sm font-medium truncate">{c.title}</div>
                    <div className="text-xs text-[#64748b] mt-1">{c.category} · {c.date}</div>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <StatusBadge status={c.status} />
                    <ChevronRight size={14} className="text-[#94a3b8]" />
                  </div>
                </button>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-5 py-4 border-t border-[#e2e8f0] flex items-center justify-between">
                <span className="text-xs text-[#64748b]">
                  Showing {page * PER_PAGE + 1}–{Math.min((page + 1) * PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                    className="p-1.5 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button key={i} onClick={() => setPage(i)}
                      className="w-7 h-7 rounded-lg text-xs font-medium transition-colors"
                      style={{
                        background: i === page ? "#059669" : "#fff",
                        color: i === page ? "#fff" : "#64748b",
                        border: `1px solid ${i === page ? "#059669" : "#e2e8f0"}`,
                      }}>
                      {i + 1}
                    </button>
                  ))}
                  <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1}
                    className="p-1.5 rounded-lg border border-[#e2e8f0] hover:bg-[#f8fafc] transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronRight size={14} />
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
