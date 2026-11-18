# Executive Brief — Design, UX & UI Panel Review

**Subject:** `@giwan/blog` (G1 editorial publication)
**Date:** 2026-11-16
**Method:** Live rendering at 1440px and 390px (headless Chrome), plus source
review of layouts, components, design tokens, and the editorial design doc.

## Verdict

The "Stripe Press" editorial direction is a genuine differentiator worth
protecting — but it is currently **thin, inconsistent, and leaky**: the art
direction stops at typography, the design system contradicts itself on
radius/spacing/chips, and real usability defects exist in the two highest-traffic
surfaces (home grid, tools grid).

## Panel

### 🎨 Design Director — "The system has taste but no point of view on color or emphasis."

The palette is one-note monochrome. With no accent, everything competes equally:
date, byline, title, dek, "Read Article," and tags all render in near-black/grey.
A single restrained accent (an ink red or sepia) applied to links, rules, active
nav, and the "Read" affordance would create the hierarchy the layout is missing.
Also the stated philosophy says Merriweather headings/body — but headings render
in Inter extrabold while serif is reserved for decorative italics. Pick one and
commit.

### 🧭 UX Lead — "Findability and scanning are the weakest links."

The masthead printed **two dates that both derived from 'now'** plus a
**hardcoded `ISSUE 42`** that never incremented — the "issue" conceit ages into
noise. The tools grid was **visually ragged**: variable italic descriptions push
"Read More" and tags to different baselines, breaking the scan. Search is buried
in nav and its own page repeated the same instruction three times.

### 🧱 UI / Design-Systems Engineer — "The design system is fighting itself, and one flow has a maintenance time-bomb."

Six border radii coexisted (`full`, `lg`, `md`, `sm`, `none`, default). Chips
were rounded pills in one place, sharp in another. And the article list rendered
card markup **twice** — once in Astro, once as an `innerHTML` string in an inline
script — guaranteeing visual drift and an XSS/escaping hazard.

### ♿ Accessibility Specialist — "The biggest tap targets have no visible focus."

Each homepage card was one big `<a>` with no focus ring; the floating settings
gear overlaps content; 10px all-caps metadata with wide tracking is below the
practical legibility floor.

## Findings (with severity)

| # | Finding | Evidence | Sev |
|---|---------|----------|-----|
| 1 | Tools cards vertically misaligned — descriptions vary; "Read More"/tags don't share a baseline | `ToolItem.jsx` (no clamp; footer not bottom-pinned) | High |
| 2 | No visible focus on primary interactive targets | `ArticlesList.astro` `<a class="block h-full flex flex-col">` | High |
| 3 | Masthead dateline redundant + hardcoded issue number | `Header.astro` rendered `now` twice + `currentIssue: 42` | High |
| 4 | Duplicate card rendering via `innerHTML` | `ArticlesList.astro` inline `<script>` rebuilds markup | High |
| 5 | Radius / chip incoherence | `button.tsx` `rounded-md` vs chips `rounded-none` vs tags `rounded` | High |
| 6 | Art direction lacks an accent / emphasis system | All text near-monochrome; italic serif used decoratively | Med |
| 7 | Homepage grid has holes | 1 featured (span 6) + 2 (span 3) + 9 (span 2) leaves gaps | Med |
| 8 | Search UX repeats itself; orphan page outside the system | `search/index.astro` + standalone `search/results.astro` | Med |
| 9 | "More" button breaks the editorial language | Small centered pill vs. sharp ruled "Read Article →" | Med |
| 10 | Floating gear overlaps content | Multiple `fixed … z-50` overlays | Med |
| 11 | Mobile hamburger is a heavy black rounded square | `HamburgerButton.jsx` | Low |
| 12 | No article-to-article momentum | `BlogArticle.astro` footer = tags + "More articles" | Med |

## Prioritized roadmap

### P0 — This sprint (high impact, low effort)
1. Clamp tool descriptions and bottom-pin the footer → consistent baselines.
2. Unify the "chip/label" language to one sharp recipe.
3. Add `focus-visible` rings to article, tag, and category links.
4. De-duplicate the dateline; derive the issue number from published posts.
5. Remove the orphan `search/results.astro` (add a redirect).

### P1 — Next (medium effort)
6. Introduce one accent color; apply to links, rules, active nav, "Read".
7. Resolve typography philosophy (serif headings _or_ commit to sans).
8. Rebuild the homepage grid to eliminate holes.
9. Restyle "More"; add a header search trigger ("Search ⌘K").
10. Refactor article listing to a single renderer.
11. Add a related / next-article module.

### P2 — Later
12. Editorial imagery / illustration system (with a perf budget).
13. Reading progress + TOC for long articles.
14. Consolidate all floating `z-50` surfaces into one settings menu.
15. Raise all-caps metadata from 10px → 11–12px; audit tracking.

## Success metrics
- **A11y:** Lighthouse Accessibility ≥ 98; zero axe focus-visibility failures.
- **UX:** consistent tools-card heights; higher pages-per-session after the
  related-article module.
- **System health:** one source of truth for card markup; single radius scale.

## What NOT to change
The masthead, editorial type scale, noise texture, and issue-tagged card rhythm
are the brand. Every recommendation sharpens that direction — none require a
redesign.

## P0 implementation status (2026-11-16)

- [x] Tool descriptions clamped (`line-clamp-4`) and footer bottom-pinned —
      `ToolItem.jsx`.
- [x] Chip / label language unified to one sharp recipe; the `Badge`
      `rounded-full` leak removed from the tools cards.
- [x] `focus-visible` rings added to homepage cards, category links, and tags.
- [x] Masthead dateline de-duplicated; the ISSUE number is now derived from the
      count of published posts (no more hardcoded `42`).
- [x] Orphan `src/pages/search/results.astro` removed; `/search/results` →
      `/search/` redirect added in `astro.config.ts`.

Verified with a production build (redirect page + `ISSUE 45` present) and a
live desktop/mobile render.

## P1 implementation status (2026-11-16)

- [x] **Single accent colour** (`--color-editorial`, an ink vermillion) applied to
      the masthead rule, active nav, links (`.link-hover`), "Read Article",
      category/tag hover, and keyboard focus (`.focus-editorial`).
- [x] **Typography resolved** — Merriweather serif for display headings, Inter
      for UI / metadata; deks are no longer italicised by default.
- [x] **Critical font bug fixed** — the theme used Tailwind v3 names
      (`--font-family-*`), so under v4 no custom fonts (Merriweather / Inter /
      JetBrains Mono) were ever applied and `font-heading` was a no-op. Renamed to
      `--font-*`.
- [x] **Homepage grid hole-free** — 12 per page: featured + 2 secondary + 3×3.
- [x] **Single card renderer** — new `ArticleCard.astro`; "More articles" clones a
      `<template>` and sets text via `textContent` (no duplicated `innerHTML`).
- [x] **"More articles"** restyled as a full-width ruled control.
- [x] **Header search trigger** with a ⌘K hint plus a working Cmd/Ctrl+K shortcut.
- [x] **Related articles** module ("Continue Reading") added to every article.
- [x] **Accessibility fix** — `accessibility-transitions.css` referenced
      `hsl(var(--ring))`-style variables that were never defined, so its entire
      focus/contrast layer was inert. Added the expected channel variables; focus
      indicators now render site-wide (this is why the audit found "no focus").

Verified with a production build, `npx jest` (244 passed), and ESLint.

## P2 implementation status (2026-11-16)

- [x] **Reading progress** — accent bar at the top of every article, driven by
      the `scale` property so it survives the reduced-motion `transform: none`
      reset that is applied globally.
- [x] **Table of contents** — auto-generated from markdown `headings` (h2/h3),
      two-column, with an IntersectionObserver scroll-spy that highlights the
      current section.
- [x] **Floating surfaces de-conflicted** — the update notification and PWA
      error banner now stack above the accessibility FAB instead of overlapping
      it.
- [x] **Metadata legibility** — all-caps 10px labels raised to 11px.
- [x] **Editorial imagery system** — `ArticleCard` accepts an optional
      `heroImage`; cards render a lazy, fixed-ratio, grayscale→colour thumbnail
      when a post provides one (perf-budgeted: `loading="lazy"`,
      `decoding="async"`, intrinsic size to avoid CLS). No posts define one yet,
      so current output is unchanged — add `heroImage` to frontmatter to opt in.

## Dead-code removal (2026-11-16)

Removed the unused store-based article listing stack (unreferenced by any page
since `ArticlesList.astro` became the sole renderer): `ArticlesList.tsx`,
`ArticlesListWrapper.tsx`, `ArticlesLoadMore.tsx`, `ArticlesContainer.astro`,
`articleStore` / `articleService` (+ tests/mocks), `ToolsList/Tools.jsx`,
`ToolsList/FilterTools.jsx`, and `TransitionControls.astro`. Test suites went
from 25 → 20; all green.

## Follow-up polish (2026-11-18)

- **Search page** migrated to the editorial system: removed the redundant
  "Search Articles" card and the undefined `bg-paperDark`/`shadow-paper`
  wrapper, added a real serif `<h1>`, sharp input and accent focus. ⌘K no longer
  hijacks `/search`.
- **Accessibility controls** moved from a floating FAB (which overlapped
  content) into the footer and upgraded to a native `<dialog>`: real focus trap,
  Escape-to-close, `::backdrop`, and focus return. Content renders only when open
  to avoid an SSR/client hydration mismatch.
- **Mobile chrome** sharpened; the mobile menu is rendered through a portal so
  the `contain: layout` ancestors no longer trap its fixed overlay.
- **Dead code**: removed `stores/menuStore.js` and the unused `--paper`/`--ink`
  theme tokens.
