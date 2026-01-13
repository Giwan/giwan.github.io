# Development Workflow

Guidelines for running and maintaining the project.

## Local Development

- **Start Dev Server**: `npm run dev` (Runs on `http://localhost:4321`)
- **Linting**: `npm run lint` (Ensure code style consistency)
- **Type Checking**: `npm run check` (Run Astro/TypeScript checks)

## Testing

- **Run All Tests**: `npm run test`
- **Watch Mode**: `npm run test:watch`

## Build and Deployment

- **Production Build**: `npm run build`
- **Preview Build**: `npm run preview`
- **Deployment**: Automatic via GitHub Actions on push to `main`. Builds are
  pushed to the `/docs` folder.

> [!IMPORTANT]
> Always verify that `npm run build` passes before submitting changes to core
> configurations or layouts.
