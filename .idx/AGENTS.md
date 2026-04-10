# Expert AI Engineering Protocol

## Clean Code & TypeScript Principles
When modifying or extending this framework, strictly adhere to these principles:

### 1. Robust Type Safety
- **No 'any'**: Avoid the use of 'any' at all costs. Use Zod schemas for all external data sources and configuration files.
- **Inference where possible**: Trust TypeScript's inference for local variables, but explicitly type exported constants and function parameters.
- **Exhaustive Checks**: Use discriminating unions and exhaustive 'switch' checks for themes, routes, and layout types.

### 2. Framework Modularity
- **Source of Truth**: The centralized 'src/config.ts' is the single source of truth for site-wide settings. Do not hardcode strings (site names, social URLs, paths) in components.
- **Feature Flags**: Respect all feature flags defined in 'CONFIG.features'. If a feature is disabled, the corresponding components should not render and routes should be guarded via middleware.
- **CSS Variable Overrides**: Design changes should primarily be handled through HSL variable overrides defined in 'CONFIG.theme.overrides'.

### 3. File Operations
- **Atomic Writes**: Always ensure configuration files are well-formed before writing.
- **Asset Integrity**: When changing PWA settings or site metadata, verify that the referenced assets (favicons, manifest icons) exist in the 'public/' directory.

### 4. Verification Workflow
- Every change must pass a full build ('npm run build') and all unit tests ('npm test').
- Frontend changes require visual verification via Playwright, ensuring consistent layout across different configured themes.
