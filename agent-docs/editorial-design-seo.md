# Editorial Design & SEO Patterns

This document outlines the design philosophy and technical implementation of the "High-End Editorial" theme (Stripe Press style) and the SEO strategies employed in this blog.

## Design Philosophy: High-End Editorial

The goal was to transform a standard developer blog into a premium digital publication. This aesthetic is characterized by tactile depth, classic typography, and a "physical media" feel.

### 1. Visual Identity & Color Palette
We use a warm, sophisticated HSL-based palette that mimics high-quality paper rather than a stark digital screen.

- **Background:** `hsl(36 33% 98%)` (Warm Cream/Off-white)
- **Primary Text:** `hsl(24 10% 10%)` (Deep Charcoal/Near-black)
- **Accents:** `hsl(30 10% 40%)` (Muted Bronze/Grey)
- **Borders:** `hsl(30 15% 90%)` (Subtle separation)

### 2. Tactile Texture (The Noise Filter)
To achieve the "Stripe Press" look, we apply a subtle SVG noise filter to the background. This creates a tactile, organic grain that breaks up flat digital surfaces.

**Implementation:**
An SVG `<filter>` is defined in the base layout, and applied via a pseudo-element on the body:
```css
body::before {
  content: "";
  position: fixed;
  inset: 0;
  z-index: 50;
  pointer-events: none;
  opacity: 0.015; /* Extremely subtle */
  background-image: url("data:image/svg+xml,..."); /* SVG Noise */
}
```

### 3. Typography Pairings
- **Serif (Headings & Body):** `Merriweather`. Provides authority and readability for long-form content.
- **Sans-Serif (UI & Metadata):** `Inter`. Provides clarity for navigation, dates, and technical details.
- **Scale:** High-contrast headings (H1/H2) with generous leading for better "air" on the page.

### 4. Component Layouts
- **Newspaper Grid:** The homepage uses a tiered grid that prioritizes the latest content while giving "issue-style" numbering to older posts.
- **Issue Metadata:** Every post is treated as an "Issue," adding a chronological editorial weight (e.g., "Issue #42").
- **Vertical Spacing:** Increased `margin` and `padding` to allow the content to breathe, similar to a physical magazine spread.

---

## SEO & Content Patterns

### 1. Frontmatter Requirements
Every blog post in `src/pages/blog/` must contain the following YAML frontmatter:

```yaml
layout: "../../../layouts/BlogArticle.astro"
title: "Article Title (30-70 characters)"
description: "Brief summary (120-160 characters)"
pubDate: 2024-05-20
createdDate: 2024-05-20
status: "published"
readTime: "5 min"
---
```

### 2. URL Permanence & Legacy Slugs
We prioritize **URL Permanence** over "clean" directory structures.
- **Legacy Formats:** We maintain slugs like `2020-1-16-css-grid` (using single digits for months/days where original).
- **Redirection:** If a path must change, a redirect must be added to `astro.config.ts`.
- **Slugs:** Astro automatically generates slugs based on file names. Avoid changing file names once published.

### 3. Automated Validation
The `npm run validate:blog-seo` script (running `scripts/check-blog-seo.js`) enforces:
- Minimum word counts (300+).
- Heading hierarchy (No H1s in Markdown content, as the layout provides the H1).
- Mandatory `alt` text for images.
- Presence of external links.

### 4. Component-Based SEO
The `<Head />` component in `src/components/` dynamically generates:
- Canonical URLs.
- OpenGraph (OG) tags for social sharing.
- Twitter Card metadata.
- Preload hints for critical fonts (`Merriweather`, `Inter`).
