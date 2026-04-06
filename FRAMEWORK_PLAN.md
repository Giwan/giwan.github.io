# Framework Conversion Plan

This document outlines the comprehensive strategy for transforming this repository into a reusable Astro blog framework.

## 1. Centralized Configuration System

The core of the framework will be a robust, typed configuration file in `src/config.ts`.

### Configuration Schema
```typescript
export const FRAMEWORK_CONFIG = {
  site: {
    title: "My Custom Blog",
    description: "A blog built with the Astro Framework",
    author: "User Name",
    logoText: "MB", // Text-based logo override
    siteUrl: "https://example.com",
    lang: "en",
    social: {
      twitter: "handle",
      github: "repo",
      // ... other social links
    }
  },
  navigation: {
    header: [
      { label: "Blog", href: "/blog" },
      { label: "About", href: "/about" },
    ],
    footer: [
      { label: "Privacy Policy", href: "/privacy" },
    ]
  },
  features: {
    enableSearch: true,
    enablePWA: true,
    enableToolsPage: false,
    enableRSS: true,
  },
  theme: {
    active: 'newspaper', // Options: 'newspaper', 'minimal', 'modern'
    overrides: {
      primaryColor: "hsl(240 6% 10%)",
      backgroundColor: "hsl(36 33% 98%)",
      // Other HSL variables
    }
  },
  routing: {
    homepage: 'blog', // Options: 'blog', 'tools'
  }
};
```

## 2. Dynamic Routing and Homepage

To support choosing the landing page (Blog vs. Tools), we will implement a dynamic landing page logic.

- **Refactor `src/pages/index.astro`**: Instead of hardcoded components, it will read `FRAMEWORK_CONFIG.routing.homepage` and conditionally render either the `ArticlesList` or the `ToolsLanding`.
- **Global Feature Flags**: Components like `Search` and `ToolsList` will check `FRAMEWORK_CONFIG.features` before rendering or providing links.

## 3. Theming System

We will expand the current Tailwind v4 setup to support multiple themes.

- **Theme Presets**: Define multiple theme blocks in `src/styles/themes.css` (e.g., `.theme-newspaper`, `.theme-minimal`).
- **Dynamic Application**: The `PageLayout` will apply the selected theme class to the `<body>` or a wrapper based on `FRAMEWORK_CONFIG.theme.active`.
- **Runtime Overrides**: Inject a `<style>` tag in the head of the document to override HSL variables if custom values are provided in the config.

## 4. Decoupling the "Tools" Feature

The "Tools" feature is currently deeply integrated. We will make it optional:

- **Move Data to Optional Directory**: Move `src/data/*.ts` related to tools into a dedicated folder that can be easily replaced or emptied by the user.
- **Conditional Compilation**: Use Astro's integration or simple conditional imports to ensure that if `enableToolsPage` is false, the associated routes and components don't bloating the build.

## 5. Cleaning Up Hardcoded References

- **Logo Component**: Update `HeaderLogo.tsx` to use `FRAMEWORK_CONFIG.site.logoText` or the full title if preferred.
- **Header/Footer**: Replace imports from `headerLinks.json` with the `navigation` object from the config.
- **Metadata**: Ensure all SEO and manifest data is pulled exclusively from the configuration.

## 6. Implementation Phases

### Phase 1: Configuration & Cleanup
- Create the new config schema.
- Update all components to use the new config instead of hardcoded strings or separate JSON files.

### Phase 2: Routing & Features
- Implement the homepage toggle.
- Add feature flag checks to navigation and page layouts.

### Phase 3: Multi-Theme Support
- Create the theme CSS architecture.
- Implement the theme switcher logic in `PageLayout`.

### Phase 4: Documentation
- Create a `GETTING_STARTED.md` for forkers.
- Document the configuration options.

## 7. Verification

- **Automated Tests**: Update existing tests to mock the configuration and verify different feature states.
- **Build Checks**: Ensure `npm run build` still works perfectly with different configurations.
- **Visual Regression**: Use Playwright to verify that toggling themes and homepages works as expected.
