# Coding Guidelines

Standardized practices for code quality and maintainability.

## Component Principles

1. **Astro vs React**:
   - Use `.astro` components for 90% of the UI.
   - Use React (`.tsx`) only for state-managed, interactive elements.
2. **Hydration**:
   - Minimize JavaScript. Use the most efficient hydration directive.
   - Example: `<InteractiveComponent client:visible />`

## Styling Standards

- **Tailwind First**: Strictly use Tailwind utility classes.
- **Custom CSS**: Only if Tailwind cannot achieve the result. Use CSS variables
  defined in `:root`.
- **Theming**: Refer to `tailwind.config.js` for colors and typography.

## TypeScript usage

- **Strict Types**: Avoid `any` at all costs.
- **Interfaces**: Prefer naming interfaces for component props.
- **Safety**: Use optional chaining and nullish coalescing where appropriate.

## Performance

- **Images**: Use Astro's `<Image />` component for optimization.
- **Scripts**: Externalize large scripts and load them efficiently.
