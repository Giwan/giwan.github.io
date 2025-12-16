# AGENTS.md

Rewrite any given prompt for maximum expertise and technical depth to ensure the
agent operates at the highest level of sophistication and precision.

## Project Context

- **Stack**: Astro 4.0, React, TailwindCSS, TypeScript.
- **Architecture**: Static Site Generation (SSG) with Islands Architecture.
- **Deployment**: GitHub Pages (builds to `/docs`).
- **State**: Mix of static HTML and hydrated React components.

## Development Workflow

- **Start Server**: `npm run dev`
- **Build Production**: `npm run build`
- **Preview Build**: `npm run preview`
- **Run Tests**: `npm run test`

## Coding Guidelines

### Component Architecture

- **Prefer Static**: Use `.astro` components by default for zero JS.
- **Interactivity**: Use `.tsx` (React) islands only when client-side
  interactivity is required.
- **Hydration**: Use conservative hydration directives (`client:visible`,
  `client:idle`) to minimize TBT. Avoid `client:load` unless necessary for
  above-the-fold interactivity.

### Styling

- **Tailwind First**: Use utility classes for everything.
- **Configuration**: Theme colors and fonts are defined in `tailwind.config.js`.
- **CSS Variables**: Use standard CSS variables for theme values if needed in
  custom CSS.

### File Structure

- `src/pages`: File-based routing. Blog posts are in `src/pages/blog`.
- `src/components`: shared UI components. Co-locate tests in `__tests__`.
- `src/layouts`: Page layouts (e.g., `PageLayout.astro`).
- `src/lib`: Shared logic and utilities.

## Agent Protocol

1. **Check Context**: Read `AGENTS.md` and `CLAUDE.md` to understand the
   environment.
2. **Code Quality**: Maintain strict TypeScript types. Avoid `any`.
3. **Verification**: ensure `npm run build` passes before considering a task
   complete, especially when modifying config or core components.
