# Technology Stack

## Core Framework
- **Astro 5.11.0**: Static site generator with islands architecture
- **Output**: Static site generation to `docs/` directory
- **Site URL**: https://giwan.github.io

## Frontend Technologies
- **React 19.1.0**: Interactive components (islands)
- **TypeScript**: Strict type checking enabled
- **Tailwind CSS 3.4.17**: Utility-first styling with custom design system
- **MDX**: Markdown with embedded React components for blog content

## Styling System
- **CSS Variables**: HSL-based design tokens for theming
- **Dark/Light Mode**: System-aware with manual override
- **Typography**: Tailwind Typography plugin with custom prose styles
- **Fonts**: Inter (sans), Merriweather (serif), JetBrains Mono (monospace)
- **View Transitions**: Advanced page transition system with performance optimizations

## State Management
- **Nanostores**: Lightweight reactive state management
- **@nanostores/react**: React integration for stores

## PWA Features
- **@vite-pwa/astro**: Service worker and PWA manifest generation
- **Workbox**: Advanced caching strategies and offline support
- **Manifest**: Complete PWA manifest with icons and metadata

## Testing
- **Jest 29.7.0**: Unit testing framework
- **@testing-library/react**: React component testing
- **jsdom**: Browser environment simulation
- **ts-jest**: TypeScript support for Jest

## Development Tools
- **Path Aliases**: `@/*` maps to `src/*`
- **ESM**: Full ES modules support
- **Strict TypeScript**: Extended from `astro/tsconfigs/strict`

## Build Commands

```bash
# Development
npm run dev          # Start development server
npm run start        # Alias for dev

# Building
npm run build        # Full build with search data population and optimization
npm run prebuild     # Populate search data
npm run postbuild    # Optimize build output
npm run preview      # Preview built site locally

# PWA Testing
npm run build:pwa    # Build and validate PWA
npm run test:pwa     # Test PWA functionality
npm run audit:pwa    # Lighthouse PWA audit

# Testing
npm test             # Run Jest tests

# Utilities
npm run clean        # Remove docs/* directory
npm run populateSearchData  # Generate search index
npm run optimize-build      # Post-build optimizations
```

## Configuration Files
- `astro.config.mjs`: Main Astro configuration with integrations
- `tailwind.config.js`: Tailwind CSS configuration with custom theme
- `tsconfig.json`: TypeScript configuration with strict settings
- `jest.config.mjs`: Jest testing configuration
- `public/manifest.json`: PWA manifest

## Performance Optimizations
- **Font Loading**: Preload with fallbacks and print media trick
- **Service Worker**: Comprehensive caching strategies
- **View Transitions**: Hardware-accelerated page transitions
- **Image Optimization**: Responsive images with proper sizing
- **Bundle Optimization**: Tree shaking and code splitting