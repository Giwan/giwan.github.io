# Consistent design

You are a brilliant designer with a keen eye for detail. You are also a master
of the latest design trends and technologies. You have excellent frontend
development skills and can create a consistent and modern design. You're an
expert at tailwindcss.

## Project

This project is a developer blog using astro. It is a static site generator. It
uses a coding theme like one dark and monokai.

### Issues

The colour usage might be a bit off.

## Tasks

Task 1: Review the design of this project. List your findings in this document
and what improvements you would suggest.

## Design Review Findings

### Current State Analysis

**Theme Consistency Issues:**

1. **Dual Color Systems**: The project uses both One Dark (CSS variables) and
   Monokai (Tailwind) color schemes simultaneously, creating inconsistency
   - `global.css` defines One Dark colors (`#282c34`, `#abb2bf`, etc.)
   - `tailwind.config.cjs` defines Monokai colors (`#272822`, `#f8f8f2`, etc.)

2. **Mixed Styling Approaches**: Three different styling methods are used
   inconsistently:
   - CSS custom properties in `global.css`
   - Tailwind utilities with custom theme
   - CSS modules for components

3. **Typography Issues**:
   - Undefined CSS variables referenced in components (`--font-family-text-2`,
     `--font-family-header`)
   - Inconsistent font family usage between global styles and components
   - Missing fallback fonts in some components

4. **Color Usage Problems**:
   - Background colors don't align between systems (One Dark `#282c34` vs
     Monokai `#272822`)
   - Text contrast may be insufficient in some contexts
   - Semantic colors defined but not consistently applied

### Positive Aspects

1. **Good Color Palette Foundation**: Both One Dark and Monokai are excellent
   programming-focused themes
2. **Proper Dark Mode Support**: Tailwind dark mode configuration is set up
   correctly
3. **Code-Friendly Typography**: Good selection of monospace fonts (JetBrains
   Mono, Fira Code)
4. **Component Architecture**: Clean separation of concerns with CSS modules

### Recommended Improvements

1. **Unify Color System**:
   - Choose either One Dark or Monokai as the primary theme
   - Convert all color references to use the chosen system consistently
   - Update Tailwind custom colors to match global CSS variables

2. **Typography Consolidation**:
   - Fix undefined CSS variable references
   - Standardize font family usage across all components
   - Ensure proper font loading and fallbacks

3. **Design System Implementation**:
   - Create consistent spacing scale using Tailwind utilities
   - Establish clear component hierarchy with proper contrast ratios
   - Define semantic color usage guidelines

4. **Accessibility Enhancements**:
   - Verify color contrast ratios meet WCAG AA standards
   - Ensure focus states are visible and consistent
   - Test with screen readers and keyboard navigation

5. **Visual Improvements**:
   - Add subtle shadows and borders for better component definition
   - Implement consistent hover and active states
   - Improve mobile responsiveness across all components

Task 2: Implement the design of this project. Use tailwindcss to create the
design.

- use the monokai color scheme
- use tailwindcss to create the design
- Convert all color references to use the monokai color scheme
- Update Tailwind custom colors to match monokai color scheme

- Create consistent spacing scale using Tailwind utilities
- Establish clear component hierarchy with proper contrast ratios
- Define semantic color usage guidelines

- Add subtle shadows and borders for better component definition
- Implement consistent hover and active states
- Improve mobile responsiveness across all components
