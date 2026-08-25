import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import {
  COMPLAINTS, DISCUSSIONS, SUGGESTIONS, POLLS, SERVICES, DISCUSSION_COMMENTS,
  ANNOUNCEMENTS, NOTIFICATIONS, MANAGED_USERS, AUDIT_LOGS,
  type Complaint, type Discussion, type Suggestion, type Poll, type Service,
  type DiscussionComment, type Announcement, type Notification, type ManagedUser,
  type AuditLog, type ComplaintStatus, type SuggestionStatus, type Comment,
} from "../data/mockData";
import { toast } from "sonner";
import confetti from "canvas-confetti";

interface DataCtx {
  // Complaints
  complaints: Complaint[];
  addComplaint: (c: Omit<Complaint, "id" | "date" | "timeline" | "officerNotes" | "comments">) => string;
  updateComplaintStatus: (id: string, status: ComplaintStatus, officerName?: string, note?: string) => void;
  addOfficerNote: (id: string, officer: string, note: string) => void;
  addComplaintComment: (complaintId: string, author: string, role: "citizen" | "officer", text: string) => void;

  // Discussions
  discussions: Discussion[];
  addDiscussion: (d: Omit<Discussion, "id" | "likes" | "comments" | "createdAt" | "status" | "pinned">) => string;
  approveDiscussion: (id: string) => void;
  rejectDiscussion: (id: string) => void;
  toggleDiscussionLike: (discussionId: string) => void;
  likedDiscussionIds: Set<string>;

  // Comments
  discussionComments: DiscussionComment[];
  addDiscussionComment: (discussionId: string, author: string, authorId: string, body: string) => void;

  // Suggestions
  suggestions: Suggestion[];
  addSuggestion: (s: Omit<Suggestion, "id" | "upvotes" | "downvotes" | "status" | "createdAt">) => string;
  voteSuggestion: (id: string, dir: "up" | "down") => void;
  updateSuggestionStatus: (id: string, status: SuggestionStatus) => void;
  votedSuggestionIds: Record<string, "up" | "down">;

  // Polls
  polls: Poll[];
  addPoll: (p: Omit<Poll, "id" | "totalVotes" | "closed" | "votedOption">) => string;
  votePoll: (pollId: string, optionLabel: string) => void;

  // Services
  services: Service[];
  addService: (s: Omit<Service, "id" | "officerAdded">) => string;
  favoriteServiceIds: Set<string>;
  toggleFavoriteService: (id: string) => void;

  // Announcements
  announcements: Announcement[];
  addAnnouncement: (a: Omit<Announcement, "id" | "date">) => string;
  deleteAnnouncement: (id: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (n: Omit<Notification, "id" | "time" | "read">) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Users & Gamification
  users: ManagedUser[];
  updateUserStatus: (id: string, status: ManagedUser["status"]) => void;
  civicPoints: number;
  awardCivicPoints: (points: number, reason?: string) => void;

  // Audit Logs
  auditLogs: AuditLog[];
  addAuditLog: (action: string, actor: string, role: string, details: string, status?: AuditLog["status"]) => void;

  // Reset
  resetAllData: () => void;
}

const STORAGE_PREFIX = "nagorik_setu_v2_";

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? (JSON.parse(item) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (err) {
    console.error("Failed to save to localStorage:", err);
  }
}

const Ctx = createContext<DataCtx | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  // State definitions with initial load from localStorage
  const [complaints, setComplaints] = useState<Complaint[]>(() => loadStorage("complaints", COMPLAINTS));
  const [discussions, setDiscussions] = useState<Discussion[]>(() => loadStorage("discussions", DISCUSSIONS));
  const [discussionComments, setDiscussionComments] = useState<DiscussionComment[]>(() => loadStorage("discussion_comments", DISCUSSION_COMMENTS));
  const [suggestions, setSuggestions] = useState<Suggestion[]>(() => loadStorage("suggestions", SUGGESTIONS));
  const [polls, setPolls] = useState<Poll[]>(() => loadStorage("polls", POLLS));
  const [services, setServices] = useState<Service[]>(() => loadStorage("services", SERVICES));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => loadStorage("announcements", ANNOUNCEMENTS));
  const [notifications, setNotifications] = useState<Notification[]>(() => loadStorage("notifications", NOTIFICATIONS));
  const [users, setUsers] = useState<ManagedUser[]>(() => loadStorage("users", MANAGED_USERS));
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => loadStorage("audit_logs", AUDIT_LOGS));
  const [civicPoints, setCivicPoints] = useState<number>(() => loadStorage("civic_points", 1240));

  const [likedDiscussionIdsArray, setLikedDiscussionIdsArray] = useState<string[]>(() => loadStorage("liked_discussions", ["d1"]));
  const [favoriteServiceIdsArray, setFavoriteServiceIdsArray] = useState<string[]>(() => loadStorage("fav_services", ["s1", "s3", "s7"]));
  const [votedSuggestionIds, setVotedSuggestionIds] = useState<Record<string, "up" | "down">>(() => loadStorage("voted_suggestions", { sg1: "up" }));

  // Auto-sync state changes to localStorage
  useEffect(() => saveStorage("complaints", complaints), [complaints]);
  useEffect(() => saveStorage("discussions", discussions), [discussions]);
  useEffect(() => saveStorage("discussion_comments", discussionComments), [discussionComments]);
  useEffect(() => saveStorage("suggestions", suggestions), [suggestions]);
  useEffect(() => saveStorage("polls", polls), [polls]);
  useEffect(() => saveStorage("services", services), [services]);
  useEffect(() => saveStorage("announcements", announcements), [announcements]);
  useEffect(() => saveStorage("notifications", notifications), [notifications]);
  useEffect(() => saveStorage("users", users), [users]);
  useEffect(() => saveStorage("audit_logs", auditLogs), [auditLogs]);
  useEffect(() => saveStorage("civic_points", civicPoints), [civicPoints]);
  useEffect(() => saveStorage("liked_discussions", likedDiscussionIdsArray), [likedDiscussionIdsArray]);
  useEffect(() => saveStorage("fav_services", favoriteServiceIdsArray), [favoriteServiceIdsArray]);
  useEffect(() => saveStorage("voted_suggestions", votedSuggestionIds), [votedSuggestionIds]);

  const likedDiscussionIds = new Set(likedDiscussionIdsArray);
  const favoriteServiceIds = new Set(favoriteServiceIdsArray);

  // Gamification Confetti helper
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 75,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#059669", "#10b981", "#34d399", "#6ee7b7", "#f59e0b"],
      });
    } catch {
      // safe fallback if confetti fails
    }
  };

  const awardCivicPoints = (points: number, reason?: string) => {
    setCivicPoints((prev) => {
      const next = prev + points;
      toast.success(`+${points} Civic Points!`, {
        description: reason || "Thank you for contributing to civic improvement.",
      });
      triggerConfetti();
      return next;
    });
  };

  const addAuditLog = (action: string, actor: string, role: string, details: string, status: AuditLog["status"] = "info") => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      action,
      actor,
      role,
      details,
      timestamp: "Just now",
      ip: "103.14.24.11",
      status,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Complaint Actions
  const addComplaint = (data: Omit<Complaint, "id" | "date" | "timeline" | "officerNotes" | "comments">): string => {
    const year = new Date().getFullYear();
    const randomNum = String(Math.floor(1000 + Math.random() * 9000)).slice(0, 4);
    const id = `BGD-${year}-${randomNum}`;
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const newComplaint: Complaint = {
      ...data,
      id,
      date: dateStr,
      status: "submitted",
      timeline: [
        {
          status: "submitted",
          label: "Submitted",
          bn: "দাখিল করা হয়েছে",
          time: `${dateStr}, ${timeStr}`,
          note: "Complaint submitted into official citizen portal.",
        },
      ],
      officerNotes: [],
      comments: [],
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    awardCivicPoints(50, `Complaint ${id} successfully filed`);
    addAuditLog("COMPLAINT_FILED", data.citizenName || "Citizen", "citizen", `Filed complaint ${id}: ${data.title}`);
    
    // Add citizen notification
    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        type: "complaint",
        title: `Complaint Filed: ${id}`,
        body: `Your complaint "${data.title}" has been registered and queued for municipal review.`,
        time: "Just now",
        read: false,
        link: `/complaints/${id}`,
      },
      ...prev,
    ]);

    return id;
  };

  const updateComplaintStatus = (id: string, status: ComplaintStatus, officerName = "Officer Rahman", note?: string) => {
    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const fullTime = `${dateStr}, ${timeStr}`;

    const STATUS_LABELS: Record<ComplaintStatus, { en: string; bn: string }> = {
      submitted: { en: "Submitted", bn: "দাখিল করা হয়েছে" },
      review: { en: "Under Review", bn: "পর্যালোচনায়" },
      progress: { en: "In Progress", bn: "প্রক্রিয়াধীন" },
      resolved: { en: "Resolved", bn: "সমাধান হয়েছে" },
      rejected: { en: "Rejected", bn: "প্রত্যাখ্যাত" },
    };

    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id !== id) return c;
        const newTimeline = [
          ...c.timeline,
          {
            status,
            label: STATUS_LABELS[status].en,
            bn: STATUS_LABELS[status].bn,
            time: fullTime,
            note: note || `Status updated to ${STATUS_LABELS[status].en}`,
          },
        ];
        const newOfficerNotes = note
          ? [...c.officerNotes, { officer: officerName, note, time: fullTime }]
          : c.officerNotes;

        return {
          ...c,
          status,
          timeline: newTimeline,
          officerNotes: newOfficerNotes,
        };
      })
    );

    addAuditLog("STATUS_UPDATE", officerName, "officer", `Updated ${id} status to ${status}${note ? `: "${note}"` : ""}`);

    setNotifications((prev) => [
      {
        id: `n-${Date.now()}`,
        type: "complaint",
        title: `Status Updated: ${id}`,
        body: `Complaint ${id} is now marked as ${STATUS_LABELS[status].en}.`,
        time: "Just now",
        read: false,
        link: `/complaints/${id}`,
      },
      ...prev,
    ]);

    toast.success(`Complaint ${id} updated to ${STATUS_LABELS[status].en}`);
  };

  const addOfficerNote = (id: string, officer: string, note: string) => {
    const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });

    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              officerNotes: [...c.officerNotes, { officer, note, time: `${dateStr}, ${timeStr}` }],
            }
          : c
      )
    );
    addAuditLog("OFFICER_NOTE", officer, "officer", `Added note on ${id}: "${note}"`);
    toast.success("Officer note appended to complaint record.");
  };

  const addComplaintComment = (complaintId: string, author: string, role: "citizen" | "officer", text: string) => {
    const newComment: Comment = {
      id: `cc-${Date.now()}`,
      author,
      role,
      text,
      time: "Just now",
    };

    setComplaints((prev) =>
      prev.map((c) => (c.id === complaintId ? { ...c, comments: [...c.comments, newComment] } : c))
    );
  };

  // Discussion Actions
  const addDiscussion = (d: Omit<Discussion, "id" | "likes" | "comments" | "createdAt" | "status" | "pinned">): string => {
    const id = `d-${Date.now()}`;
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newDiscussion: Discussion = {
      ...d,
      id,
      likes: 0,
      comments: 0,
      status: "pending",
      pinned: false,
      createdAt: dateStr,
    };

    setDiscussions((prev) => [newDiscussion, ...prev]);
    awardCivicPoints(25, "Discussion submitted for moderation");
    addAuditLog("DISCUSSION_SUBMIT", d.author, "citizen", `Submitted topic: "${d.title}"`);
    return id;
  };

  const approveDiscussion = (id: string) => {
    setDiscussions((prev) => prev.map((d) => (d.id === id ? { ...d, status: "approved" } : d)));
    addAuditLog("DISCUSSION_APPROVE", "Officer / Admin", "officer", `Approved discussion topic ID ${id}`);
    toast.success("Discussion approved and published to the public forum.");
  };

  const rejectDiscussion = (id: string) => {
    setDiscussions((prev) => prev.filter((d) => d.id !== id));
    addAuditLog("DISCUSSION_REJECT", "Officer / Admin", "officer", `Rejected discussion topic ID ${id}`, "warning");
    toast.info("Discussion topic rejected.");
  };

  const toggleDiscussionLike = (discussionId: string) => {
    const isLiked = likedDiscussionIds.has(discussionId);
    const nextArr = isLiked
      ? likedDiscussionIdsArray.filter((id) => id !== discussionId)
      : [...likedDiscussionIdsArray, discussionId];
    setLikedDiscussionIdsArray(nextArr);

    setDiscussions((prev) =>
      prev.map((d) => (d.id === discussionId ? { ...d, likes: d.likes + (isLiked ? -1 : 1) } : d))
    );

    if (!isLiked) {
      awardCivicPoints(5, "Liked a discussion");
    }
  };

  const addDiscussionComment = (discussionId: string, author: string, authorId: string, body: string) => {
    const newComment: DiscussionComment = {
      id: `dc-${Date.now()}`,
      discussionId,
      author,
      authorId,
      body,
      createdAt: "Just now",
    };

    setDiscussionComments((prev) => [...prev, newComment]);
    setDiscussions((prev) =>
      prev.map((d) => (d.id === discussionId ? { ...d, comments: d.comments + 1 } : d))
    );
    awardCivicPoints(10, "Joined community discussion");
    toast.success("Comment posted.");
  };

  // Suggestion Actions
  const addSuggestion = (s: Omit<Suggestion, "id" | "upvotes" | "downvotes" | "status" | "createdAt">): string => {
    const id = `sg-${Date.now()}`;
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newSuggestion: Suggestion = {
      ...s,
      id,
      upvotes: 1,
      downvotes: 0,
      status: "submitted",
      createdAt: dateStr,
    };

    setSuggestions((prev) => [newSuggestion, ...prev]);
    awardCivicPoints(30, "Submitted a civic improvement suggestion");
    addAuditLog("SUGGESTION_SUBMIT", s.author, "citizen", `Proposed suggestion: "${s.title}"`);
    return id;
  };

  const voteSuggestion = (id: string, dir: "up" | "down") => {
    const currentVote = votedSuggestionIds[id];
    if (currentVote === dir) {
      // Undo vote
      const nextVotes = { ...votedSuggestionIds };
      delete nextVotes[id];
      setVotedSuggestionIds(nextVotes);
      setSuggestions((prev) =>
        prev.map((s) =>
          s.id === id
            ? {
                ...s,
                upvotes: dir === "up" ? Math.max(0, s.upvotes - 1) : s.upvotes,
                downvotes: dir === "down" ? Math.max(0, s.downvotes - 1) : s.downvotes,
              }
            : s
        )
      );
      return;
    }

    setVotedSuggestionIds((prev) => ({ ...prev, [id]: dir }));
    setSuggestions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        let up = s.upvotes;
        let down = s.downvotes;
        if (currentVote === "up") up -= 1;
        if (currentVote === "down") down -= 1;
        if (dir === "up") up += 1;
        if (dir === "down") down += 1;
        return { ...s, upvotes: up, downvotes: down };
      })
    );
    awardCivicPoints(5, dir === "up" ? "Upvoted civic suggestion" : "Voted on suggestion");
  };

  const updateSuggestionStatus = (id: string, status: SuggestionStatus) => {
    setSuggestions((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    addAuditLog("SUGGESTION_STATUS", "Officer", "officer", `Updated suggestion ${id} status to ${status}`);
    toast.success(`Suggestion status updated to ${status}`);
  };

  // Poll Actions
  const addPoll = (p: Omit<Poll, "id" | "totalVotes" | "closed" | "votedOption">): string => {
    const id = `poll-${Date.now()}`;
    const newPoll: Poll = {
      ...p,
      id,
      totalVotes: 0,
      closed: false,
      votedOption: null,
      addedByOfficer: true,
    };
    setPolls((prev) => [newPoll, ...prev]);
    addAuditLog("POLL_CREATE", "Officer", "officer", `Created new civic poll: "${p.title}"`);
    toast.success("Poll published and open for citizen voting.");
    return id;
  };

  const votePoll = (pollId: string, optionLabel: string) => {
    setPolls((prev) =>
      prev.map((p) => {
        if (p.id !== pollId) return p;
        if (p.votedOption) return p; // already voted
        const updatedOptions = p.options.map((opt) =>
          opt.label === optionLabel ? { ...opt, votes: opt.votes + 1 } : opt
        );
        return {
          ...p,
          totalVotes: p.totalVotes + 1,
          votedOption: optionLabel,
          options: updatedOptions,
        };
      })
    );
    awardCivicPoints(20, "Voted in civic poll");
  };

  // Services
  const addService = (s: Omit<Service, "id" | "officerAdded">): string => {
    const id = `s-${Date.now()}`;
    const newService: Service = {
      ...s,
      id,
      officerAdded: true,
    };
    setServices((prev) => [...prev, newService]);
    addAuditLog("SERVICE_ADD", "Officer", "officer", `Added E-Service: "${s.name}"`);
    toast.success("E-Service added to public directory.");
    return id;
  };

  const toggleFavoriteService = (id: string) => {
    const isFav = favoriteServiceIds.has(id);
    const nextArr = isFav
      ? favoriteServiceIdsArray.filter((fid) => fid !== id)
      : [...favoriteServiceIdsArray, id];
    setFavoriteServiceIdsArray(nextArr);
    toast.info(isFav ? "Removed from bookmarked services" : "Bookmarked service");
  };

  // Announcements
  const addAnnouncement = (a: Omit<Announcement, "id" | "date">): string => {
    const id = `ann-${Date.now()}`;
    const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const newAnn: Announcement = {
      ...a,
      id,
      date: dateStr,
    };
    setAnnouncements((prev) => [newAnn, ...prev]);
    addAuditLog("ALERT_BROADCAST", "Admin / Officer", "superadmin", `Broadcast alert [${a.type}]: "${a.title}"`, "warning");
    toast.success("Emergency / Broadcast Announcement published!");
    return id;
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    toast.info("Announcement removed.");
  };

  // Notifications
  const addNotification = (n: Omit<Notification, "id" | "time" | "read">) => {
    const newNotif: Notification = {
      ...n,
      id: `notif-${Date.now()}`,
      time: "Just now",
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    toast.success("All notifications marked as read.");
  };

  // Users
  const updateUserStatus = (id: string, status: ManagedUser["status"]) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
    addAuditLog("USER_STATUS_CHANGE", "Super Admin", "superadmin", `Updated user ${id} status to ${status}`, "warning");
  };

  // Full Reset to default seeds
  const resetAllData = () => {
    localStorage.clear();
    setComplaints(COMPLAINTS);
    setDiscussions(DISCUSSIONS);
    setDiscussionComments(DISCUSSION_COMMENTS);
    setSuggestions(SUGGESTIONS);
    setPolls(POLLS);
    setServices(SERVICES);
    setAnnouncements(ANNOUNCEMENTS);
    setNotifications(NOTIFICATIONS);
    setUsers(MANAGED_USERS);
    setAuditLogs(AUDIT_LOGS);
    setCivicPoints(1240);
    setLikedDiscussionIdsArray(["d1"]);
    setFavoriteServiceIdsArray(["s1", "s3", "s7"]);
    setVotedSuggestionIds({ sg1: "up" });
    toast.success("All demo data reset to defaults.");
  };

  return (
    <Ctx.Provider
      value={{
        complaints,
        addComplaint,
        updateComplaintStatus,
        addOfficerNote,
        addComplaintComment,
        discussions,
        addDiscussion,
        approveDiscussion,
        rejectDiscussion,
        toggleDiscussionLike,
        likedDiscussionIds,
        discussionComments,
        addDiscussionComment,
        suggestions,
        addSuggestion,
        voteSuggestion,
        updateSuggestionStatus,
        votedSuggestionIds,
        polls,
        addPoll,
        votePoll,
        services,
        addService,
        favoriteServiceIds,
        toggleFavoriteService,
        announcements,
        addAnnouncement,
        deleteAnnouncement,
        notifications,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        users,
        updateUserStatus,
        civicPoints,
        awardCivicPoints,
        auditLogs,
        addAuditLog,
        resetAllData,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useData() {
  const context = useContext(Ctx);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}
