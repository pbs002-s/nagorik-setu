# Nagorik Setu (নাগরিক সেতু) — Premium UI/UX Redesign System
### Master Prompt + Design Reference for Spring Boot 3 + Thymeleaf

---

## 0. HOW TO USE THIS FILE

This document is both:
1. **A prompt** — paste the whole thing (or the relevant section) into Claude/an AI coding tool when asking it to restyle a specific page or component.
2. **A living reference** — the single source of truth for colors, spacing, components, and rules so every page stays consistent even across many separate prompting sessions.

Your original sample prompt was written for a React + GSAP single-page app. Nagorik Setu is **server-rendered Thymeleaf**, so every "component" here is a **Thymeleaf fragment**, every "route" is a **Spring `@Controller` mapping + template**, and "motion" means **CSS transitions/animations + small vanilla-JS**, not a JS animation library tied to component mount/unmount. That distinction matters — most generic AI design prompts quietly assume a client-side framework and produce code that won't wire up correctly in a multi-page server app. This one is corrected for that.

---

## 1. ROLE

Act as a **Principal Product Designer + Senior Frontend Engineer** specializing in premium civic-tech, GovTech, and enterprise dashboard design — quality bar equivalent to Stripe, Linear, Vercel, Notion, Mercury, Ramp, and Apple's Human Interface standards, adapted for a **government citizen-services platform**, not a consumer fintech app.

## 2. MISSION

Transform Nagorik Setu's existing frontend into a world-class, trustworthy, premium civic platform — **without touching**:
- Spring Boot controllers, `@RequestMapping`/`@GetMapping`/`@PostMapping` signatures
- Service layer / business logic
- JPA entities, repositories, DB schema
- Spring Security config, authentication/session/JWT flow
- Thymeleaf model attribute names (`th:each`, `th:text`, `th:field` bindings)
- Form `th:action` targets, CSRF token hidden inputs
- Any REST endpoint used by JS (fetch/AJAX calls to `/api/...`)

**Only the presentation layer changes**: HTML structure inside templates, CSS, static JS for interactivity/animation, and Thymeleaf fragment organization (which is safe to refactor as long as `th:replace`/`th:insert` targets and model attribute names stay the same).

---

## 3. NON-NEGOTIABLE CONSTRAINTS (Spring/Thymeleaf-specific)

| Do NOT touch | Why |
|---|---|
| `th:field="*{...}"` bindings on form inputs | Breaks form-to-DTO binding |
| `th:action` on `<form>` | Breaks controller routing |
| Hidden `_csrf` input / `th:action` CSRF token | Breaks Spring Security CSRF validation |
| Model attribute names in `th:text`, `th:each`, `th:if` | Breaks data rendering |
| `layout:decorate` / `th:replace` fragment paths | Breaks page composition |
| `/api/**` fetch URLs in existing JS | Breaks AJAX calls (polls voting, complaint status updates, gamification points) |
| Static resource folder structure (`/static/css`, `/static/js`, `/static/images`) unless updating `application.properties` resource handlers accordingly | Breaks asset serving |
| Role-based `sec:authorize` tags | Breaks role-gated UI (Citizen / Admin / Officer dashboards) |

**Safe to change freely**: HTML markup inside fragments, CSS (new stylesheet architecture), vanilla JS for UI behavior (accordions, modals, tabs, toasts, chart rendering), Thymeleaf fragment file organization (as long as call sites still resolve), icon sets, spacing, typography, color tokens, component visual style.

---

## 4. BRAND POSITIONING

Nagorik Setu is a **government citizen-engagement platform**, not a private fintech product. The design should communicate:

- **Trust & authority** — this is official, not a startup landing page
- **Clarity over cleverness** — citizens of varying digital literacy must navigate it easily
- **Warmth, not coldness** — approachable civic service, not intimidating bureaucracy
- **Bangladeshi context** — Bengali/English bilingual support, culturally appropriate imagery, no imported Silicon Valley visual clichés (no random abstract 3D blobs, no stock "diverse team high-fiving" photos)

Use a **"Digital Government / Public Trust" palette** — closer to a national digital-ID or e-governance portal aesthetic than a crypto dashboard, while still being visually premium and modern (2026-grade, not 2015 government-portal-grade).

---

## 5. VISUAL IDENTITY

### 5.1 Color System

```
Primary Green (Bangladesh civic accent)   #059669   — trust, growth, official green
Deep Green                                 #047857   — hover/active states
Primary Blue (institutional)               #1d4ed8   — links, informational actions
Navy                                       #0f172a   — headers, dark surfaces
Slate 950                                  #020617   — dark mode base (never pure black)
Slate 500                                  #64748b   — secondary text
Slate 200                                  #e2e8f0   — borders, dividers
Cyan Accent                                #67e8f9   — data viz / AI-insight highlights
Amber (status: pending)                    #d97706
Red (status: rejected/urgent)              #dc2626
Emerald (status: resolved)                 #059669
```

Status colors map directly to complaint lifecycle states (Submitted → In Review → In Progress → Resolved / Rejected) — keep this mapping consistent across every dashboard, badge, table row, and timeline component.

### 5.2 Typography

- Primary: **Inter** (Latin) — weights 400/500/600/700
- Bengali text: **Noto Sans Bengali** (Inter doesn't cover Bengali glyphs) — must be loaded as a fallback/paired font for any `lang="bn"` content, dashboards, form labels, complaint descriptions
- Headings: large, negative letter-spacing (-0.02em), tight but readable line-height
- Body: calm, 1.5–1.6 line-height, comfortable for civic-literacy range of users
- Buttons: semi-bold, normal case (avoid all-caps for Bengali — uppercase doesn't apply to Bengali script and looks broken; use uppercase + 4–6% letter-spacing only for Latin-script labels)
- Never assume Latin-only text will fit — Bengali strings run 20–40% longer; build fluid-width components, not fixed-width truncation

### 5.3 Layout

- 8px grid throughout
- Bento-style dashboard grids for: Citizen Dashboard, Admin Analytics Dashboard, Officer Queue view
- Asymmetrical two-column layouts where content warrants it (e.g., 1.35fr/1fr for complaint detail + activity timeline)
- Generous whitespace, but respect data density needs of admin/analytics screens — don't force airy spacing onto a table that needs to show 50 rows

### 5.4 Cards

- Radius: 24–28px (34px reads too playful/consumer for a gov platform — scale it down slightly)
- Light mode: white background, 1px `Slate 200` border, soft shadow (`0 1px 3px rgba(2,6,23,.06), 0 8px 24px rgba(2,6,23,.04)`)
- Dark mode: `Slate 900` surface, subtle green/blue glow border on hover, not full glassmorphism blur (blur-heavy glass reads as "trendy app," not "trustworthy institution" — use it sparingly, e.g., only on the navbar and modals)
- Hover: lift 2–4px, shadow deepens, no aggressive scale (max 1.01, not 1.02+ — subtlety matters more here than on a consumer product)

### 5.5 Buttons

- Radius: 12–14px (slightly less rounded than fintech-style pill buttons — reads more institutional)
- Primary: green or blue solid fill (not gradient-heavy — gradients on every button read "marketing site," not "government service")
- Secondary: outline or ghost
- Loading state: inline spinner, disable double-submit (important for complaint/vote forms to prevent duplicate submissions)
- Focus ring: 2px, high-contrast, WCAG-compliant — this matters more here than almost anywhere else, since accessibility compliance for gov-adjacent platforms should be taken seriously even as a portfolio project

---

## 6. MOTION SYSTEM (Thymeleaf-appropriate)

No React component lifecycle exists here, so motion must be driven by:

1. **CSS transitions/animations** for hover, focus, state changes — the default for 90% of interactions
2. **IntersectionObserver** (vanilla JS) for scroll-reveal on landing/marketing pages only
3. **Small vanilla JS modules** (one per concern: `toast.js`, `modal.js`, `tabs.js`, `chart-init.js`) loaded via `<script>` at the bottom of the relevant fragment or `layout.html`
4. **Chart.js or a lightweight canvas library** for admin analytics — loaded via CDN or bundled, initialized on `DOMContentLoaded`, re-initialized manually if content is swapped via AJAX (e.g., date-range filter on analytics dashboard)

Rules:
- `cubic-bezier(.4,0,.2,1)` for all transitions
- Respect `prefers-reduced-motion` — disable non-essential animation for users who request it
- Never animate on page load in a way that delays perceived readiness of a complaint form or dashboard — motion decorates, it never gates usability
- Do not introduce GSAP or a heavy animation library unless truly justified (e.g., an elaborate landing-page hero) — keep the JS payload light since this is a civic-utility app, not a marketing showcase

---

## 7. PAGE-BY-PAGE SCOPE

For each page below: preserve every existing controller mapping, model attribute, and form binding. Only redesign structure/visuals per the system above.

1. **Public Landing Page** — hero explaining the platform's purpose, trust signals (govt affiliation, stats: complaints resolved, active citizens, response time), how-it-works section, CTA to register/login
2. **Auth (Login / Register)** — floating-label forms, inline validation, password strength meter, clear error states, role selection if applicable (Citizen/Officer/Admin)
3. **Citizen Dashboard** — KPI cards (my complaints, resolved, pending), recent activity feed, quick-action buttons (file complaint, vote in active poll), gamification snapshot (points, badge progress)
4. **Complaint Submission Form** — multi-step or single-page form with category selection, location picker, photo upload, progress indicator
5. **Complaint Tracking / Lifecycle View** — status timeline component (Submitted → Under Review → In Progress → Resolved/Rejected) with timestamps, officer notes, citizen follow-up thread
6. **Complaint List/Table (Citizen + Admin/Officer views)** — sticky header, sortable columns, status badges, search + filters, pagination, skeleton loading state, empty state
7. **Polls / Voting** — active poll cards, results visualization (bar/donut chart via Chart.js), vote confirmation state, past-polls archive
8. **Gamification** — points system, badge gallery, leaderboard table, progress rings toward next badge/level
9. **Admin Analytics Dashboard** — city/area heatmap or breakdown, complaint volume trends over time, resolution-time metrics, officer performance table, exportable reports
10. **Profile / Settings** — personal info, notification preferences, password change, language toggle (Bengali/English)
11. **Notifications** — dropdown + full notifications page, read/unread states, categorized by type (complaint update, poll reminder, badge earned)

---

## 8. COMPONENTS TO STANDARDIZE

Navbar (sticky, blurred on scroll) · Sidebar (role-aware, collapsible) · Cards · Data tables · Buttons (primary/secondary/ghost/danger) · Form inputs & floating labels · Dropdowns/selects · Badges (status + gamification) · Alerts/toasts · Modals · Timeline component · Charts (line/bar/donut) · Pagination · Search bar · Empty states · Loading skeletons · Footer

Every one of these should be a **reusable Thymeleaf fragment** (`fragments/components/*.html`) referenced consistently across all pages — this is the actual mechanism for "one design language across the whole app" in a server-rendered app; it's not automatic the way a shared React component is.

---

## 9. DARK MODE

- Toggle stored client-side (localStorage is fine here — it's not an artifact sandbox) or as a user preference persisted server-side if you want it to sync across devices
- Dark surfaces: `Slate 950` base, `Slate 900` cards, green/cyan glow accents on interactive elements only — not applied indiscriminately
- Never naively invert colors; redefine each token explicitly for dark mode

## 10. RESPONSIVENESS & ACCESSIBILITY

- Breakpoints: mobile (< 640px), tablet (640–1024px), desktop (1024–1440px), ultra-wide (1440px+)
- Admin/analytics-heavy pages should gracefully collapse dense tables into card-based views on mobile, not just shrink columns
- WCAG AA minimum: color contrast, keyboard navigation, visible focus states, ARIA labels on icon-only buttons, proper heading hierarchy, `alt` text on all uploaded complaint photos
- All interactive components (modals, dropdowns, tabs) must be keyboard-operable, not just mouse/touch

## 11. PERFORMANCE

- Lazy-load images (complaint photo uploads, landing page assets)
- Keep custom JS modular and small — avoid a single monolithic bundle for a multi-page server app; load only what each template needs
- Avoid layout shift: reserve space for charts/images before they load
- Debounce search/filter inputs on complaint and admin tables

---

## 12. DELIVERABLE EXPECTATIONS PER PAGE

For each template touched:
- [ ] Preserve every `th:` binding, model attribute, and form action exactly
- [ ] Apply the shared color/typography/spacing tokens (ideally as CSS custom properties in one root stylesheet, not hardcoded per-page)
- [ ] Extract repeated UI into fragments where not already done
- [ ] Add appropriate loading/empty/error states
- [ ] Verify keyboard + screen-reader usability
- [ ] Verify Bengali text renders correctly wherever `lang="bn"` content appears
- [ ] Confirm no controller/route/DB behavior changed

---

## 13. QUICK-USE PROMPT (copy-paste version)

> Redesign the `[PAGE/TEMPLATE NAME]` Thymeleaf template in Nagorik Setu using the design system in `design.md`: institutional-trust color palette (primary green #059669, blue #1d4ed8, navy #0f172a, slate scale), Inter + Noto Sans Bengali typography, 8px grid, 24–28px card radius, subtle shadows (no heavy glassmorphism), CSS-transition-based motion only (no GSAP), and the standardized fragment components (navbar, cards, tables, badges, forms). Preserve every `th:field`, `th:action`, CSRF token, model attribute name, and controller mapping exactly as-is — only change the HTML structure, CSS, and any purely front-end JS. Confirm role-based (`sec:authorize`) visibility stays intact. Output the updated template plus any new/updated fragment or stylesheet files.
