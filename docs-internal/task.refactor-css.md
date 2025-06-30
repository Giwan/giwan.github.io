# Task: Refactor CSS

This document outlines the plan for refactoring the project's CSS to improve consistency, maintainability, and scalability, as mentioned in `IMPROVEMENTS.md`. The current design has some inconsistencies, and this refactoring aims to address that by adopting a more structured, utility-first approach with Tailwind CSS.

## 1. Goal

The primary goal is to refactor the existing CSS to use Tailwind CSS utility classes consistently across the entire application. This will create a more cohesive and maintainable design system.

## 2. Analysis of Current State

*   **Mixed Styles:** The project currently uses a combination of global CSS (`src/styles/global.css`, `src/styles/newspaper.css`) and component-scoped styles.
*   **Inconsistent Design:** There are visual inconsistencies in spacing, typography, and color usage throughout the application.
*   **Existing Tailwind CSS:** Tailwind CSS is already a dependency, but it is not applied uniformly across all components and pages.

## 3. Proposed Plan

### Phase 1: Foundation and Configuration

1.  **Audit Tailwind Configuration:** Review and update the `tailwind.config.js` file. Define a strict and consistent color palette, spacing scale, and typography settings that align with the project's desired design.
2.  **Establish Base Styles:** Consolidate all base styles into `src/styles/global.css`. Define default styles for common HTML elements (e.g., `body`, `h1`, `p`, `a`) using Tailwind's `@apply` directive to ensure a consistent baseline.

### Phase 2: Component-by-Component Refactoring

Refactor components systematically to replace custom CSS with the newly defined Tailwind utility classes.

**Priority List:**

1.  **Layouts:**
    *   `src/layouts/PageLayout.astro`
    *   `src/layouts/BlogArticle.astro`
2.  **Core Components:**
    *   `src/components/Header.astro`
    *   `src/components/Footer.astro`
    *   `src/components/ThemeToggle.tsx`
3.  **UI Components:**
    *   `src/components/ui/Button.astro`
    *   `src/components/ui/Card.astro`
4.  **Page-Specific Components:**
    *   `src/components/ArticlesList.astro`
    *   `src/components/ToolsList/`
    *   Components in `src/pages/`

### Phase 3: Cleanup and Verification

1.  **Remove Redundant CSS:** After refactoring, identify and remove unused CSS files and styles, particularly from `src/styles/newspaper.css`.
2.  **Cross-Browser Testing:** Thoroughly test the application across major browsers (Chrome, Firefox, Safari) and various screen sizes to ensure no visual regressions have been introduced.

## 4. Success Criteria

*   All custom CSS classes are replaced with Tailwind CSS utilities wherever feasible.
*   The application presents a consistent and polished look and feel.
*   The `src/styles/newspaper.css` file is either removed or significantly reduced in scope.
*   The project's styling is more maintainable, scalable, and easier for future development.
