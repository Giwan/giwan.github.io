# Project Context

This document provides essential context for AI agents working on this
repository.

## Tech Stack

- **Core Framework**: Astro 7.x
- **UI Libraries**: React (for islands), Vanilla HTML (Astro components)
- **Styling**: TailwindCSS v4 (CSS-first `@theme`), CSS Variables
- **Language**: TypeScript (Strict mode)
- **Bundler**: Vite (included with Astro)
- **Unit Testing**: Jest (`package.json` is the source of truth)

## Architecture

- **Rendering Mode**: Static Site Generation (SSG).
- **Islands Architecture**: Use React components (`.tsx`) only for interactive
  elements. Static parts remain in `.astro` components.
- **Hydration**: Be mindful of hydration. Use `client:load` only when necessary,
  prefer `client:visible` or `client:idle`.
- **View Transitions**: Astro's `<ClientRouter />` drives navigation with the
  native View Transitions API (`document.startViewTransition`), styled via the
  standard `::view-transition-*` pseudo-elements. There is no custom transition
  engine — see `docs-internal/transition-system-guide.md`.

## Directory Structure

- `/src/pages`: File-based routing.
- `/src/components`: Reusable UI components (`.astro` + React islands).
- `/src/layouts`: Page templates.
- `/src/utils`: Utilities and shared logic.
- `/docs`: Production build output (generated; git-ignored, deployed via CI).

## Documentation Map

- `agent-docs/` — context, workflow, guidelines, protocol (for agents).
- `docs-internal/` — design review, plans, and system guides.
