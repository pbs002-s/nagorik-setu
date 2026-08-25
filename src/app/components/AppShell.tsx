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
  Sparkles,
  UserCheck,
  Star,
} from "lucide-react";
import { useAuth, type Role } from "./AuthContext";
import { useData } from "./DataContext";
import { SetuAIAssistant } from "./SetuAIAssistant";
import { toast } from "sonner";

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
  { path: "/officer/complaints", label: "Manage Complaints", icon: FileText },
  { path: "/officer/queue", label: "Approval Queue", icon: CheckSquare },
  { path: "/officer/add-poll", label: "Add Poll", icon: PlusSquare },
  { path: "/officer/add-service", label: "Add Service", icon: Layers },
  { path: "/profile", label: "Profile & Settings", icon: Settings },
];

const SUPERADMIN_NAV: NavItem[] = [
  { path: "/superadmin", label: "Overview", icon: BarChart },
  { path: "/superadmin/users", label: "User Management", icon: Users },
  { path: "/superadmin/content", label: "All Content", icon: ListChecks },
  { path: "/superadmin/officers", label: "Officer Performance", icon: Shield },
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
  const { role, setRole, userName, userId } = useAuth();
  const { notifications, markNotificationAsRead, civicPoints } = useData();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState("");

  const unread = notifications.filter((n) => !n.read).length;
  const initials = userName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const navItems = role === "officer" ? OFFICER_NAV : role === "superadmin" ? SUPERADMIN_NAV : CITIZEN_NAV;
  const badge = ROLE_BADGE[role] ?? ROLE_BADGE.citizen;

  const currentLabel = navItems.find((n) => isActive(n.path, location.pathname))?.label ?? "Nagorik Setu";

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

  const handleRoleSwitch = (nextRole: Role) => {
    setRole(nextRole);
    if (nextRole === "officer") navigate("/officer");
    else if (nextRole === "superadmin") navigate("/superadmin");
    else navigate("/dashboard");
    toast.success(`Active role changed to ${nextRole.toUpperCase()}`);
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      <div className="px-5 py-5 border-b border-[#e2e8f0] dark:border-slate-800">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#059669] to-[#10b981] flex items-center justify-center flex-shrink-0 shadow-sm">
            <Shield size={16} className="text-white" />
          </div>
          <div className="leading-none">
            <div className="font-black text-sm tracking-tight text-slate-900 dark:text-white">OpenGovtBD</div>
            <div className="text-[10px] text-emerald-600 font-bold" style={{ fontFamily: "'Noto Sans Bengali', sans-serif" }}>
              নাগরিক সেতু
            </div>
          </div>
        </Link>
      </div>

      {/* Role Indicator Banner in Sidebar */}
      <div className="px-4 pt-3 pb-1">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <div className="text-left">
            <div className="text-[9px] font-bold text-slate-400 uppercase">Current Workspace</div>
            <div className="text-xs font-black text-slate-800 dark:text-slate-100">{badge.label}</div>
          </div>
          {role === "citizen" && (
            <div className="text-right">
              <span className="text-[10px] font-black text-emerald-600 flex items-center gap-0.5">
                <Star size={11} className="fill-emerald-500 text-emerald-500" /> {civicPoints} PTS
              </span>
            </div>
          )}
        </div>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = isActive(path, location.pathname);
          return (
            <Link
              key={path}
              to={path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all duration-200 ${
                active
                  ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900"
              }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-4 py-4 border-t border-[#e2e8f0] dark:border-slate-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {initials}
          </div>
          <div className="leading-none min-w-0">
            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{userName}</div>
            <div className="flex items-center gap-1 mt-1 flex-wrap">
              <span className="text-[9px] font-bold rounded-full px-2 py-0.5 inline-block" style={{ background: badge.color, color: "#fff" }}>
                {badge.label}
              </span>
              <span className="text-[9px] font-mono text-[#94a3b8] flex items-center gap-0.5">
                <BadgeCheck size={9} /> {userId}
              </span>
            </div>
          </div>
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-xs text-slate-500 hover:text-red-600 transition-colors w-full font-semibold"
        >
          <LogOut size={13} />
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-[#f8fafc] dark:bg-slate-950 overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif" }}>
      <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-slate-900 border-r border-[#e2e8f0] dark:border-slate-800 flex-shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-60 bg-white dark:bg-slate-900 h-full shadow-xl">
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <header className="bg-white dark:bg-slate-900 border-b border-[#e2e8f0] dark:border-slate-800 px-4 sm:px-6 h-15 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" onClick={() => setSidebarOpen(true)}>
              <Menu size={18} />
            </button>
            <button
              onClick={goBack}
              title="Go back"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-[#64748b] hover:text-[#0f172a] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            >
              <ArrowLeft size={14} />
              <span className="hidden sm:inline">Back</span>
            </button>
            <div className="w-px h-4 bg-[#e2e8f0] dark:bg-slate-800 hidden sm:block" />
            <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{currentLabel}</div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Demo Role Switcher Dropdown */}
            <div className="hidden lg:flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-[11px] font-bold">
              <span className="px-2 text-slate-400">Role:</span>
              {(["citizen", "officer", "superadmin"] as Role[]).map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleSwitch(r)}
                  className={`px-2.5 py-1 rounded-lg capitalize transition-all ${
                    role === r
                      ? "bg-white dark:bg-slate-900 text-emerald-600 shadow-xs"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  {r === "superadmin" ? "Admin" : r}
                </button>
              ))}
            </div>

            {/* Quick Jump Search */}
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-400 hover:border-emerald-500 hover:text-emerald-600 transition-colors"
              title="Quick jump (Ctrl+K)"
            >
              <Search size={13} />
              <span>Search & jump…</span>
              <kbd className="text-[9px] font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">Ctrl K</kbd>
            </button>

            {/* Notifications Popover */}
            <Popover.Root open={notifOpen} onOpenChange={setNotifOpen}>
              <Popover.Trigger asChild>
                <button className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                  <Bell size={18} className="text-slate-600 dark:text-slate-300" />
                  {unread > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-[#dc2626] text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                      {unread}
                    </span>
                  )}
                </button>
              </Popover.Trigger>
              <Popover.Portal>
                <Popover.Content align="end" sideOffset={8} className="w-80 sm:w-96 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">Recent Bulletins & Alerts</span>
                    {unread > 0 && <span className="text-xs text-emerald-600 font-bold">{unread} unread</span>}
                  </div>
                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                    {notifications.slice(0, 5).map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          markNotificationAsRead(n.id);
                          setNotifOpen(false);
                          if (n.link) navigate(n.link);
                        }}
                        className="px-4 py-3 flex gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                        style={{ background: n.read ? "transparent" : "#f0fdf4" }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-slate-900 dark:text-white truncate">{n.title}</div>
                          <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.body}</div>
                          <div className="text-[10px] text-slate-400 mt-1">{n.time}</div>
                        </div>
                        {!n.read && <div className="w-2 h-2 rounded-full bg-emerald-600 flex-shrink-0 mt-1" />}
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50">
                    <Link to="/notifications" onClick={() => setNotifOpen(false)} className="flex items-center justify-center gap-1 text-xs font-bold text-emerald-600 hover:underline">
                      View all notifications <ChevronRight size={12} />
                    </Link>
                  </div>
                </Popover.Content>
              </Popover.Portal>
            </Popover.Root>

            <Link to="/profile">
              <div className="w-8 h-8 rounded-full bg-[#0f172a] flex items-center justify-center text-white text-xs font-bold cursor-pointer hover:ring-2 hover:ring-emerald-500 transition-all">
                {initials}
              </div>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Floating Setu AI Civic Assistant */}
      <SetuAIAssistant />

      {/* Ctrl+K Quick Jump Palette */}
      {paletteOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[100] flex items-start justify-center pt-24 px-4"
          onClick={() => setPaletteOpen(false)}
        >
          <div
            className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95 duration-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-2.5 px-4 py-3.5 border-b border-slate-100 dark:border-slate-800">
              <Search size={16} className="text-slate-400 flex-shrink-0" />
              <input
                autoFocus
                value={paletteQuery}
                onChange={(e) => setPaletteQuery(e.target.value)}
                placeholder="Jump to a page, service, or civic tool…"
                className="flex-1 text-xs sm:text-sm bg-transparent outline-none text-slate-900 dark:text-white"
              />
              <button onClick={() => setPaletteOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                <X size={16} />
              </button>
            </div>
            <div className="max-h-80 overflow-y-auto py-2">
              {filteredTargets.length === 0 ? (
                <div className="px-4 py-8 text-center text-xs text-slate-400">No matching destinations found.</div>
              ) : (
                filteredTargets.map(({ path, label, icon: Icon }) => (
                  <button
                    key={path}
                    onClick={() => {
                      navigate(path);
                      setPaletteOpen(false);
                      setPaletteQuery("");
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Icon size={16} className="text-emerald-600 flex-shrink-0" />
                    <span className="font-bold text-slate-900 dark:text-white">{label}</span>
                    <ChevronRight size={14} className="ml-auto text-slate-300" />
                  </button>
                ))
              )}
            </div>
            <div className="px-4 py-2.5 border-t border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
              <span>Press <kbd className="font-mono bg-white dark:bg-slate-900 px-1 py-0.5 rounded border">Esc</kbd> to close</span>
              <span>Fast Navigation</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
