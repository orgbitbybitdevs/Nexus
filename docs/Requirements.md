# Strategic Web Architecture — BitByBit Academy Nexus 🌐

> **Document ID:** BBA-2026-W1
> **Version:** 1.1.0
> **Status:** `PROPOSED`
> **Lead Architect:** Jose (deepdevjose)
> **Last Revised:** 2026-03-28
> **Organization:** BitByBit Academy

---

## 🏛️ Executive Summary

This document defines the requirements for the **Nexus** — BitByBit Academy's centralized web platform. The goal is to transition from a repository-centric model to a professional, high-performance institutional gateway that serves researchers, students, and international partners.

GitHub remains the laboratory and source of truth. Nexus functions as the **public-facing face of the Academy**: a structured environment for knowledge dissemination, portfolio presentation, and research outreach.

---

## 📌 Scope

### In Scope
- Public-facing institutional website with static rendering
- Knowledge base and structured learning roadmaps
- Research portfolio (projects, internacional stays, publications)
- Institutional identity page with contact point
- CI/CD pipeline via GitHub Actions
- Light and dark mode theming

### Out of Scope
- User authentication or accounts
- Real-time backend or database
- E-commerce or payments
- Mobile native apps (iOS / Android)
- Internal tooling or admin dashboards

---

## 🛠️ Technical Stack

Chosen for **performance, maintainability, and alignment with a content-heavy, documentation-first model**:

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Framework** | **Astro.js** | Zero-JS-by-default, ideal for content-heavy sites. Superior Lighthouse scores vs. Next.js for static content. |
| **Styling** | **Tailwind CSS** | Utility-first precision control. Pairs well with Astro's component model. |
| **Deployment** | **Vercel / GitHub Pages** | Seamless CI/CD via GitHub Actions. Preview deploys on every PR. |
| **Content** | **Markdown / MDX** | Enables technical writing with LaTeX support, code blocks, and embedded components. |
| **Version Control** | **GitHub (orgbitbybitdevs)** | Single source of truth. Docs-as-code model. |

> **Alternatives Considered:** Next.js (rejected — SSR overhead for a static site), Hugo (rejected — Go templating is less ergonomic for this team), Docusaurus (rejected — opinionated layout limits design control).

---

## 📋 Functional Requirements

### FR-01 — Home Page (The Terminal)
- **FR-01.1** Display a high-contrast hero section with the Academy logo and a "System Status: Operational" indicator.
- **FR-01.2** Render a Mission Statement section describing the Academy's commitment.
- **FR-01.3** Display live-fetched or pre-rendered stats (e.g., active repositories, research projects count) sourced from the GitHub API at build time.
- **FR-01.4** Provide clear navigation to all major sections.

### FR-02 — Knowledge Base (Learning Roadmaps)
- **FR-02.1** Curate structured learning paths (e.g., *Path to AI Mastery*, *VEX Engineering Fundamentals*).
- **FR-02.2** Each path must include: title, description, estimated duration, difficulty level, and an ordered list of resources.
- **FR-02.3** Render Markdown/MDX content with syntax-highlighted code blocks and embedded diagrams.
- **FR-02.4** Support LaTeX rendering for mathematical content.
- **FR-02.5** Provide a search/filter mechanism for navigating guides.

### FR-03 — Research Lab (Portfolio)
- **FR-03.1** Showcase featured projects with title, description, tech stack, status badge, and links to GitHub repo / live demo.
- **FR-03.2** Include dedicated entries for: **HelioSync**, **RepairSuite**, and AI vision models.
- **FR-03.3** Maintain a dedicated **XJTLU Chronicle** subsection for the Suzhou international research stay, including a timeline, photos, and academic outputs.
- **FR-03.4** Support embedding of academic publications or links to external papers (IEEE, arXiv, etc.).

### FR-04 — Registry (About / Contact)
- **FR-04.1** Present the Academy's history, philosophy, and organizational structure.
- **FR-04.2** Display a lead researcher profile with professional links (GitHub, LinkedIn, ORCID if applicable).
- **FR-04.3** Provide a lightweight contact mechanism (email link or static contact form using a serverless provider like Resend/Formspree).

### FR-05 — Global Features
- **FR-05.1** Implement a dark/light mode toggle persisted via `localStorage`.
- **FR-05.2** Provide a full-text site search (static, using Pagefind or Fuse.js).
- **FR-05.3** Include an RSS feed for the Knowledge Base and Research Lab sections.
- **FR-05.4** Generate a `sitemap.xml` automatically at build time.

---

## 🔒 Non-Functional Requirements

### Performance
- **NFR-P1:** Achieve a **Lighthouse Performance score ≥ 95** on desktop and ≥ 90 on mobile.
- **NFR-P2:** Largest Contentful Paint (LCP) < **2.5s** on a simulated 4G connection.
- **NFR-P3:** Total page weight (HTML + CSS + JS) on initial load < **150 KB** (uncompressed).
- **NFR-P4:** Images must be served in **WebP/AVIF** format with appropriate `srcset` attributes.

### Accessibility
- **NFR-A1:** Conform to **WCAG 2.1 Level AA** standards across all pages.
- **NFR-A2:** All interactive elements must be keyboard-navigable and have visible focus states.
- **NFR-A3:** All images must include meaningful `alt` text.
- **NFR-A4:** Color contrast ratio ≥ **4.5:1** for body text and ≥ **3:1** for large text / UI components.

### SEO
- **NFR-S1:** Every page must have a unique `<title>` and `<meta name="description">`.
- **NFR-S2:** Structured data (`application/ld+json`) must be implemented for Organization and Article schemas.
- **NFR-S3:** All URLs must be human-readable slugs (e.g., `/research/heliosync`).

### Maintainability
- **NFR-M1:** All content (guides, projects, research entries) must be editable via Markdown files — no code changes required for content updates.
- **NFR-M2:** The codebase must follow a documented component structure and naming convention.
- **NFR-M3:** New pages or sections must be addable without modifying core layout components.

---

## 📐 Site Structure (Sitemap)

```
/ (Home — The Terminal)
├── /learn                  (Knowledge Base)
│   ├── /learn/[roadmap-slug]
│   └── /learn/[roadmap-slug]/[guide-slug]
├── /research               (Research Lab)
│   ├── /research/[project-slug]
│   └── /research/xjtlu     (XJTLU Chronicle)
├── /about                  (Registry)
└── /search                 (Global Search)
```

---

## 🎨 Design Philosophy: "Digital Brutalism & Clarity"

- **Color Palette:** Navy Blue (`#0A1628`) and Crisp White (`#F5F5F5`) as primary. Accent: Electric Cyan (`#00C2FF`) for interactive elements.
- **Typography:**
  - Headings: High-legibility Serif (e.g., *Playfair Display* or *Lora*) — Academic tone.
  - Code & Data: Monospaced (e.g., *JetBrains Mono* or *Fira Code*) — Engineering precision.
  - Body: Clean Sans-Serif (e.g., *Inter*) — Readability at scale.
- **Motion:** Minimal and purposeful. No decorative animations. Transitions limited to ≤ 200ms for state changes. `prefers-reduced-motion` must be respected.
- **Layout:** Content-first. Information density over visual fluff. Structural hierarchy is the primary navigational tool.

---

## 📈 Roadmap & Acceptance Criteria

### Phase I — Foundation
**Goal:** Deployable landing page with CI/CD pipeline live.
- [ ] Astro project initialized with Tailwind and MDX support.
- [ ] Home page rendered with hero, mission, and stats sections.
- [ ] Deployment pipeline connected (Vercel / GitHub Pages).
- [ ] Lighthouse score ≥ 95 on the home page.

### Phase II — Documentation
**Goal:** Knowledge Base operational with at least 2 learning paths.
- [ ] `/learn` index page with path cards.
- [ ] Minimum 2 complete learning paths migrated from GitHub Wiki.
- [ ] Code syntax highlighting and LaTeX rendering functional.
- [ ] Full-text search operational (Pagefind or equivalent).

### Phase III — Research
**Goal:** Portfolio and XJTLU Chronicle live.
- [ ] `/research` index with project cards for HelioSync, RepairSuite, and AI vision models.
- [ ] XJTLU Chronicle page with timeline and publications.
- [ ] RSS feed generated for research entries.

### Phase IV — Polish
**Goal:** Feature-complete, WCAG 2.1 AA conformant, production-ready.
- [ ] Dark/light mode toggle with `localStorage` persistence.
- [ ] WCAG 2.1 AA audit passed (axe-core or Lighthouse Accessibility ≥ 95).
- [ ] `sitemap.xml` and structured data verified by Google Rich Results Test.
- [ ] Contact form or email link functional.

---

**BitByBit Academy | Nexus Project | 2026**