export type ComplaintStatus = "submitted" | "review" | "progress" | "resolved" | "rejected";

// ─── NEW PHASE-2 TYPES ────────────────────────────────────────────────────────

export type ServiceCategory =
  | "Identity & Civil Status"
  | "Business & Licensing"
  | "Financial & Property"
  | "Public Services";

export interface Service {
  id: string;
  name: string;
  nameBn: string;
  category: ServiceCategory;
  description: string;
  icon: string;
  officerAdded: boolean;
  url: string;
}

export type DiscussionStatus = "pending" | "approved";
export type DiscussionCategory =
  | "Infrastructure"
  | "Transportation"
  | "Governance"
  | "Health"
  | "Education"
  | "Environment"
  | "Other";

export interface Discussion {
  id: string;
  title: string;
  category: DiscussionCategory;
  author: string;
  body: string;
  likes: number;
  comments: number;
  status: DiscussionStatus;
  pinned: boolean;
  createdAt: string;
}

export interface DiscussionComment {
  id: string;
  discussionId: string;
  authorId: string;
  author: string;
  body: string;
  createdAt: string;
}

export type SuggestionStatus =
  | "submitted"
  | "review"
  | "accepted"
  | "implemented"
  | "declined";

export interface Suggestion {
  id: string;
  title: string;
  body: string;
  author: string;
  upvotes: number;
  downvotes: number;
  status: SuggestionStatus;
  createdAt: string;
}

export type AnnouncementType = "emergency" | "maintenance" | "celebration" | "weather";

export interface Announcement {
  id: string;
  type: AnnouncementType;
  title: string;
  body: string;
  date: string;
}

export type UserStatus = "active" | "suspended" | "banned";
export type UserRole = "citizen" | "officer" | "superadmin";

export interface ManagedUser {
  id: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  joined: string;
  complaints: number;
  points: number;
  district: string;
}

// ─── SERVICES ─────────────────────────────────────────────────────────────────
export const SERVICES: Service[] = [
  {
    id: "s1", name: "National ID (NID)", nameBn: "জাতীয় পরিচয়পত্র",
    category: "Identity & Civil Status",
    description: "Apply, correct, or download your digital NID card from the Bangladesh Election Commission portal.",
    icon: "CreditCard", officerAdded: false, url: "https://services.nidw.gov.bd/",
  },
  {
    id: "s2", name: "Birth Certificate", nameBn: "জন্ম নিবন্ধন",
    category: "Identity & Civil Status",
    description: "Register a new birth or look up existing birth certificate records.",
    icon: "FileText", officerAdded: false, url: "https://bdris.gov.bd/",
  },
  {
    id: "s3", name: "E-Passport", nameBn: "ই-পাসপোর্ট",
    category: "Identity & Civil Status",
    description: "Track your passport application status or begin a new e-passport application.",
    icon: "BookOpen", officerAdded: false, url: "https://www.epassport.gov.bd/",
  },
  {
    id: "s4", name: "Driving License", nameBn: "ড্রাইভিং লাইসেন্স",
    category: "Business & Licensing",
    description: "Access BRTA digital services for driving license applications and renewals.",
    icon: "Car", officerAdded: false, url: "https://bsp.brta.gov.bd/",
  },
  {
    id: "s5", name: "Trade License", nameBn: "ট্রেড লাইসেন্স",
    category: "Business & Licensing",
    description: "Business registration and trade license workflow for entrepreneurs and SMEs.",
    icon: "Briefcase", officerAdded: false, url: "https://www.dncc.gov.bd/",
  },
  {
    id: "s6", name: "Land Record", nameBn: "ভূমি রেকর্ড",
    category: "Financial & Property",
    description: "Khatian lookup, mutation status tracking, and land ownership verification.",
    icon: "Map", officerAdded: false, url: "https://land.gov.bd/",
  },
  {
    id: "s7", name: "Tax Services (e-TIN)", nameBn: "কর সেবা",
    category: "Financial & Property",
    description: "Generate your e-TIN number and submit your annual income tax return online.",
    icon: "Receipt", officerAdded: false, url: "https://etaxnbr.gov.bd/",
  },
  {
    id: "s8", name: "Utility Bill Payment", nameBn: "ইউটিলিটি বিল",
    category: "Financial & Property",
    description: "Pay electricity, gas, and water bills through integrated payment gateways.",
    icon: "Zap", officerAdded: false, url: "https://dpdc.org.bd/",
  },
  {
    id: "s9", name: "Health Services", nameBn: "স্বাস্থ্য সেবা",
    category: "Public Services",
    description: "Hospital directory lookups, doctor registration, and public health portal access.",
    icon: "Heart", officerAdded: false, url: "https://dghs.gov.bd/",
  },
  {
    id: "s10", name: "Education Services", nameBn: "শিক্ষা সেবা",
    category: "Public Services",
    description: "Exam results, scholarship portals, and university admission system access.",
    icon: "GraduationCap", officerAdded: false, url: "http://www.educationboardresults.gov.bd/",
  },
  {
    id: "s11", name: "Police Clearance", nameBn: "পুলিশ ক্লিয়ারেন্স",
    category: "Public Services",
    description: "Apply for a police clearance certificate online through the Bangladesh Police portal.",
    icon: "Shield", officerAdded: false, url: "https://pcc.police.gov.bd/",
  },
  {
    id: "s12", name: "Official Forms", nameBn: "সরকারি ফরম",
    category: "Public Services",
    description: "Central repository for downloadable government forms across all departments.",
    icon: "Download", officerAdded: false, url: "https://forms.gov.bd/",
  },
];

// ─── DISCUSSIONS ───────────────────────────────────────────────────────────────
export const DISCUSSIONS: Discussion[] = [
  {
    id: "d1", title: "Mirpur-10 flyover needs urgent safety inspection",
    category: "Infrastructure", author: "Rafiqul Islam",
    body: "The Mirpur-10 flyover shows visible cracks in the support pillars. An independent structural safety inspection is urgently needed before the next monsoon season. Citizens using this route daily are at risk.",
    likes: 284, comments: 47, status: "approved", pinned: true, createdAt: "Mar 14, 2024",
  },
  {
    id: "d2", title: "Proposal: Dedicated cycling lanes on Hatirjheel road",
    category: "Transportation", author: "Shaila Parveen",
    body: "Dhaka needs sustainable transport options. A dedicated cycling lane along the Hatirjheel perimeter would reduce traffic and improve air quality. Several Southeast Asian cities have successfully implemented similar models.",
    likes: 192, comments: 31, status: "approved", pinned: false, createdAt: "Mar 13, 2024",
  },
  {
    id: "d3", title: "Open data policy for city corporation expenditure",
    category: "Governance", author: "Nur Jahan",
    body: "All city corporation spending above 10 lakh taka should be published on a public dashboard updated monthly. This aligns with Bangladesh's open government partnership commitments and reduces opportunities for corruption.",
    likes: 156, comments: 28, status: "approved", pinned: false, createdAt: "Mar 11, 2024",
  },
  {
    id: "d4", title: "Community health clinic hours should extend to 8pm",
    category: "Health", author: "Abul Kalam",
    body: "Working citizens cannot access government health clinics that close at 4pm. Extending hours to 8pm on weekdays would dramatically improve healthcare access for the working population without major budget impact.",
    likes: 118, comments: 19, status: "approved", pinned: false, createdAt: "Mar 9, 2024",
  },
  {
    id: "d5", title: "Primary school digital literacy curriculum proposal",
    category: "Education", author: "Fatema Begum",
    body: "All government primary schools should include one weekly period of digital literacy starting from Grade 3. Tablets can be shared across classes. This prepares the next generation for the digital economy.",
    likes: 97, comments: 14, status: "approved", pinned: false, createdAt: "Mar 7, 2024",
  },
  {
    id: "d6", title: "Industrial waste dumping in Buriganga — immediate action needed",
    category: "Environment", author: "Karim Uddin",
    body: "Three factories near Hazaribagh are discharging untreated waste into the Buriganga river. Environmental violation reports have been filed but no action taken. This is destroying the river ecosystem and endangering downstream communities.",
    likes: 73, comments: 22, status: "approved", pinned: false, createdAt: "Mar 5, 2024",
  },
  {
    id: "d7", title: "Waterlogging solution proposal for Dhanmondi 8",
    category: "Infrastructure", author: "Demo User",
    body: "Dhanmondi Road 8 floods within 30 minutes of moderate rainfall. The drainage pipe diameter is insufficient. I propose the DCC allocate budget for pipe replacement in the upcoming fiscal year.",
    likes: 0, comments: 0, status: "pending", pinned: false, createdAt: "Mar 15, 2024",
  },
  {
    id: "d8", title: "Introduce community composting in Uttara",
    category: "Environment", author: "Demo User",
    body: "Uttara sectors 3-7 generate significant organic waste. A community composting initiative coordinated with DNCC could reduce landfill load and produce fertiliser for Uttara's parks.",
    likes: 0, comments: 0, status: "pending", pinned: false, createdAt: "Mar 15, 2024",
  },
];

// ─── SUGGESTIONS ───────────────────────────────────────────────────────────────
export const SUGGESTIONS: Suggestion[] = [
  {
    id: "sg1", title: "Add real-time bus tracking to the Dhaka transport app",
    body: "Citizens need live GPS tracking for BRTC buses integrated into a public mobile app. This reduces wait time uncertainty and improves public transport adoption.",
    author: "Rafiqul Islam", upvotes: 412, downvotes: 18, status: "accepted", createdAt: "Mar 1, 2024",
  },
  {
    id: "sg2", title: "Automated street light fault reporting system",
    body: "Street lights should have IoT sensors that automatically report faults to the city corporation, eliminating the need for citizens to file individual complaints for every broken light.",
    author: "Fatema Begum", upvotes: 298, downvotes: 22, status: "review", createdAt: "Mar 3, 2024",
  },
  {
    id: "sg3", title: "Free WiFi zones in all public parks",
    body: "Dhaka's major parks should have free government WiFi. This supports remote work, student access, and digital inclusion for citizens who cannot afford home broadband.",
    author: "Nur Jahan", upvotes: 187, downvotes: 41, status: "submitted", createdAt: "Mar 5, 2024",
  },
  {
    id: "sg4", title: "Online renewal for all vehicle registration documents",
    body: "Currently BRTA requires physical visits for renewals. Full online processing with digital certificate delivery would save millions of working hours annually.",
    author: "Abul Kalam", upvotes: 156, downvotes: 9, status: "implemented", createdAt: "Feb 20, 2024",
  },
  {
    id: "sg5", title: "Multilingual emergency hotline (Bangla + sign language)",
    body: "The national emergency hotline 999 should support Bangladeshi Sign Language for hearing-impaired citizens. A video relay service would make emergencies accessible to all.",
    author: "Shaila Parveen", upvotes: 143, downvotes: 5, status: "accepted", createdAt: "Feb 25, 2024",
  },
  {
    id: "sg6", title: "Monthly public budget transparency reports",
    body: "Each city corporation ward should publish a monthly plain-language report on how its budget was spent, accessible via the OpenGovtBD portal.",
    author: "Karim Uddin", upvotes: 98, downvotes: 31, status: "submitted", createdAt: "Mar 8, 2024",
  },
  {
    id: "sg7", title: "Senior citizen priority queue at government offices",
    body: "Citizens above 60 years should have a dedicated priority queue at all government service counters, similar to the system used at some bank branches.",
    author: "Jamal Hossain", upvotes: 76, downvotes: 12, status: "review", createdAt: "Mar 10, 2024",
  },
  {
    id: "sg8", title: "Community water testing kits for flood-affected areas",
    body: "After floods, the government should distribute free water testing kits to affected households to prevent waterborne disease outbreaks.",
    author: "Ritu Akter", upvotes: 54, downvotes: 8, status: "declined", createdAt: "Feb 15, 2024",
  },
];

// ─── ANNOUNCEMENTS ─────────────────────────────────────────────────────────────
export const ANNOUNCEMENTS: Announcement[] = [
  {
    id: "an1", type: "emergency",
    title: "Heavy Rainfall Warning — Dhaka Division",
    body: "The Bangladesh Meteorological Department has issued a heavy rainfall warning for Dhaka Division for the next 48 hours. Citizens in low-lying areas should take precautions. Emergency helpline: 1090.",
    date: "Mar 15, 2024",
  },
  {
    id: "an2", type: "maintenance",
    title: "e-TIN Portal Maintenance — March 16, 2am–6am",
    body: "The National Board of Revenue's e-TIN portal will be under scheduled maintenance on March 16 from 2:00am to 6:00am. Tax return submissions will be unavailable during this window.",
    date: "Mar 14, 2024",
  },
  {
    id: "an3", type: "celebration",
    title: "Independence Day Holiday — March 26",
    body: "All government offices will be closed on March 26 in observance of Bangladesh Independence Day. Emergency services remain operational. Happy Independence Day!",
    date: "Mar 13, 2024",
  },
  {
    id: "an4", type: "maintenance",
    title: "NID Server Upgrade — March 18–19",
    body: "The Bangladesh Election Commission will upgrade NID servers on March 18–19. Online NID services including Smart Card downloads will be temporarily unavailable.",
    date: "Mar 12, 2024",
  },
  {
    id: "an5", type: "weather",
    title: "Cyclone Season Advisory — Coastal Districts",
    body: "The Disaster Management Ministry advises coastal district residents to monitor official bulletins. Community shelters have been identified. Register your family's shelter plan with your local UP office.",
    date: "Mar 10, 2024",
  },
];

// ─── MANAGED USERS ─────────────────────────────────────────────────────────────
export const MANAGED_USERS: ManagedUser[] = [
  { id: "u1", name: "Fatema Begum", role: "citizen", status: "active", joined: "Jan 2024", complaints: 12, points: 4820, district: "Sylhet" },
  { id: "u2", name: "Md. Rafiqul Islam", role: "citizen", status: "active", joined: "Feb 2024", complaints: 9, points: 4210, district: "Chittagong" },
  { id: "u3", name: "Nur Jahan", role: "citizen", status: "active", joined: "Jan 2024", complaints: 7, points: 3980, district: "Rajshahi" },
  { id: "u4", name: "Abul Kalam", role: "citizen", status: "suspended", joined: "Feb 2024", complaints: 15, points: 3670, district: "Khulna" },
  { id: "u5", name: "Shaila Parveen", role: "citizen", status: "active", joined: "Mar 2024", complaints: 5, points: 3200, district: "Dhaka" },
  { id: "u6", name: "Karim Uddin", role: "citizen", status: "banned", joined: "Jan 2024", complaints: 3, points: 120, district: "Barisal" },
  { id: "u7", name: "Ritu Akter", role: "citizen", status: "active", joined: "Mar 2024", complaints: 4, points: 2540, district: "Mymensingh" },
  { id: "u8", name: "Officer Nasrin", role: "officer", status: "active", joined: "Jan 2024", complaints: 0, points: 0, district: "Dhaka" },
  { id: "u9", name: "Officer Rahman", role: "officer", status: "active", joined: "Feb 2024", complaints: 0, points: 0, district: "Chittagong" },
  { id: "u10", name: "Demo User", role: "citizen", status: "active", joined: "Mar 2024", complaints: 8, points: 1240, district: "Dhaka" },
];

// ─── PROFILE LOOKUP ────────────────────────────────────────────────────────────
// Every user in the system — seeded or newly registered — resolves to a stable,
// unique profile. Names in discussions/suggestions don't always match the
// managed-user record verbatim (e.g. "Rafiqul Islam" vs "Md. Rafiqul Islam"),
// so lookup falls back to a fuzzy match, then to a deterministically generated
// profile so the same name always resolves to the same synthetic id.
const DISTRICT_POOL = ["Dhaka", "Chittagong", "Sylhet", "Rajshahi", "Khulna", "Barisal", "Rangpur", "Mymensingh"];

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function findUserProfile(name: string): ManagedUser {
  const exact = MANAGED_USERS.find((u) => u.name.toLowerCase() === name.toLowerCase());
  if (exact) return exact;

  const fuzzy = MANAGED_USERS.find(
    (u) => u.name.toLowerCase().includes(name.toLowerCase()) || name.toLowerCase().includes(u.name.toLowerCase())
  );
  if (fuzzy) return fuzzy;

  const h = hashString(name);
  return {
    id: `NC-${(h % 900000 + 100000)}`,
    name,
    role: "citizen",
    status: "active",
    joined: ["Jan 2024", "Feb 2024", "Mar 2024"][h % 3],
    complaints: h % 15,
    points: 500 + (h % 4000),
    district: DISTRICT_POOL[h % DISTRICT_POOL.length],
  };
}

// ─── DISCUSSION COMMENTS ───────────────────────────────────────────────────────
export const DISCUSSION_COMMENTS: DiscussionComment[] = [
  { id: "dc1", discussionId: "d1", authorId: "u5", author: "Shaila Parveen", body: "I drive under this flyover daily — the cracks near pillar 4 have visibly widened since January. Please prioritise this.", createdAt: "Mar 14, 2024" },
  { id: "dc2", discussionId: "d1", authorId: "u9", author: "Officer Rahman", body: "Noted. RAJUK's structural team has been notified and an inspection is scheduled for next week.", createdAt: "Mar 14, 2024" },
  { id: "dc3", discussionId: "d2", authorId: "u3", author: "Nur Jahan", body: "Fully support this. Copenhagen-style protected lanes would work well around Hatirjheel's existing loop.", createdAt: "Mar 13, 2024" },
  { id: "dc4", discussionId: "d3", authorId: "u2", author: "Md. Rafiqul Islam", body: "Open data on city spending is long overdue. Would love to see it as machine-readable CSV, not just PDF.", createdAt: "Mar 11, 2024" },
  { id: "dc5", discussionId: "d4", authorId: "u1", author: "Fatema Begum", body: "As a nurse, I can confirm evening demand is very high. Extended hours would ease a lot of pressure on ER visits too.", createdAt: "Mar 9, 2024" },
];

export interface TimelineEntry {
  status: ComplaintStatus;
  label: string;
  bn: string;
  time: string;
  note?: string;
}

export interface Comment {
  id: string;
  author: string;
  role: "citizen" | "officer";
  text: string;
  time: string;
}

export interface Complaint {
  id: string;
  title: string;
  category: string;
  location: string;
  district: string;
  date: string;
  status: ComplaintStatus;
  description: string;
  timeline: TimelineEntry[];
  officerNotes: { officer: string; note: string; time: string }[];
  comments: Comment[];
}

export interface Poll {
  id: string;
  title: string;
  area: string;
  options: { label: string; votes: number }[];
  totalVotes: number;
  closesIn: string;
  closed: boolean;
  votedOption: string | null;
}

export interface Badge {
  id: string;
  name: string;
  nameBn: string;
  desc: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  total: number;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  district: string;
  points: number;
  badges: number;
  isCurrentUser?: boolean;
}

export interface Notification {
  id: string;
  type: "complaint" | "poll" | "badge";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

// ─── COMPLAINTS ───────────────────────────────────────────────────────────────
export const COMPLAINTS: Complaint[] = [
  {
    id: "BGD-2024-0847",
    title: "Road damage on Mirpur-10 circle",
    category: "Roads & Infrastructure",
    location: "Mirpur-10 Roundabout",
    district: "Dhaka",
    date: "Mar 12, 2024",
    status: "progress",
    description:
      "A large pothole approximately 1.5m wide has formed at the Mirpur-10 roundabout, causing traffic hazards and vehicle damage. Multiple accidents have been reported.",
    timeline: [
      { status: "submitted", label: "Submitted", bn: "দাখিল করা হয়েছে", time: "Mar 12, 09:14" },
      { status: "review", label: "Under Review", bn: "পর্যালোচনায়", time: "Mar 12, 14:30", note: "Assigned to DCC Roads Division" },
      { status: "progress", label: "In Progress", bn: "প্রক্রিয়াধীন", time: "Mar 13, 10:05", note: "Repair crew scheduled" },
    ],
    officerNotes: [
      { officer: "Abdul Karim (DCC Ward 15)", note: "Site inspection completed. Repair estimated to take 2 days. Materials ordered.", time: "Mar 13, 10:05" },
    ],
    comments: [
      { id: "c1", author: "You", role: "citizen", text: "Any update on when repairs will start?", time: "Mar 13, 12:00" },
      { id: "c2", author: "Officer Karim", role: "officer", text: "Crew will arrive tomorrow morning. Estimated completion by Mar 15.", time: "Mar 13, 14:22" },
    ],
  },
  {
    id: "BGD-2024-0831",
    title: "Street lights non-functional — Dhanmondi 27",
    category: "Electricity & Lighting",
    location: "Dhanmondi Road 27",
    district: "Dhaka",
    date: "Mar 8, 2024",
    status: "resolved",
    description: "Six consecutive street lights have been non-functional for 3 weeks creating safety concerns at night.",
    timeline: [
      { status: "submitted", label: "Submitted", bn: "দাখিল করা হয়েছে", time: "Mar 8, 18:00" },
      { status: "review", label: "Under Review", bn: "পর্যালোচনায়", time: "Mar 9, 09:00" },
      { status: "progress", label: "In Progress", bn: "প্রক্রিয়াধীন", time: "Mar 10, 08:00" },
      { status: "resolved", label: "Resolved", bn: "সমাধান হয়েছে", time: "Mar 11, 17:00", note: "All lights replaced and tested" },
    ],
    officerNotes: [
      { officer: "DESCO Technician Team", note: "All 6 lights replaced. Wiring fault identified and fixed.", time: "Mar 11, 17:00" },
    ],
    comments: [],
  },
  {
    id: "BGD-2024-0815",
    title: "Garbage accumulation near Gulshan Lake",
    category: "Waste Management",
    location: "Gulshan Lake Park North Gate",
    district: "Dhaka",
    date: "Mar 5, 2024",
    status: "review",
    description: "Illegal garbage dumping has been happening for 2 weeks. The smell is unbearable and there are concerns about mosquito breeding.",
    timeline: [
      { status: "submitted", label: "Submitted", bn: "দাখিল করা হয়েছে", time: "Mar 5, 10:30" },
      { status: "review", label: "Under Review", bn: "পর্যালোচনায়", time: "Mar 6, 09:15" },
    ],
    officerNotes: [],
    comments: [],
  },
  {
    id: "BGD-2024-0799",
    title: "Waterlogging in Rayer Bazar after rain",
    category: "Drainage & Waterlogging",
    location: "Rayer Bazar Main Road",
    district: "Dhaka",
    date: "Feb 28, 2024",
    status: "rejected",
    description: "After every rainfall the road becomes completely flooded for 6–8 hours.",
    timeline: [
      { status: "submitted", label: "Submitted", bn: "দাখিল করা হয়েছে", time: "Feb 28, 11:00" },
      { status: "review", label: "Under Review", bn: "পর্যালোচনায়", time: "Mar 1, 09:00" },
      { status: "rejected", label: "Rejected", bn: "প্রত্যাখ্যাত", time: "Mar 3, 15:00", note: "Duplicate — existing work order #DCC-2024-110 covers this area" },
    ],
    officerNotes: [
      { officer: "DCC Drainage Division", note: "This area is already covered under work order #DCC-2024-110 filed Feb 20. Please track that order.", time: "Mar 3, 15:00" },
    ],
    comments: [],
  },
  {
    id: "BGD-2024-0788",
    title: "Broken footpath tiles — Uttara Sector 7",
    category: "Roads & Infrastructure",
    location: "Uttara Sector 7, Avenue 5",
    district: "Dhaka",
    date: "Feb 25, 2024",
    status: "submitted",
    description: "Multiple footpath tiles are broken and jutting up, causing a tripping hazard especially for elderly pedestrians.",
    timeline: [
      { status: "submitted", label: "Submitted", bn: "দাখিল করা হয়েছে", time: "Feb 25, 08:45" },
    ],
    officerNotes: [],
    comments: [],
  },
  {
    id: "BGD-2024-0771",
    title: "Noise pollution from construction — Banani 11",
    category: "Environment & Noise",
    location: "Banani Road 11",
    district: "Dhaka",
    date: "Feb 20, 2024",
    status: "progress",
    description: "Construction site is operating past 10pm violating noise ordinance. Residents cannot sleep.",
    timeline: [
      { status: "submitted", label: "Submitted", bn: "দাখিল করা হয়েছে", time: "Feb 20, 23:00" },
      { status: "review", label: "Under Review", bn: "পর্যালোচনায়", time: "Feb 21, 09:00" },
      { status: "progress", label: "In Progress", bn: "প্রক্রিয়াধীন", time: "Feb 22, 11:00" },
    ],
    officerNotes: [
      { officer: "DNCC Enforcement", note: "Warning issued to construction contractor. Monitoring in progress.", time: "Feb 22, 11:00" },
    ],
    comments: [],
  },
  {
    id: "BGD-2024-0755",
    title: "Open manhole cover — Mohammadpur",
    category: "Roads & Infrastructure",
    location: "Mohammadpur Bus Stand Area",
    district: "Dhaka",
    date: "Feb 18, 2024",
    status: "resolved",
    description: "Manhole cover is missing, posing extreme danger to vehicles and pedestrians.",
    timeline: [
      { status: "submitted", label: "Submitted", bn: "দাখিল করা হয়েছে", time: "Feb 18, 07:30" },
      { status: "review", label: "Under Review", bn: "পর্যালোচনায়", time: "Feb 18, 09:00" },
      { status: "progress", label: "In Progress", bn: "প্রক্রিয়াধীন", time: "Feb 18, 11:00" },
      { status: "resolved", label: "Resolved", bn: "সমাধান হয়েছে", time: "Feb 18, 16:00", note: "Emergency repair completed same day" },
    ],
    officerNotes: [
      { officer: "WASA Emergency Team", note: "Cover replaced. Fast-tracked as safety emergency.", time: "Feb 18, 16:00" },
    ],
    comments: [],
  },
  {
    id: "BGD-2024-0741",
    title: "Water supply disruption — Mirpur 1",
    category: "Water Supply",
    location: "Mirpur Section 1",
    district: "Dhaka",
    date: "Feb 15, 2024",
    status: "resolved",
    description: "No water supply for 4 days in Mirpur Section 1. Multiple households affected.",
    timeline: [
      { status: "submitted", label: "Submitted", bn: "দাখিল করা হয়েছে", time: "Feb 15, 10:00" },
      { status: "review", label: "Under Review", bn: "পর্যালোচনায়", time: "Feb 15, 11:00" },
      { status: "progress", label: "In Progress", bn: "প্রক্রিয়াধীন", time: "Feb 16, 08:00" },
      { status: "resolved", label: "Resolved", bn: "সমাধান হয়েছে", time: "Feb 17, 14:00" },
    ],
    officerNotes: [],
    comments: [],
  },
];

// ─── POLLS ─────────────────────────────────────────────────────────────────────
export const POLLS: Poll[] = [
  {
    id: "poll-1",
    title: "Should Gulshan-2 circle be redesigned to prioritize pedestrians over private vehicles?",
    area: "Dhaka North City Corporation",
    options: [
      { label: "Strongly agree", votes: 1847 },
      { label: "Agree", votes: 1038 },
      { label: "Neutral", votes: 500 },
      { label: "Disagree", votes: 462 },
    ],
    totalVotes: 3847,
    closesIn: "2 days",
    closed: false,
    votedOption: null,
  },
  {
    id: "poll-2",
    title: "Should DCC increase the frequency of garbage collection in residential areas from 3x to 5x per week?",
    area: "Dhaka City Corporation (All Wards)",
    options: [
      { label: "Yes, immediately", votes: 4201 },
      { label: "Yes, within 6 months", votes: 1830 },
      { label: "Current frequency is fine", votes: 420 },
      { label: "No, reduce it", votes: 49 },
    ],
    totalVotes: 6500,
    closesIn: "5 days",
    closed: false,
    votedOption: null,
  },
  {
    id: "poll-3",
    title: "Do you support the proposed Bus Rapid Transit (BRT) corridor along Mirpur Road?",
    area: "Dhaka Metropolitan Area",
    options: [
      { label: "Strongly support", votes: 2100 },
      { label: "Support with conditions", votes: 1500 },
      { label: "Neutral", votes: 600 },
      { label: "Oppose", votes: 300 },
    ],
    totalVotes: 4500,
    closesIn: "8 days",
    closed: false,
    votedOption: null,
  },
  {
    id: "poll-4",
    title: "Should Hatirjheel Park extend its opening hours to 10pm?",
    area: "Dhaka East (Rampura / Badda)",
    options: [
      { label: "Yes", votes: 5870 },
      { label: "No", votes: 630 },
    ],
    totalVotes: 6500,
    closesIn: "Closed",
    closed: true,
    votedOption: null,
  },
  {
    id: "poll-5",
    title: "Rate the quality of street cleaning services in your area over the last 3 months.",
    area: "All City Corporation Areas",
    options: [
      { label: "Excellent", votes: 820 },
      { label: "Good", votes: 1450 },
      { label: "Average", votes: 2100 },
      { label: "Poor", votes: 3200 },
      { label: "Very Poor", votes: 1430 },
    ],
    totalVotes: 9000,
    closesIn: "Closed",
    closed: true,
    votedOption: null,
  },
  {
    id: "poll-6",
    title: "Should Dhaka introduce a congestion charge for private vehicles in the CBD during peak hours?",
    area: "Dhaka Metropolitan Area",
    options: [
      { label: "Yes, strongly", votes: 3400 },
      { label: "Yes, but only for large vehicles", votes: 1200 },
      { label: "No", votes: 2800 },
      { label: "Need more information", votes: 600 },
    ],
    totalVotes: 8000,
    closesIn: "Closed",
    closed: true,
    votedOption: null,
  },
];

// ─── BADGES ────────────────────────────────────────────────────────────────────
export const BADGES: Badge[] = [
  { id: "b1", name: "First Report", nameBn: "প্রথম প্রতিবেদন", desc: "Filed your first complaint", icon: "FileText", unlocked: true, progress: 1, total: 1 },
  { id: "b2", name: "Active Voter", nameBn: "সক্রিয় ভোটার", desc: "Voted in 5 polls", icon: "BarChart2", unlocked: true, progress: 5, total: 5 },
  { id: "b3", name: "Watchdog", nameBn: "প্রহরী", desc: "Filed 5 complaints", icon: "Eye", unlocked: true, progress: 5, total: 5 },
  { id: "b4", name: "Community Voice", nameBn: "কমিউনিটি কণ্ঠ", desc: "Got 10 upvotes on complaints", icon: "Users", unlocked: true, progress: 10, total: 10 },
  { id: "b5", name: "Consistent Citizen", nameBn: "নিয়মিত নাগরিক", desc: "Active for 30 consecutive days", icon: "Calendar", unlocked: true, progress: 30, total: 30 },
  { id: "b6", name: "Poll Champion", nameBn: "পোল চ্যাম্পিয়ন", desc: "Vote in 20 polls", icon: "Trophy", unlocked: false, progress: 8, total: 20 },
  { id: "b7", name: "Civic Champion", nameBn: "নাগরিক চ্যাম্পিয়ন", desc: "Earn 1000 civic points", icon: "Award", unlocked: false, progress: 760, total: 1000 },
  { id: "b8", name: "Top Reporter", nameBn: "শীর্ষ প্রতিবেদক", desc: "File 20 complaints", icon: "Star", unlocked: false, progress: 8, total: 20 },
  { id: "b9", name: "Verified Leader", nameBn: "যাচাইকৃত নেতা", desc: "Reach top 10 on leaderboard", icon: "Shield", unlocked: false, progress: 24, total: 10 },
];

// ─── LEADERBOARD ───────────────────────────────────────────────────────────────
export const LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Fatema Begum", district: "Sylhet", points: 4820, badges: 9 },
  { rank: 2, name: "Md. Rafiqul Islam", district: "Chittagong", points: 4210, badges: 8 },
  { rank: 3, name: "Nur Jahan", district: "Rajshahi", points: 3980, badges: 7 },
  { rank: 4, name: "Abul Kalam", district: "Khulna", points: 3670, badges: 7 },
  { rank: 5, name: "Shaila Parveen", district: "Dhaka", points: 3200, badges: 6 },
  { rank: 6, name: "Karim Uddin", district: "Barisal", points: 2870, badges: 6 },
  { rank: 7, name: "Ritu Akter", district: "Mymensingh", points: 2540, badges: 5 },
  { rank: 8, name: "Jamal Hossain", district: "Comilla", points: 2100, badges: 5 },
  { rank: 9, name: "Mou Rahman", district: "Dhaka", points: 1890, badges: 5 },
  { rank: 24, name: "You (Demo User)", district: "Dhaka", points: 1240, badges: 5, isCurrentUser: true },
];

// ─── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export const NOTIFICATIONS: Notification[] = [
  { id: "n1", type: "complaint", title: "Status updated: BGD-2024-0847", body: "Your complaint about road damage is now In Progress.", time: "2 hours ago", read: false },
  { id: "n2", type: "badge", title: "Badge earned: Watchdog", body: "You filed your 5th complaint. Keep it up!", time: "1 day ago", read: false },
  { id: "n3", type: "poll", title: "New poll in your area", body: "Vote on the Gulshan-2 pedestrian redesign proposal.", time: "1 day ago", read: false },
  { id: "n4", type: "complaint", title: "Resolved: BGD-2024-0831", body: "Street lights on Dhanmondi Road 27 have been fixed.", time: "3 days ago", read: true },
  { id: "n5", type: "badge", title: "Badge earned: Active Voter", body: "You voted in 5 polls. Community hero!", time: "4 days ago", read: true },
  { id: "n6", type: "poll", title: "Poll closed: Hatirjheel Park hours", body: "Results: 90% voted Yes. Awaiting authority decision.", time: "5 days ago", read: true },
  { id: "n7", type: "complaint", title: "Officer note added: BGD-2024-0771", body: "Warning issued to the construction site. Monitoring ongoing.", time: "6 days ago", read: true },
  { id: "n8", type: "complaint", title: "Rejected: BGD-2024-0799", body: "Your complaint was rejected — see officer notes for details.", time: "7 days ago", read: true },
];

// ─── ADMIN STATS ───────────────────────────────────────────────────────────────
export const ADMIN_VOLUME = Array.from({ length: 30 }, (_, i) => ({
  day: `Mar ${i + 1}`,
  complaints: Math.floor(20 + Math.sin(i / 3) * 8 + Math.random() * 10),
  resolved: Math.floor(12 + Math.sin(i / 4) * 5 + Math.random() * 6),
}));

export const ADMIN_CATEGORIES = [
  { category: "Roads & Infrastructure", count: 142 },
  { category: "Waste Management", count: 98 },
  { category: "Electricity & Lighting", count: 76 },
  { category: "Water Supply", count: 54 },
  { category: "Drainage", count: 47 },
  { category: "Environment & Noise", count: 33 },
];

export const ADMIN_OFFICERS = [
  { name: "Abdul Karim", department: "DCC Roads", assigned: 48, resolved: 41, avgDays: 2.1, rating: 88 },
  { name: "Nasrin Akter", department: "DESCO", assigned: 35, resolved: 34, avgDays: 1.4, rating: 96 },
  { name: "Shafiqul Islam", department: "WASA", assigned: 29, resolved: 22, avgDays: 3.8, rating: 72 },
  { name: "Monira Begum", department: "DNCC Waste", assigned: 52, resolved: 38, avgDays: 4.2, rating: 68 },
  { name: "Rezaul Karim", department: "DCC Drainage", assigned: 22, resolved: 18, avgDays: 5.1, rating: 61 },
];
