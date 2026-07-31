import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, Link, Outlet } from "react-router";
import * as Popover from "@radix-ui/react-popover";
import {
  LayoutDashboard,
  FileText,
  FilePlus,
  BarChart2,
  Trophy,
  Settings,
  Bell,
  Menu,
  Shield,
  ChevronRight,
  LogOut,
  MessageSquare,
  Lightbulb,
  Globe,
  CheckSquare,
  PlusSquare,
  Users,
  BarChart,
  ListChecks,
  Layers,
  ArrowLeft,
  Search,
  X,
  BadgeCheck,
} from "lucide-react";
import { useAuth } from "./AuthContext";
import { NOTIFICATIONS } from "../data/mockData";

type NavItem = { path: string; label: string; icon: React.ElementType };

const CITIZEN_NAV: NavItem[] = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/complaints", label: "My Complaints", icon: FileText },
  { path: "/complaints/new", label: "File Complaint", icon: FilePlus },
  { path: "/polls", label: "Polls & Voting", icon: BarChart2 },
  { path: "/discussions", label: "Discussions", icon: MessageSquare },
  { path: "/suggestions", label: "Suggestion Box", icon: Lightbulb },
  { path: "/services", label: "E-Services", icon: Globe },
  { path: "/achievements", label: "Achievements", icon: Trophy },
  { path: "/profile", label: "Profile & Settings", icon: Settings },
];

const OFFICER_NAV: NavItem[] = [
  { path: "/officer", label: "Overview", icon: LayoutDashboard },
  { path: "/officer/queue", label: "Approval Queue", icon: CheckSquare },
  { path: "/officer/add-poll", label: "Add Poll", icon: PlusSquare },
  { path: "/officer/add-service", label: "Add Service", icon: Layers },
  { path: "/officer/my-polls", label: "My Polls", icon: ListChecks },
  { path: "/profile", label: "Profile & Settings", icon: Settings },
];

const SUPERADMIN_NAV: NavItem[] = [
  { path: "/superadmin", label: "Overview", icon: BarChart },
  { path: "/superadmin/users", label: "User Management", icon: Users },
  { path: "/superadmin/content", label: "All Content", icon: ListChecks },
  { path: "/superadmin/officers", label: "Officer Management", icon: Shield },
  { path: "/profile", label: "Profile & Settings", icon: Settings },
];

const ROLE_BADGE: Record<string, { label: string; color: string }> = {
  citizen: { label: "Citizen", color: "#059669" },
  officer: { label: "Govt. Officer", color: "#1d4ed8" },
  superadmin: { label: "Super Admin", color: "#7c3aed" },
};

function isActive(path: string, pathname: string) {
  if (path === "/complaints/new") return pathname === "/complaints/new";
  if (path === "/complaints") return pathname === "/complaints" || (pathname.startsWith("/complaints/") && pathname !== "/complaints/new");
  if (path === "/officer") return pathname === "/officer";
  if (path === "/superadmin") return pathname === "/superadmin";
  return pathname.startsWith(path);
}

export function AppShell() {
  const { role, userName, userId } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");

  const unread = NOTIFICATIONS.filter((n) => !n.read).length;
  const initials = userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const navItems = role === "officer" ? OFFICER_NAV : role === "superadmin" ? SUPERADMIN_NAV : CITIZEN_NAV;
  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.citizen;

  const currentLabel = navItems.find((n) => isActive(n.path, location.pathname))?.label ?? "OpenGovtBD";

  // Every findable destination for this role — powers the Ctrl+K quick-jump and doubles
  // as "list everything so it's easy to find" for the officer/admin workspaces.
  const jumpTargets: NavItem[] = useMemo(() => [
    ...navItems,
    { path: "/notifications", label: "Notifications", icon: Bell },
  ], [navItems]);

  const filteredTargets = paletteQuery.trim()
    ? jumpTargets.filter((t) => t.label.toLowerCase().includes(paletteQuery.trim().toLowerCase()))
    : jumpTargets;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((o) => !o);
      }
      if (e.key === "Escape") setPaletteOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const goBack = () => {
    if (window.history.length > 2) navigate(-1);
    else navigate(navItems[0]?.path ?? "/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="px-5 py-5 border-b border-[#e2e8f0]">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#059669] flex items-center justify-center flex-shrink-0">
            <Shield size={16} className="text-white" />
          </div>
          <div className="leading-none">
            <div className="font-bold text-sm tracking-tight">OpenGovtBD</div>
            <div className="text-[10px] text-[#64748b]" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              নাগরিক সেতু
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = isActive(path, location.pathname);
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
              style={{
                background: active ? "#ecfdf5" : "transparent",
                color: active ? "#059669" : "#64748b",
                fontWeight: active ? 600 : 400,
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "#f8fafc"; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[#e2e8f0]">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="leading-none min-w-0">
            <div className="text-sm font-semibold truncate">{userName}</div>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              <span className="text-[10px] rounded-full px-2 py-0.5 inline-block" style={{ background: badge.color, color: "#fff" }}>
                {badge.label}
              </span>
              <span className="text-[9px] font-mono text-[#94a3b8] flex items-center gap-0.5" title="Your unique citizen ID">
                <BadgeCheck size={9} /> {userId}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs text-[#64748b] hover:text-[#dc2626] transition-colors w-full"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      <aside className="hidden md:flex flex-col w-56 bg-white border-r border-[#e2e8f0] flex-shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-56 bg-white h-full shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-white border-b border-[#e2e8f0] px-6 h-14 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 rounded-lg hover:bg-[#f8fafc] transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <button
              onClick={goBack}
              title="Go back"
              className="flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-semibold text-[#64748b] hover:text-[#0f172a] hover:bg-[#f8fafc] transition-colors flex-shrink-0"
            >
              <ArrowLeft size={15} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="w-px h-4 bg-[#e2e8f0] hidden sm:block" />
            <div className="text-sm font-semibold">{currentLabel}</div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#e2e8f0] text-xs text-[#94a3b8] hover:border-[#059669] hover:text-[#059669] transition-colors"
              title="Quick jump (Ctrl+K)"
            >
              <Search size={13} />
              <span>Quick jump…</span>
              <kbd className="text-[9px] font-mono bg-[#f1f5f9] px-1.5 py-0.5 rounded">Ctrl K</kbd>
            </button>
            <button
              onClick={() => setPaletteOpen(true)}
              className="sm:hidden p-2 rounded-lg hover:bg-[#f8fafc] transition-colors"
              title="Quick jump"
            >
              <Search size={17} className="text-[#64748b]" />
            </button>
            <Popover.Root open={notifOpen} onOpenChange={setNotifOpen}>
              <Popover.Trigger asChild>
                <button className="relative p-2 rounded-lg hover:bg-[#f8fafc] transition-colors">
                  <Bell size={18} className="text-[#64748b]" />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#dc2626] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {unread}
                    </span>
                  )}
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content align="end" sideOffset={8} className="w-80 bg-white border border-[#e2e8f0] rounded-2xl shadow-lg z-50 overflow-hidden">
                  <div className="px-4 py-3 border-b border-[#e2e8f0] flex items-center justify-between">
                    <span className="font-semibold text-sm">Notifications</span>
                    {unread > 0 && <span className="text-xs text-[#059669] font-medium">{unread} unread</span>}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {NOTIFICATIONS.slice(0, 5).map((n) => (
                      <div key={n.id} className="px-4 py-3 border-b border-[#f1f5f9] last:border-0 flex gap-3" style={{ background: n.read ? "#fff" : "#f0fdf4" }}>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold truncate">{n.title}</div>
                          <div className="text-xs text-[#64748b] mt-0.5">{n.body}</div>
                          <div className="text-[10px] text-[#94a3b8] mt-1">{n.time}</div>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-[#059669] flex-shrink-0 mt-1" />}
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-[#e2e8f0]">
                    <Link to="/notifications" onClick={() => setNotifOpen(false)} className="flex items-center justify-center gap-1 text-xs font-semibold text-[#059669] hover:underline">
                      View all notifications <ChevronRight size={12} />
                    </Link>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <Link to="/profile">
              <div className="w-8 h-8 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity">
                {initials}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {paletteOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[100] flex items-start justify-center pt-24 px-4"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-[#e2e8f0]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 px-4 py-3 border-b border-[#e2e8f0]">
              <Search size={15} className="text-[#94a3b8] flex-shrink-0" />
              <input
                autoFocus
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Jump to a page or officer function…"
                className="flex-1 text-sm outline-none"
              />
              <button onClick={() => setPaletteOpen(false)} className="p-1 rounded-lg hover:bg-[#f8fafc] flex-shrink-0">
                <X size={14} className="text-[#94a3b8]" />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              {filteredTargets.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-[#94a3b8]">No matching pages found.</div>
              ) : (
                filteredTargets.map(({ path, label, icon: Icon }) => (
                  <button
                    key={path}
                    onClick={() => { navigate(path); setPaletteOpen(false); setPaletteQuery(""); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-[#f8fafc] transition-colors"
                  >
                    <Icon size={15} className="text-[#059669] flex-shrink-0" />
                    <span className="text-[#0f172a]">{label}</span>
                    <ChevronRight size={13} className="ml-auto text-[#cbd5e1]" />
                  </button>
                ))
              )}
            </div>
            <div className="px-4 py-2 border-t border-[#e2e8f0] text-[10px] text-[#94a3b8] flex items-center justify-between">
              <span>Everything in your workspace, one search away</span>
              <span><kbd className="font-mono bg-[#f1f5f9] px-1 py-0.5 rounded">Esc</kbd> to close</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
