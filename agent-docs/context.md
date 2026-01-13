# Project Context

This document provides essential context for AI agents working on this
repository.

## Tech Stack

- **Core Framework**: Astro 4.0
- **UI Libraries**: React (for islands), Vanilla HTML (Astro components)
- **Styling**: TailwindCSS, CSS Variables
- **Language**: TypeScript (Strict mode)
- **Bundler**: Vite (included with Astro)
- **Unit Testing**: Jest (or Vitest, check `package.json`)

## Architecture

- **Rendering Mode**: Static Site Generation (SSG).
- **Islands Architecture**: Use React components (`.tsx`) only for interactive
  elements. Static parts remain in `.astro` components.
- **Hydration**: Be mindful of hydration. Use `client:load` only when necessary,
  prefer `client:visible` or `client:idle`.

## Directory Structure

- `/src/pages`: File-based routing.
- `/src/components`: Reusable UI components.
- `/src/layouts`: Page templates.
- `/src/lib`: Utilities and shared logic.
- `/docs`: Output directory for the production build (GitHub Pages requirement).
