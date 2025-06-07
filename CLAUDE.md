# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev              # Start development server
npm start               # Alias for dev

# Building & Preview
npm run build           # Build static site (includes search data generation)
npm run preview         # Preview built site locally
npm run preview:deno    # Preview using Deno runtime

# Testing
npm run test            # Run Jest tests

# Deployment
npm run deploy:prod     # Build and deploy to production
npm run clean          # Remove docs directory
```

## Architecture Overview

This is an Astro-based blog using **islands architecture** - mostly static HTML/CSS with interactive React components rendered only where needed. The site builds to static files in `/docs` for GitHub Pages deployment.

### Key Architectural Patterns

- **Hybrid styling**: Combines Tailwind utilities, CSS modules, and Astro scoped styles
- **Content structure**: Blog posts in `/src/pages/blog/[date-title]/index.mdx` format
- **Component organization**: Feature-based folders in `/src/components/` with co-located tests
- **Dark theme**: Monokai-inspired color palette defined in `tailwind.config.cjs`
- **Search system**: Build-time indexing (`populateSearchData.js`) with client-side React search

### Important Files

- **astro.config.mjs**: Astro configuration (output: static, integrations: MDX/Tailwind/React)
- **tailwind.config.cjs**: Custom Monokai theme with programming-friendly fonts
- **src/config.ts**: Site configuration and metadata
- **populateSearchData.js**: Generates search index before build

### Component Patterns

- **Astro components** (`.astro`): Static content and layouts
- **React components** (`.jsx/.tsx`): Interactive features with CSS modules
- **Layout hierarchy**: PageLayout.astro → BlogPost.astro for blog content
- **Tools system**: Category-based filtering with TypeScript data files

### Content Management

- **Blog posts**: MDX files support React components within markdown
- **Drafts**: Separate `/src/pages/drafts/` for unpublished content
- **Tools pages**: JSON-driven navigation (`headerLinks.json`)

### Testing Setup

- **Jest** with jsdom environment for React component testing
- **Tests co-located** in `__test__/` directories within component folders
- **Coverage**: v8 provider configured