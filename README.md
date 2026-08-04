# OpenGovtBD — নাগরিক সেতু (Nagorik Setu)

**A Government Citizen Engagement Platform for Bangladesh.**

OpenGovtBD connects citizens, government officers, and administrators on a single platform for filing and tracking complaints, participating in civic polls and discussions, accessing e-services, and managing community suggestions — with full role-based dashboards for Citizens, Government Officers, and Super Admins.

---

## ✨ Features

### Citizen
- **Dashboard** — personal stats (complaints, resolved, pending, civic points), announcements, achievements, and quick access to every clickable stat card
- **Complaints** — file, track, and view the full status timeline of civic complaints
- **Polls & Voting** — vote in live civic polls by district
- **Discussions** — post discussion topics, comment on others' posts, like/unlike, and view any commenter's profile (unique ID, district, points, join date)
- **Suggestion Box** — submit and upvote/downvote civic improvement ideas
- **E-Services** — directory of government services (NID, e-Passport, Land Record, e-TIN, etc.)
- **Achievements** — gamified badges and civic points
- **Bilingual UI** — English / বাংলা toggle throughout

### Government Officer
- **Overview** — KPI cards (Pending Approvals, Active Polls, Services Added, Citizens Helped), each clickable to jump straight to that list
- **Approval Queue** — approve/reject pending discussions and suggestions
- **Add Poll** — publish new civic polls, instantly visible to all citizens
- **Add Service** — add new services to the citizen-facing E-Services directory
- **My Polls** — track live results for polls created
- **All Officer Functions** — a single findable index of every tool, so nothing is buried in tabs

### Super Admin
- **Overview** — platform-wide stats (citizens, officers, discussions, suggestions, pending content, banned/suspended/active users), each stat clickable and pre-filters the destination tab
- **User Management** — suspend, ban, or restore citizen accounts
- **All Content** — moderate discussions and suggestions across the platform
- **Officer Management** — manage officer accounts and permissions

### Platform-wide
- **Unique user IDs** for every account (citizen, officer, admin, or freshly generated on registration)
- **Back button** on every page
- **Ctrl+K quick-jump** command palette — search and jump to any page or function for your role instantly
- **Clickable profile cards** — click any name/avatar to see a citizen's public profile

---

## 🛠 Tech Stack

- **React 18** + **TypeScript**
- **Vite 6** — build tool and dev server
- **React Router 7** — client-side routing
- **Tailwind CSS 4** — utility-first styling
- **Radix UI** — accessible primitives (popover, dialog, etc.)
- **Lucide React** — icon set
- **Sonner** — toast notifications

> This is currently a front-end prototype with in-memory mock data (no backend/database yet). Refreshing the page resets state

---

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start the local dev server
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

```bash
# Build for production
npm run build
```

---

## 🔑 Demo Login Credentials

| Role        | Mobile Number  | Password     |
|-------------|----------------|--------------|
| Citizen     | 01700000000    | citizen123   |
| Officer     | 01800000001    | officer123   |
| Super Admin | 01900000099    | admin2024    |

(Use the "Fill demo credentials" option on the login screen, or enter these manually. 2FA demo OTP is `123456`.)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── App.tsx                 # Routes
│   ├── components/
│   │   ├── AppShell.tsx        # Sidebar, header, back button, command palette
│   │   ├── AuthContext.tsx     # Role, name, unique user ID, language
│   │   ├── DataContext.tsx     # Shared app state (discussions, polls, services…)
│   │   └── UserProfileModal.tsx
│   ├── data/
│   │   └── mockData.ts         # Seed data + types
│   └── pages/                  # One file per route (Dashboard, Complaints, Discussions,
│                                #  Polls, Suggestions, Services, Achievements, Profile,
│                                #  Officer*, SuperAdmin*, Login, Register, Landing…)
└── styles/
```

---

## 📜 License

Private prototype project — not for public distribution.

## 👥 Collaborators

- [Pronob Das](https://github.com/Pronob155)
- [Pritam Biswas](https://github.com/pbs002-s)
