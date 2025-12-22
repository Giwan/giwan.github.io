# Design & UX Consistency Fix Plan

This plan outlines the steps required to resolve the design inconsistencies,
visual glitches, and technical debt identified during the December 2025 audit.

## 1. Resolve Critical Visual Glitches

### A. Eliminate "Text Ghosting" on Articles [DONE]

- **The Problem:** View transitions are causing text to render twice with an
  offset.
- **Action:**
  - [x] Review `src/styles/accessibility-transitions.css` and remove manual
        `view-transition-name` assignments for landmarks if they are already
        handled by Astro's `transition:name`.
  - [x] Ensure that parent containers (like `main`) do not have the same
        transition names as their children on the same transition cycle.
  - [x] Set `contain: layout;` on elements with view transitions to prevent
        layout thrashing.

### B. Fix HTML Landmarks [DONE]

- **The Problem:** Nested `<main>` tags in `ArticlesList.astro` and
  `PageLayout.astro`.
- **Action:**
  - [x] Modify `src/components/ArticlesList.astro` and `ArticlesContainer.astro`
        to use a `<section>` or `<div>` instead of a `<main>` tag.
  - [x] Update aria-labels to ensure the primary layout
        `<main id="main-content">` is the unique entry point for screen readers.

## 2. Harmonize Design System & Typography

### A. Define `font-heading` [DONE]

- **The Problem:** `font-heading` is used but undefined.
- **Action:**
  - [x] Update `tailwind.config.js` to define `heading` in the `fontFamily`
        section (mapping it to `Merriweather`).
  - [x] Ensure all `@fontsource` imports in `BaseHead.astro` match the used
        weights (400, 700, 800, 900).

### B. Align Container Constraints [DONE]

- **The Problem:** Inconsistent `max-w-*` classes causing misaligned edges.
- **Action:**
  - [x] Choose a standard container width (`max-w-5xl` for content, `max-w-7xl`
        for shell).
  - [x] Apply this container class consistently across `Header.astro`,
        `Footer.astro`, and `PageLayout.astro`.

## 3. Unify Branding & Content

### A. Header Meta-Line Consistency [DONE]

- **The Problem:** Subtitle shift between Home and Article pages.
- **Action:**
  - [x] Standardize the `Header.astro` meta-row. Moved site description to a
        dedicated sub-header.
  - [x] Ensure `SITE_DESCRIPTION` is used consistently.

### B. Footer Visual Identity [DONE]

- **The Problem:** Missing "G1" logo in footer; mismatched link styles.
- **Action:**
  - [x] Add the `Logo.tsx` component to the footer to mirror the header
        branding.
  - [x] Standardize footer link colors to match the primary interaction color
        (hsl-primary) rather than muted gray.

## 4. Standardize Interactive UX

### A. Unify Hover States [DONE]

- **The Problem:** Four different hover patterns for links and cards.
- **Action:**
  - [x] Create a `@layer utilities` class for links (`.link-hover`) that applies
        a consistent transition and color shift.
  - [x] Update `More articles` and `Footer` links to share the same visual
        language.

### B. Theme Toggle Clarity [DONE]

- **The Problem:** Icon ambiguity and state lag.
- **Action:**
  - [x] Update `ThemeToggle.tsx` icons to represent the _mode to be activated_
        and add a clear ARIA label for the current state.
  - [x] Improve transition timing to prevent background "flicker".

## 5. Mobile Optimization

### A. Header Spacing [DONE]

- **The Problem:** Date and Issue info is too cramped on mobile.
- **Action:**
  - [x] Increase `gap` and `padding` in the `Header.astro` meta-row for screens
        `< 640px`.
  - [x] Stacked the meta-row items vertically on very small screens.

### B. Touch Target Separation [DONE]

- **The Problem:** Hamburger menu and Theme Toggle are too close.
- **Action:**
  - [x] Add explicit horizontal padding/gap between these controls in
        `Header.astro` mobile view to prevent accidental taps.

## 6. Documentation Cleanup [DONE]

- **Action:**
  - [x] Update `README.md` "Styling" section to accurately reflect the move from
        legacy hex variables to Tailwind-integrated HSL variables.
  - [x] Remove references to `tools.module.css` if the project has fully
        migrated to Tailwind.
