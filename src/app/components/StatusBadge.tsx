import type { ComplaintStatus } from "../data/mockData";

const STATUS_MAP: Record<
  ComplaintStatus,
  { bg: string; text: string; border: string; label: string }
> = {
  submitted: { bg: "#eff6ff", text: "#1d4ed8", border: "#bfdbfe", label: "Submitted" },
  review: { bg: "#fef3c7", text: "#d97706", border: "#fde68a", label: "Under Review" },
  progress: { bg: "#fff7ed", text: "#ea580c", border: "#fed7aa", label: "In Progress" },
  resolved: { bg: "#ecfdf5", text: "#059669", border: "#a7f3d0", label: "Resolved" },
  rejected: { bg: "#fef2f2", text: "#dc2626", border: "#fecaca", label: "Rejected" },
};

export function StatusBadge({ status }: { status: ComplaintStatus }) {
  const s = STATUS_MAP[status];
  return (
    <span
      className="text-xs font-medium rounded-full px-2.5 py-0.5 border whitespace-nowrap"
      style={{ background: s.bg, color: s.text, borderColor: s.border }}
    >
      {s.label}
    </span>
  );
}
