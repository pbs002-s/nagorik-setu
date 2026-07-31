import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { FileText, CheckCircle, Clock, TrendingUp, ChevronDown } from "lucide-react";
import { ADMIN_VOLUME, ADMIN_CATEGORIES, ADMIN_OFFICERS } from "../data/mockData";

const DISTRICTS = ["All Districts", "Dhaka", "Chittagong", "Rajshahi", "Khulna", "Sylhet"];

function KpiCard({ label, labelBn, value, sub, icon, color }: {
  label: string; labelBn: string; value: string; sub: string; icon: React.ReactNode; color: string;
}) {
  return (
    <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: `${color}18`, color }}
        >
          {icon}
        </div>
        <span className="text-xs text-[#94a3b8]">{sub}</span>
      </div>
      <div className="text-2xl font-extrabold tabular-nums" style={{ color }}>{value}</div>
      <div className="text-sm font-medium text-[#0f172a] mt-0.5">{label}</div>
      <div className="text-[10px] text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>{labelBn}</div>
    </div>
  );
}

function RatingBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${value}%`,
            background: value >= 80 ? "#059669" : value >= 60 ? "#d97706" : "#dc2626",
          }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums w-8 text-right">{value}%</span>
    </div>
  );
}

export function AdminPage() {
  const [district, setDistrict] = useState("All Districts");

  // Show last 14 days of volume for a cleaner chart
  const chartData = ADMIN_VOLUME.slice(-14);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header + filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0f172a]">Admin Analytics Dashboard</h1>
          <p className="text-sm text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            অ্যাডমিন বিশ্লেষণ প্যানেল
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <select
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              className="appearance-none text-sm pl-4 pr-8 py-2 border border-[#e2e8f0] rounded-xl bg-white outline-none focus:border-[#059669] transition-colors cursor-pointer"
            >
              {DISTRICTS.map((d) => <option key={d}>{d}</option>)}
            </select>
            <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] pointer-events-none" />
          </div>
          <select className="appearance-none text-sm pl-4 pr-8 py-2 border border-[#e2e8f0] rounded-xl bg-white outline-none focus:border-[#059669] transition-colors cursor-pointer"
            style={{ backgroundImage: "none" }}>
            {["Last 14 days", "Last 30 days", "Last 90 days"].map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard label="Total Complaints" labelBn="মোট অভিযোগ" value="450" sub="↑ 12% this month" icon={<FileText size={16} />} color="#1d4ed8" />
        <KpiCard label="Resolved" labelBn="সমাধান হয়েছে" value="318" sub="71% resolution rate" icon={<CheckCircle size={16} />} color="#059669" />
        <KpiCard label="Pending" labelBn="অপেক্ষমাণ" value="132" sub="↓ 8% vs last month" icon={<Clock size={16} />} color="#d97706" />
        <KpiCard label="Avg. Response" labelBn="গড় প্রতিক্রিয়া" value="2.4 days" sub="↑ improved by 0.3d" icon={<TrendingUp size={16} />} color="#7c3aed" />
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-[1.4fr_1fr] gap-5">
        {/* Line chart */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
          <div className="mb-5">
            <div className="font-semibold text-sm">Complaint Volume — Last 14 Days</div>
            <div className="flex items-center gap-4 mt-2">
              {[{ color: "#1d4ed8", label: "Filed" }, { color: "#059669", label: "Resolved" }].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5 text-xs text-[#64748b]">
                  <div className="w-3 h-0.5 rounded" style={{ background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }}
                cursor={{ stroke: "#e2e8f0" }}
              />
              <Line type="monotone" dataKey="complaints" stroke="#1d4ed8" strokeWidth={2} dot={false} name="Filed" />
              <Line type="monotone" dataKey="resolved" stroke="#059669" strokeWidth={2} dot={false} name="Resolved" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Bar chart */}
        <div className="bg-white border border-[#e2e8f0] rounded-2xl p-5">
          <div className="font-semibold text-sm mb-5">Complaints by Category</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={ADMIN_CATEGORIES}
              layout="vertical"
              margin={{ top: 0, right: 4, bottom: 0, left: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: "#94a3b8" }} tickLine={false} axisLine={false} />
              <YAxis
                type="category"
                dataKey="category"
                tick={{ fontSize: 10, fill: "#64748b" }}
                tickLine={false}
                axisLine={false}
                width={110}
                tickFormatter={(v: string) => v.length > 14 ? v.slice(0, 13) + "…" : v}
              />
              <Tooltip
                contentStyle={{ border: "1px solid #e2e8f0", borderRadius: 12, fontSize: 12 }}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="count" fill="#059669" radius={[0, 6, 6, 0]} name="Complaints" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Officer performance table */}
      <div className="bg-white border border-[#e2e8f0] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#e2e8f0]">
          <div className="font-semibold text-sm">Officer Performance</div>
          <div className="text-xs text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
            কর্মকর্তাদের কর্মক্ষমতা
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e2e8f0] bg-[#f8fafc]">
                {["Officer", "Department", "Assigned", "Resolved", "Avg. Days", "Rating"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-[#64748b] uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f1f5f9]">
              {ADMIN_OFFICERS.map((o) => {
                const initials = o.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
                return (
                  <tr key={o.name} className="hover:bg-[#f8fafc] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full bg-[#0f172a] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                          {initials}
                        </div>
                        <span className="font-medium">{o.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[#64748b]">{o.department}</td>
                    <td className="px-5 py-3.5 font-semibold tabular-nums">{o.assigned}</td>
                    <td className="px-5 py-3.5 font-semibold tabular-nums text-[#059669]">{o.resolved}</td>
                    <td className="px-5 py-3.5 text-[#64748b] tabular-nums">{o.avgDays}d</td>
                    <td className="px-5 py-3.5 w-40">
                      <RatingBar value={o.rating} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
