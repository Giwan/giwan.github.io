# CLAUDE.md

Expert in Astro, ReactJS, TypeScript, TailwindCSS. Think step-by-step, prioritize static generation and performance. This is an Astro-based blog using islands architecture.

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

## Project Architecture

### Core Structure
- **Static generation**: Builds to `/docs` for GitHub Pages deployment
- **Islands architecture**: Static HTML/CSS with selective React hydration
- **Blog posts**: MDX files in `/src/pages/blog/[date-title]/index.mdx` format
- **Search system**: Build-time indexing with client-side React search

### File Organization
- **Pages**: `src/pages/index.astro`, `[slug].astro`, `[...path].astro`
- **Components**: `src/components/Component.astro` (static), `Component.tsx` (interactive)
- **Layouts**: `src/layouts/Layout.astro` with slots
- **Drafts**: Separate `/src/pages/drafts/` for unpublished content

### Key Configuration Files
- **astro.config.mjs**: Astro configuration (output: static, integrations: MDX/Tailwind/React)
- **tailwind.config.cjs**: Custom Monokai theme with programming-friendly fonts
- **src/config.ts**: Site configuration and metadata
- **populateSearchData.js**: Generates search index before build

## Component Guidelines

### Astro Components
```astro
---
interface Props {
  title: string;
  description?: string;
  class?: string;
}

const { title, description, class: className } = Astro.props;
---
```

### Interactive Components
- Static by default, add interactivity only when needed
- Use appropriate hydration directives:
  - `client:load` - immediate hydration
  - `client:idle` - when browser idle
  - `client:visible` - when in viewport

```astro
<!-- Static -->
<Hero title="Welcome" />

<!-- Interactive when needed -->
<SearchBox client:visible />
<Counter client:load />
```

### React Components
- Export named components: `export const SearchInput = () => {}`
- Type all props with interfaces
- Co-locate tests in `__test__/` directories

## Styling Rules

### TailwindCSS
- Use Tailwind utilities exclusively
- Mobile-first responsive design
- Monokai-inspired color palette defined in config
- Apply styles in class attributes only

```astro
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
  <article class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
    <!-- content -->
  </article>
</div>
```

### Scoped Styles
- Use for component-specific CSS when Tailwind insufficient
- Prefer CSS variables for design tokens

```astro
<style>
  .hero {
    background: linear-gradient(45deg, var(--primary), var(--secondary));
  }
</style>
```

## Data Fetching

### Static Generation
- Fetch in frontmatter during build
- Use top-level await
- Handle errors gracefully

```astro
---
let posts = [];
try {
  const response = await fetch('https://api.example.com/posts');
  posts = await response.json();
} catch (error) {
  console.error('Failed to fetch posts:', error);
}
---
```

## Performance Guidelines

### Bundle Optimization
- Minimize client-side JavaScript
- Use dynamic imports for heavy libraries
- Leverage static generation
- Use `astro:assets` for optimization

### Image Handling
```astro
---
import { Image } from 'astro:assets';
import heroImg from '../assets/hero.jpg';
---

<Image
  src={heroImg}
  alt="Description"
  width={800}
  height={600}
  format="webp"
  loading="lazy"
/>
```

## Testing Setup
- **Jest** with jsdom environment for React component testing
- **Tests co-located** in `__test__/` directories within component folders
- **Coverage**: v8 provider configured

## Naming Conventions

### Files
- Pages: `kebab-case.astro`
- Components: `PascalCase.astro`, `PascalCase.tsx`
- Layouts: `PascalCase.astro`
- Utils: `camelCase.ts`

### Variables
- Components: `const ComponentName = () => {}`
- Handlers: `handleSubmit`, `handleClick`
- Booleans: `isLoading`, `hasError`, `canEdit`
- Use descriptive names with auxiliary verbs

## Communication Rules
- Follow requirements precisely
- Plan in pseudocode before coding
- Write complete, functional code
- Include all imports and proper file structure
- Prioritize static generation over client-side rendering
- Admit uncertainty rather than guessing