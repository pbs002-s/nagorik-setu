# Plan: OpenGovtBD — Phase 3 (Discussion Threading, Back Buttons, Officer UX, Surprises)

---

## Context

Phase 2 built the full multi-role SPA. Phase 3 adds the following improvements based on user feedback and screenshots:

1. **Discussion threading** — comment system with likes, user profiles, unique user IDs
2. **Back button everywhere** — 10 pages currently missing it
3. **Officer Dashboard UX** — clickable KPI cards (screenshots act as nav buttons), vertical tab list for easier scanning, verify all functions work
4. **Surprise features** — two: a Nagorik Digital ID Card in Profile, and trending discussions banner

---

## Screenshots Analysis

- **image.png** (Officer Overview KPI row): Clicking "Pending Approvals" → Approval Queue tab; "Active Polls" → My Polls tab; "Services Added" → Add Service tab. Cards must become interactive buttons.
- **image-1.png** (Citizen Dashboard): Shows existing KPI + announcements strip, working correctly.
- **image-2.png** (Super Admin Overview): Admin KPI cards should also navigate to their respective tabs (click "Total Citizens" → User Management, "Pending Content" → All Content, etc.).

---

## Files to Modify / Create

| File | Change |
|---|---|
| `data/mockData.ts` | Add `DiscussionComment` type, `likedBy` to Discussion, seed `DISCUSSION_COMMENTS` |
| `components/DataContext.tsx` | Add `comments` / `setComments` state |
| `components/AuthContext.tsx` | Add `userId: string` derived from role/name |
| `components/UserProfilePopover.tsx` | **New** — Radix Popover showing author mini-profile |
| `components/BackButton.tsx` | **New** — reusable back button component |
| `pages/DiscussionsPage.tsx` | Expand to detail view with comment thread, per-discussion likes, author profile popovers |
| `pages/OfficerDashboardPage.tsx` | Vertical tab list, clickable KPI cards, back button |
| `pages/SuperAdminPage.tsx` | Clickable KPI cards navigating to correct tab, back button |
| `pages/ProfilePage.tsx` | Add Nagorik ID Card section (surprise #1), back button |
| `pages/AchievementsPage.tsx` | Add back button |
| `pages/PollsPage.tsx` | Add back button |
| `pages/NotificationsPage.tsx` | Add back button |
| `pages/AdminPage.tsx` | Add back button |
| `pages/DiscussionsPage.tsx` | Add back button |
| `pages/ServicesPage.tsx` | Add back button |
| `pages/SuggestionBoxPage.tsx` | Add back button |

---

## Detailed Specifications

### 1. Data Layer — `mockData.ts`

```ts
// Add to Discussion type:
likedBy: string[]   // array of userIds who have liked this discussion

// New type:
export interface DiscussionComment {
  id: string;
  discussionId: string;
  authorId: string;
  authorName: string;
  body: string;
  likes: number;
  likedBy: string[];
  timestamp: string;
  replies: DiscussionComment[];  // 1 level of nesting
}

// New export:
export const DISCUSSION_COMMENTS: DiscussionComment[] = [
  // 8-10 comments seeded across discussions d1-d4
]
```

### 2. AuthContext — `AuthContext.tsx`

Add `userId: string` to context. Derive it from role + name: citizen → `"ctz-demo-0001"`, officer → `"off-nasrin-0008"`, superadmin → `"adm-super-0099"`. This is the stable ID used for likedBy arrays and comment authorship.

### 3. DataContext — `DataContext.tsx`

Add:
```ts
comments: DiscussionComment[];
setComments: (c: DiscussionComment[]) => void;
```
Initialized from `DISCUSSION_COMMENTS`.

### 4. `UserProfilePopover.tsx` — New Component

A Radix Popover that wraps any author name/avatar. Props: `authorName: string`, `authorId?: string`. Looks up the user in `MANAGED_USERS` by name. Shows:
- Avatar (initials circle, navy bg)
- Name + role badge
- District · Member since
- Civic Points + Complaints count
- "View Profile" link (visual only)

Used in: Discussion cards, comment rows.

### 5. `BackButton.tsx` — New Component

```tsx
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

export function BackButton({ to }: { to?: string }) {
  const navigate = useNavigate();
  return (
    <button onClick={() => to ? navigate(to) : navigate(-1)}
      className="flex items-center gap-1.5 text-sm text-[#64748b] hover:text-[#0f172a] transition-colors mb-1">
      <ArrowLeft size={15} />
      Back
    </button>
  );
}
```

Added to the top of each page header section (before the `<h1>`).

### 6. `DiscussionsPage.tsx` — Discussion Detail + Comments

When a user clicks a discussion card, it expands into a full detail view (replace the list in the same page, not a modal):
- Full discussion body
- Like button (uses `userId` from AuthContext, toggles in `likedBy` array)
- "Back to discussions" link to return to list
- Comment thread section:
  - Each comment shows: author avatar (initials), `UserProfilePopover` on author name click, body, timestamp, like count + like button, Reply button
  - Reply form: inline textarea per comment (collapsed by default, toggles on "Reply" click)
  - Add comment form at the bottom: textarea + submit button
- "Pending" discussions cannot have comments until approved

The state machine: `view: "list" | "detail"` + `selectedDiscussion: Discussion | null`

### 7. `OfficerDashboardPage.tsx` — UX Improvements

**Tab navigation redesign**: Replace the horizontal flex tab bar with a **vertical left sidebar** within the page (grid layout: `grid-cols-[180px_1fr]`). Tab list on the left, content on the right. Each tab item shows icon + label + optional count badge. This makes tabs scannable as a "list."

**Clickable KPI cards**: Modify `KpiCard` to accept an optional `onClick?: () => void`. Wire:
- Pending Approvals → `setTab("queue")`
- Active Polls → `setTab("my-polls")`
- Services Added → `setTab("add-service")`
- Citizens Helped → no navigation (no matching tab)

Cursor changes to `pointer` when `onClick` is defined.

**Back button**: Added to page header.

**Verify all functions work**: Approval queue approve/reject, Add Poll publish, Add Service add, My Polls display — all should function correctly.

### 8. `SuperAdminPage.tsx` — Clickable KPI Cards

Same pattern as Officer. Wire:
- Total Citizens → `setTab("users")`
- Total Officers → `setTab("officers")`
- Discussions → `setTab("content")` with filter preset to "discussions"
- Suggestions → `setTab("content")` with filter preset to "suggestions"
- Pending Content → `setTab("content")` + filter "pending"
- Banned Users / Suspended Users / Active Users → `setTab("users")`

**Back button**: Added to page header.

### 9. Surprise #1 — Nagorik Digital ID Card (ProfilePage)

Add a new `SectionCard` at the top of ProfilePage titled "My Nagorik ID":
- Styled like a physical identity card: dark navy background, green accent stripe, OpenGovtBD logo, citizen name in large weight, unique Nagorik ID number (`NG-0001-DEMO`), role badge, civic score, QR-code-style decorative pattern (CSS grid of tiny squares), "Valid · Active" status indicator
- "Download Card" button shows a toast "Card download coming soon"

### 10. Surprise #2 — Trending Banner on DiscussionsPage

At the top of the discussions list (before search bar), a horizontally scrolling ticker strip showing the top 3 most-liked discussions with animated like count and a "🔥 Trending" chip. Auto-scrolls via CSS animation (`@keyframes scroll`). Creates a sense of civic energy.

---

## Back Button Pages (complete list)

Apply `<BackButton />` at the top of the header `<div>` in each of these:
- `pages/AchievementsPage.tsx`
- `pages/PollsPage.tsx`
- `pages/NotificationsPage.tsx`
- `pages/ProfilePage.tsx`
- `pages/AdminPage.tsx`
- `pages/DiscussionsPage.tsx`
- `pages/OfficerDashboardPage.tsx`
- `pages/ServicesPage.tsx`
- `pages/SuggestionBoxPage.tsx`
- `pages/SuperAdminPage.tsx`

---

## Verification

1. `/discussions` — click a discussion → detail view opens, full body visible
2. Like a discussion → count increments, button turns green, cannot like twice
3. Add a comment → appears in thread immediately
4. Click author name → UserProfilePopover appears with their profile info
5. Click reply on a comment → inline reply form appears → submit adds nested reply
6. `/officer` — click "Pending Approvals" KPI card → Approval Queue tab activates
7. `/officer` — tab list is now vertical (sidebar-style), easier to scan
8. `/superadmin` — click "Pending Content" card → All Content tab opens
9. Every page has a Back button visible in the header
10. `/profile` → Nagorik ID Card section visible with citizen-specific ID
11. `/discussions` trending ticker visible at top, scrolling

# Phase 2: Roles, Content, New Pages

## Context (Phase 2)

The user provided detailed functional specs for a large expansion covering: a redesigned landing page with real copy, a role-based login system (Citizen / Officer / Super Admin), an expanded citizen dashboard, three new pages (Services directory, Public Discussions, Suggestion Box), an Officer workspace, a Super Admin panel, and role-aware navigation throughout. All data remains client-side mock.

---

## Files to create / modify

### New pages
| File | Route | Role |
|---|---|---|
| `pages/ServicesPage.tsx` | `/services` | Citizen |
| `pages/DiscussionsPage.tsx` | `/discussions` | Citizen |
| `pages/SuggestionBoxPage.tsx` | `/suggestions` | Citizen |
| `pages/OfficerDashboardPage.tsx` | `/officer` | Officer |
| `pages/SuperAdminPage.tsx` | `/superadmin` | Super Admin |

### Modified files
- `data/mockData.ts` — add Service, Discussion, Suggestion, Announcement, User types + data
- `components/AuthContext.tsx` — add `"officer"` role; extend context with `language` toggle
- `components/AppShell.tsx` — 3-way role-aware nav (Citizen / Officer / Super Admin)
- `pages/LandingPage.tsx` — replace placeholder copy with real brief content
- `pages/LoginPage.tsx` — role tabs, mobile number field, demo credentials per role
- `pages/DashboardPage.tsx` — emergency banner, e-services row, announcements, discussions feed
- `App.tsx` — add 5 new routes

---

## Detailed specifications

### 1. `mockData.ts` additions

```ts
// New types & exports:
Service { id, name, nameBn, category, icon, url, officerAdded }
Discussion { id, title, category, author, body, likes, comments, status: "pending"|"approved", pinned, createdAt }
Suggestion { id, title, body, author, upvotes, downvotes, status: "submitted"|"review"|"accepted"|"implemented"|"declined", createdAt }
Announcement { id, type: "emergency"|"maintenance"|"celebration"|"weather", title, body, date }
ManagedUser { id, name, role, status: "active"|"suspended"|"banned", joined, complaints, points }

// New variables:
SERVICES          — 12 services across 4 categories (Identity, Business, Financial, Public)
DISCUSSIONS       — 6 approved + 2 pending
SUGGESTIONS       — 8 suggestions with mixed statuses and vote counts
ANNOUNCEMENTS     — 5 announcements (1 emergency weather, 2 maintenance, 1 national celebration, 1 general)
MANAGED_USERS     — 10 users for admin panel
```

### 2. `AuthContext.tsx`

Add role `"officer"` alongside existing `"citizen"` and `"admin"`.  
Rename `"admin"` → `"superadmin"` internally; keep `"admin"` as alias for existing officer role → **change**: roles become `"citizen" | "officer" | "superadmin"`.  
Add `language: "en" | "bn"` + `setLanguage` to context so any page can toggle it.

### 3. `LoginPage.tsx` — full rewrite

Three role tabs at the top: **Citizen**, **Government Officer**, **Super Admin**.  
- Auth field: **Mobile Number** (+880 prefix, 11-digit) instead of email.  
- Password field unchanged (show/hide toggle).  
- Optional **OTP/2FA toggle** checkbox (demo: shows a fake 6-digit OTP input step, auto-fills "123456", proceeds).  
- **Remember Me** checkbox.  
- **Forgot Password** link (shows a toast "Reset link sent to your mobile").  
- **Demo Access** button — pre-fills credentials per active tab.  
- On submit → navigate to role-appropriate home:
  - Citizen → `/dashboard`
  - Officer → `/officer`
  - Super Admin → `/superadmin`
- Security badges at bottom: "Role-based access · OTP & 2FA · Encrypted sessions".

### 4. `LandingPage.tsx` — content update

Replace hero copy, feature cards, and step descriptions with the content from the brief:
- Hero headline: "Bangladesh's Digital Bridge Between Citizens and Government"
- Bengali sub-headline
- Three primary function cards: Issue Reporting, Civic Engagement, E-Services Hub
- User journey: 4 steps (Account → Verify → Act → Track)
- Stats: complaints resolved, active citizens, verified accounts
- Announcement type chips demo: Emergency / Maintenance / Celebration
- Real-world social proof quotes (fabricated but plausible: street light tracking, policy suggestion)
- CTA → Register / Login

### 5. `DashboardPage.tsx` — expanded sections

Add to existing layout (do not remove existing KPI cards or quick actions):
- **Emergency Alert Banner** (top, conditional — shown when any ANNOUNCEMENT has type "emergency"): red/amber strip with direct action button "Get Help"
- **Language Toggle** (top-right of greeting row): EN / বাং pill toggle, reads from AuthContext
- **Announcements strip**: horizontal scroll of 3–4 categorised announcement chips below KPIs
- **E-Services Shortcuts row**: 6 icon+label buttons (NID, E-Passport, Land Record, Tax, Utility Bills, Police Clearance) → navigate to `/services`
- **Community Discussions preview**: 3 most recent approved discussions from DISCUSSIONS with like counts, "View all" → `/discussions`
- Keep existing Recent Activity + Gamification columns below

### 6. `ServicesPage.tsx`

- Search bar filters by service name
- Category tabs: All / Identity & Civil Status / Business & Licensing / Financial & Property / Public Services
- Service cards (12 total): icon, name, nameBn, description, "Access Service →" button (shows toast "Redirecting to official portal…")
- "Officer-curated" badge on services with `officerAdded: true`
- Language toggle in page header

### 7. `DiscussionsPage.tsx`

- Search (filters title/body), sort tabs: Latest / Trending / Most Liked
- Pinned posts always first
- Category filter chips: All / Infrastructure / Transportation / Governance / Health / Education / Environment
- Each discussion card: author avatar initials, title, category badge, body excerpt, like count, comment count, date
- **Submit Discussion** button → modal with Title + Category + Description fields → on submit: adds to local state with `status: "pending"`, shows toast "Submitted for review — visible after officer approval"
- Pending submissions only visible to the submitting citizen (filtered client-side)

### 8. `SuggestionBoxPage.tsx`

- Suggestion list: net vote count (large, coloured), title, body excerpt, status badge, author, date
- Sort by: Top Voted / Latest / Status
- Vote buttons: ▲ upvote / ▼ downvote per suggestion (one vote per user, toggle)
- Status badges: Submitted (grey) / Under Review (amber) / Accepted (blue) / Implemented (green) / Declined (red)
- **New Suggestion** button → inline form: Title + Idea Description → submit adds to local state, status "Submitted"

### 9. `OfficerDashboardPage.tsx` (route `/officer`)

Officer sees a dedicated workspace (uses AppShell with officer-specific sidebar items):
- **Sidebar items for Officer**: Overview, Approval Queue, Add Poll, Add Service, My Polls
- **Overview tab**: KPI cards — Pending Approvals, Active Polls, Services Added, Citizens Helped
- **Approval Queue tab**: lists all pending Discussions + Suggestions with Approve / Reject buttons → updates status in shared state (simulated with useState lifted or passed via mock store)
- **Add Poll tab**: form (Question, Area, Options ×4, Close Date) → submit adds to POLLS array, shows toast
- **Add Service tab**: form (Name, Category, Description, URL) → submit adds to SERVICES with `officerAdded: true`
- **My Polls tab**: table of polls the officer created, with vote count and status

### 10. `SuperAdminPage.tsx` (route `/superadmin`)

Super Admin sees 4 tabs:
- **Overview**: total users, complaints, discussions, suggestions, pending approvals — all summary numbers
- **User Management**: table of MANAGED_USERS — Name, Role, Status, Joined, Complaints, Points — with action dropdown per user: Suspend (7d / 30d) / Ban / Restore; banned rows show red background, suspended show amber
- **All Content**: table of all discussions + suggestions across all citizens, filterable by status, with Approve/Reject/Delete actions
- **Officer Management**: list of all officers, ability to add/remove officer role (toggle), usage stats

### 11. `AppShell.tsx` — role-aware navigation

Three nav configurations depending on `role`:

**Citizen** (existing + new):
Dashboard · My Complaints · File Complaint · Polls · Discussions · Suggestion Box · Services · Achievements · Profile

**Officer** (new sidebar):
Overview · Approval Queue · Add Poll · Add Service · My Polls · Profile

**Super Admin** (new sidebar):
Overview · User Management · All Content · Officer Management · Profile

AppShell reads `role` from `AuthContext` and renders the matching nav. The "Admin Dashboard" entry currently shown when role="admin" is replaced by the Officer/SuperAdmin sidebar systems.

### 12. `App.tsx` — new routes

```
/services          → ServicesPage
/discussions       → DiscussionsPage
/suggestions       → SuggestionBoxPage
/officer           → OfficerDashboardPage
/superadmin        → SuperAdminPage
```
All inside the `<AppShell>` wrapper.

---

## State management note

Discussions, Suggestions, and Polls that Officers add/approve need to be visible to Citizens. Since this is all client-side, lift the mutable arrays into `AuthContext` (or a sibling `DataContext`) so Officer writes are reflected in Citizen reads within the same session.

Add a `DataProvider` wrapping `App` that holds:
```ts
discussions: Discussion[]   — starts from DISCUSSIONS mock
suggestions: Suggestion[]   — starts from SUGGESTIONS mock
polls: Poll[]               — starts from POLLS mock
services: Service[]         — starts from SERVICES mock
```
Any page can call `useData()` to read or mutate. This replaces the local-state approach in PollsPage (currently holds polls in useState from the static import).

---

## Verification

1. `/login` — switch tabs Citizen/Officer/Admin; demo button fills credentials; OTP step appears when toggled; each role navigates to correct home
2. `/` — real copy renders, journey steps correct, announcement type chips visible
3. `/dashboard` (Citizen) — emergency banner shows, language toggle switches EN/বাং label, e-services row links to `/services`, discussions preview shows approved only
4. `/services` — 12 services render, category tabs filter, officer-curated badge visible
5. `/discussions` — submit a discussion → pending state shown only to submitter; approved ones visible to all
6. `/suggestions` — vote up/down, net count updates, one vote enforced; submit new suggestion
7. `/officer` — approve a pending discussion → it moves to approved, appears in citizen `/discussions`; add a poll → appears in citizen `/polls`
8. `/superadmin` — suspend a user (status changes), ban a user (row turns red), approve content

---

## Context (Phase 1 — original) (`nagorik-setu-ui-design.txt`) describing 11 pages of a Bangladeshi civic-tech platform called **OpenGovtBD** (Nagorik Setu). The current `App.tsx` only has the landing page. The goal is to expand this into a fully navigable multi-page SPA — all client-side with mock data, minimal aesthetic, bilingual (English + Bengali), using the civic green design system already established.

---

## Architecture

Use **React Router v7** (already installed as `react-router@7.13.0`) for client-side routing. All pages live in `src/app/pages/`. Shared components in `src/app/components/`. Mock data centralized in `src/app/data/mockData.ts`. `App.tsx` becomes the router entry point only.

```
src/app/
  App.tsx                   ← BrowserRouter + Routes setup
  data/
    mockData.ts             ← All mock complaints, polls, badges, users
  components/
    AppShell.tsx            ← Authenticated layout: sidebar + topbar
    StatusBadge.tsx         ← Reused status badge (Submitted/Review/Progress/Resolved/Rejected)
  pages/
    LandingPage.tsx         ← Existing landing content, moved here
    LoginPage.tsx
    RegisterPage.tsx
    DashboardPage.tsx
    ComplaintFormPage.tsx
    ComplaintListPage.tsx
    ComplaintDetailPage.tsx
    PollsPage.tsx
    AchievementsPage.tsx
    AdminPage.tsx
    ProfilePage.tsx
    NotificationsPage.tsx
```

---

## Routes

| Path | Component | Layout |
|---|---|---|
| `/` | LandingPage | None (full-page) |
| `/login` | LoginPage | None |
| `/register` | RegisterPage | None |
| `/dashboard` | DashboardPage | AppShell |
| `/complaints` | ComplaintListPage | AppShell |
| `/complaints/new` | ComplaintFormPage | AppShell |
| `/complaints/:id` | ComplaintDetailPage | AppShell |
| `/polls` | PollsPage | AppShell |
| `/achievements` | AchievementsPage | AppShell |
| `/admin` | AdminPage | AppShell |
| `/profile` | ProfilePage | AppShell |
| `/notifications` | NotificationsPage | AppShell |

Auth is simulated: clicking Login/Register navigates directly to `/dashboard`. A `useAuth` context holds `{ role: "citizen" | "admin" }` so admin users see extra sidebar item. Role can be toggled in Profile & Settings.

---

## Page-by-page plan

### AppShell (`components/AppShell.tsx`)
- Left sidebar (240px, collapsible on mobile): logo, nav items (Dashboard, My Complaints, File Complaint, Polls, Achievements, Admin [role-gated], Profile)
- Top bar: page title, bell icon (Notifications dropdown using Radix Popover), user avatar → Profile
- Active route highlighted in sidebar with green accent
- Role badge in sidebar footer: "Citizen" or "Admin Officer"

### LandingPage
- Move existing landing content from `App.tsx` here, unchanged
- "Login" → `/login`, "Register" → `/register`, "File a Complaint" → `/login`

### LoginPage / RegisterPage
- Floating-label inputs (CSS `has()` selector trick or controlled state for label lift)
- Password field with show/hide toggle + strength meter (4-segment bar: Weak/Fair/Good/Strong)
- Role toggle (Citizen / Officer) on Register
- Inline validation states on blur
- Submit → navigate to `/dashboard`

### DashboardPage
- KPI row: 4 cards — My Complaints (8), Resolved (5), Pending (2), Civic Points (1,240)
- Quick actions: "File a Complaint" button → `/complaints/new`, "Vote in Active Poll" → `/polls`
- Recent Activity feed: last 5 complaint status changes (from mock data), timestamped
- Gamification snippet: progress bar toward next badge ("Civic Champion" — 760/1000 pts), 3 most recent badges earned

### ComplaintFormPage (multi-step)
- Step 1: Category dropdown + location field
- Step 2: Description textarea + photo upload area (drag/drop UI, no real upload — shows placeholder thumbnails)
- Step 3: Review & Submit
- Progress indicator at top (3 steps, green fill)
- Submit → show success toast (using `sonner`) → navigate to `/complaints`

### ComplaintListPage
- Search input (debounced filter on mock data)
- Filter chips: All / Submitted / Under Review / In Progress / Resolved / Rejected
- Table: ID, Title, Category, Location, Date, Status badge, Actions (View)
- Pagination (5 per page, mock 12 entries)
- Empty state when filters return nothing

### ComplaintDetailPage
- Vertical timeline (same component style as landing hero demo but full-page)
- Officer notes section (read-only text blocks)
- Citizen comment thread at bottom (add comment textarea + submit, stored in local state)
- Back button → `/complaints`

### PollsPage
- Tab bar: Active Polls / Past Polls
- Active: 3 poll cards with vote buttons; clicking a bar option reveals results (bar chart via recharts or CSS bars)
- Past: archive of 4 closed polls with final results shown
- After voting, card flips to results view

### AchievementsPage
- Points total at top: "1,240 Civic Points" with Bengali label
- Badge gallery grid (3×3): 5 unlocked (green border + icon), 4 locked (gray, blurred icon, progress tooltip)
- Leaderboard table: rank, avatar initials, name, district, points — 10 rows, current user highlighted

### AdminPage
- Date range filter bar + district/area select
- KPI row: Total Complaints, Resolved, Pending, Avg. Response Time
- Line chart (recharts `LineChart`): complaint volume last 30 days
- Bar chart (recharts `BarChart`): complaints by category (6 categories)
- Officer performance table: Name, Assigned, Resolved, Avg. days, Rating bar

### ProfilePage
- Avatar circle with initials + "Upload photo" button (no real upload)
- Personal info form: Name, Email, Phone, NID, District (all editable)
- Notification toggles (using Radix Switch): Email alerts, SMS alerts, In-app badges
- Language switch: English / Bengali (updates a `lang` context atom stored in useState)
- Change password section: current + new + confirm fields
- Role toggle for demo: "Switch to Admin view" button → changes role in context

### NotificationsPage
- Grouped by type: Complaint Updates, Poll Reminders, Badges Earned
- Each notification: icon, title, timestamp, read/unread dot
- "Mark all as read" button
- Bell icon in TopBar shows unread count badge (3)
- Radix Popover flyout shows last 5 notifications with "View all" link → `/notifications`

---

## Mock Data (`data/mockData.ts`)

Export:
- `COMPLAINTS`: 12 complaints with id, title, category, status, location, dates, timeline, officerNotes, comments
- `POLLS`: 7 polls (3 active, 4 past) with options and vote counts
- `BADGES`: 9 badges with name, description, icon name, unlocked status, progress
- `LEADERBOARD`: 10 users
- `NOTIFICATIONS`: 10 notifications with type, read status, timestamp
- `ADMIN_STATS`: complaint volume time series, by-category breakdown, officer table

---

## Design tokens (no changes to theme.css)

All pages use the already-established tokens:
- Primary green: `#059669` / `#047857`
- Navy: `#0f172a`
- Slate muted: `#64748b`
- Borders: `#e2e8f0`
- Fonts: Plus Jakarta Sans (headings), Noto Sans Bengali (Bengali text)
- Card radius: `rounded-2xl` (24px)
- Status colors: amber (pending), blue (submitted), orange (in-progress), green (resolved), red (rejected)

---

## Current Progress

**Done:** `mockData.ts`, `StatusBadge.tsx`, `AuthContext.tsx`, `AppShell.tsx`, `LandingPage.tsx`, `LoginPage.tsx`, `RegisterPage.tsx`, `DashboardPage.tsx`, `ComplaintFormPage.tsx`, `ComplaintListPage.tsx`, `ComplaintDetailPage.tsx`, `PollsPage.tsx`

**Remaining (this session):**
1. `src/app/pages/AchievementsPage.tsx`
2. `src/app/pages/AdminPage.tsx`
3. `src/app/pages/ProfilePage.tsx`
4. `src/app/pages/NotificationsPage.tsx`
5. `src/app/App.tsx` — replace with BrowserRouter + Routes wiring all 12 pages

---

## Verification

1. Navigate to `/` — landing page loads, CTAs link to `/login` and `/register`
2. Click Register → floating-label inputs work, password strength meter updates, submit goes to `/dashboard`
3. Dashboard loads with KPI cards, activity feed, gamification bar, quick actions work
4. File Complaint: all 3 steps navigate correctly, submit shows toast, redirects to `/complaints`
5. Complaint list: search and filter chips narrow the table, pagination works
6. Click a complaint → detail page shows timeline, can add comment
7. Polls: vote on an active poll → results animate in
8. Achievements: badges show locked/unlocked, leaderboard renders
9. Admin: charts render via recharts, table loads
10. Profile: toggles work, role switch changes sidebar
11. Bell icon: popover shows last 5 notifications, links to full page
