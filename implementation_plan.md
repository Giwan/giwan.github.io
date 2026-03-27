# Implementation Plan - Editorial Design Overhaul

## 1. Goal
Transform the blog from a standard technical site into a high-end, "personal and quirky" newspaper/magazine experience, similar to the aesthetic of Stripe Press.

## 2. Design Strategy
- **Visual Identity**: Use a "paper" color palette with off-white backgrounds and rich gray text.
- **Texture**: Apply a subtle global noise texture via an SVG filter to simulate paper grain.
- **Typography**: Shift to a serif-heavy design for readability and an editorial feel, using `prose-2xl` for article content.
- **Homepage Layout**: Replace the repetitive grid with a dynamic editorial layout featuring a "Big Story" and multi-column rows.
- **Interactive Elements**: Add sophisticated hover effects (grayscale-to-color transitions) and smooth page transitions.

## 3. Technical Changes
- **Global Styles**: Update `src/styles/global.css` with the new theme and SVG filter.
- **Homepage**: Overhaul `src/components/ArticlesList.astro` logic to support variable-width "editorial" slots.
- **Article Layout**: Update `src/layouts/BlogArticle.astro` with centered headers and improved spacing.
- **SEO & Content**:
    - Fix long-standing SEO issues (H1 tags in markdown, missing status fields).
    - Ensure all posts pass `npm run validate:blog-seo`.
- **Infrastructure**: Update `src/config.ts` with publication-style metadata (Issues, Volume).

## 4. Verification Plan
- **Unit Testing**: Ensure all 240+ existing tests pass.
- **Visual Verification**: Use Playwright to capture screenshots/videos of the new homepage and article layouts.
- **SEO Audit**: Run the project's internal SEO validation script and resolve all errors.
- **Build Verification**: Run a full production build (`npm run build`).
