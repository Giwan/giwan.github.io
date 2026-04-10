# Framework Conversion Plan (v2)

This document outlines the comprehensive strategy for transforming this repository into a reusable Astro blog framework, enhanced with senior-level architectural considerations for long-term maintainability.

## 1. Centralized Configuration & Validation

To ensure the framework is robust, we will implement a centralized configuration system using **Zod** for schema validation. This provides both TypeScript types and runtime error checking.

### Configuration Schema (`src/schemas/config.ts`)
```typescript
import { z } from 'zod';

export const FrameworkConfigSchema = z.object({
  site: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    logoText: z.string().optional(),
    siteUrl: z.string().url(),
    lang: z.string().default('en'),
    social: z.record(z.string()).optional(),
  }),
  navigation: z.object({
    header: z.array(z.object({ label: z.string(), href: z.string() })),
    footer: z.array(z.object({ label: z.string(), href: z.string() })),
  }),
  features: z.object({
    enableSearch: z.boolean().default(true),
    enablePWA: z.boolean().default(true),
    enableToolsPage: z.boolean().default(false),
    enableRSS: z.boolean().default(true),
  }),
  theme: z.object({
    active: z.enum(['newspaper', 'minimal', 'modern']).default('newspaper'),
    overrides: z.record(z.string()).optional(),
  }),
  routing: z.object({
    homepage: z.enum(['blog', 'tools']).default('blog'),
  }),
  assets: z.object({
    favicon: z.string().default('/favicon.svg'),
    defaultHeroImage: z.string().default('/placeholder-social.jpg'),
    pwaIconsDir: z.string().default('/icons'),
  })
});

export type FrameworkConfig = z.infer<typeof FrameworkConfigSchema>;
```

## 2. Dynamic Routing & Feature Toggles

### Homepage Selection
- **Refactor `src/pages/index.astro`**: It will serve as a dynamic router. Based on `config.routing.homepage`, it will import and render the appropriate template (Blog or Tools).

### Disabling Routes
- **Astro Middleware**: Use middleware to redirect requests for disabled features (e.g., `/tools`) back to the homepage if `enableToolsPage` is false. This ensures a clean user experience even if URLs are directly accessed.

## 3. Advanced Theming System

- **Tailwind v4 Integration**: Use `@theme` blocks in `src/styles/global.css` to define base variables.
- **Dynamic CSS Injection**: In `PageLayout.astro`, inject a `<style>` block that maps `config.theme.overrides` to HSL variables. This allows users to tweak the theme without touching the CSS files.
- **Component-Level Theming**: Use `class-variance-authority` (CVA) in components to support different styles for different themes.

## 4. Asset Management

- Centralize all asset paths in the configuration.
- Provide a clear directory structure for user-provided assets (e.g., `public/user-assets/`) to avoid merge conflicts with framework updates.

## 5. Content Bootstrapping & "Clean" Script

To help users start fresh:
- **`npm run framework:clean`**: A script that removes the "Giwan" demo content (blog posts in `src/pages/blog` and data in `src/data`) while keeping the directory structure intact.
- **Placeholder Content**: Provide a "Hello World" template for the first blog post and a basic configuration.

## 6. Maintainability & Upstream Sync

- **Template Repository Strategy**: Mark the repo as a GitHub Template.
- **Upstream Sync Guide**: Provide documentation on how users can pull updates from the core framework into their forks using `git remote add framework`.
- **Decoupling Data**: Ensure all user-specific data (blog posts, tools data) is isolated from framework logic to minimize merge conflicts.

## 7. Implementation Roadmap

### Phase 1: Core Refactoring (Validation & Config)
- Implement Zod schemas.
- Update all components to pull from the validated config.

### Phase 2: Routing & Logic (Features & Homepage)
- Implement the dynamic `index.astro`.
- Add middleware for route guarding.

### Phase 3: Theming & Assets
- Finalize the multi-theme CSS architecture.
- Centralize asset handling.

### Phase 4: Developer Experience (Scripts & Docs)
- Create the `framework:clean` script.
- Write comprehensive "Quick Start" and "Upstream Sync" documentation.

## 8. Senior-Level Verification

- **Edge Case Testing**: Verify build behavior when features are toggled off.
- **Schema Validation**: Ensure the app fails gracefully with descriptive errors if the config is invalid.
- **Performance Audit**: Use Lighthouse to ensure that adding framework layers doesn't impact the current high performance (especially PWA and SSR).
