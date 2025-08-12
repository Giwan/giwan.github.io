# View Transitions System Guide

This guide explains how to add custom transitions to new pages and components in the Astro blog site.

## Table of Contents

1. [Overview](#overview)
2. [Basic Usage](#basic-usage)
3. [Adding Custom Transitions](#adding-custom-transitions)
4. [Advanced Transition Configurations](#advanced-transition-configurations)
5. [Performance Optimization](#performance-optimization)
6. [Troubleshooting](#troubleshooting)
7. [API Reference](#api-reference)

## Overview

The enhanced view transitions system provides smooth, contextual animations between pages with automatic optimization for performance and accessibility. The system consists of several key components:

- **TransitionController**: Manages navigation context detection and transition execution
- **TransitionRegistry**: Maps page types and routes to appropriate transition configurations
- **TransitionPreloader**: Preloads transitions for improved performance
- **Advanced CSS Animations**: Optimized keyframes and hardware-accelerated transitions

## Basic Usage

### Adding Transitions to New Pages

1. **Astro Pages**: Transitions are automatically applied to all Astro pages that use the `PageLayout.astro` layout.

2. **Custom Components**: Add the `transition:name` attribute to elements you want to transition:

```astro
---
// src/pages/my-new-page.astro
---
<Layout>
  <main transition:name="main-content">
    <h1 transition:name="page-title">My New Page</h1>
    <section transition:name="content-section">
      <!-- Page content -->
    </section>
  </main>
</Layout>
```

### Page Type Classification

The system automatically classifies pages based on their URL patterns. To add a new page type:

```typescript
// src/utils/transitionRegistry.ts
export enum PageType {
  // ... existing types
  MY_NEW_TYPE = 'my-new-type'
}

// Add route pattern
this.routePatterns.push({
  pattern: /^\/my-new-section\/.*$/,
  pageType: PageType.MY_NEW_TYPE,
  priority: 80
});
```

## Adding Custom Transitions

### Step 1: Define Your Transition Animation

Create CSS keyframes for your custom transition:

```css
/* src/styles/custom-transitions.css */
@keyframes my-custom-enter {
  from {
    opacity: 0;
    transform: translate3d(0, 30px, 0) scale3d(0.95, 0.95, 1);
  }
  to {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  }
}

@keyframes my-custom-exit {
  from {
    opacity: 1;
    transform: translate3d(0, 0, 0) scale3d(1, 1, 1);
  }
  to {
    opacity: 0;
    transform: translate3d(0, -30px, 0) scale3d(1.05, 1.05, 1);
  }
}
```

### Step 2: Register the Transition Configuration

```typescript
// src/utils/transitionRegistry.ts
this.transitionConfigs.set('my-custom-transition', {
  name: 'my-custom-transition',
  duration: 400,
  easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
  cssClass: 'transition-my-custom',
  elements: [
    {
      selector: 'main',
      transitionName: 'main-content',
      animation: {
        keyframes: 'my-custom-enter',
        duration: 400,
        easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
      }
    }
  ]
});
```

### Step 3: Apply the Transition Context

Add CSS rules to apply your transition:

```css
/* Apply to specific navigation contexts */
[data-transition-context="my-custom"] {
  --exit-animation: my-custom-exit;
  --enter-animation: my-custom-enter;
  --transition-duration-normal: 400ms;
}

[data-transition-context="my-custom"] ::view-transition-old(main-content) {
  animation: var(--exit-animation) var(--transition-duration-normal) var(--transition-easing-standard);
}

[data-transition-context="my-custom"] ::view-transition-new(main-content) {
  animation: var(--enter-animation) var(--transition-duration-normal) var(--transition-easing-standard);
}
```

### Step 4: Configure When to Use the Transition

Modify the transition selection logic:

```typescript
// src/utils/transitionRegistry.ts
private selectTransitionName(context: NavigationContext): string {
  // ... existing logic

  // Add your custom condition
  if (context.fromPageType === PageType.MY_NEW_TYPE || 
      context.toPageType === PageType.MY_NEW_TYPE) {
    return 'my-custom-transition';
  }

  // ... rest of logic
}
```

## Advanced Transition Configurations

### Staggered Animations

For lists or grids that need staggered animations:

```css
/* Staggered list items */
[data-transition-context="staggered-list"] .list-item {
  animation-delay: calc(var(--stagger-index, 0) * 100ms);
}
```

```astro
<!-- In your Astro component -->
{items.map((item, index) => (
  <div 
    class="list-item" 
    style={`--stagger-index: ${index}`}
    transition:name={`list-item-${index}`}
  >
    {item.content}
  </div>
))}
```

### Conditional Transitions

Apply different transitions based on conditions:

```typescript
// src/utils/transitionRegistry.ts
{
  name: 'conditional-transition',
  duration: 300,
  easing: 'ease-out',
  elements: [...],
  conditions: [
    {
      type: 'media-query',
      condition: '(prefers-reduced-motion: reduce)',
      fallback: this.transitionConfigs.get('fade')
    },
    {
      type: 'performance',
      condition: 'low-end-device',
      fallback: this.transitionConfigs.get('simple-fade')
    }
  ]
}
```

### Shared Element Transitions

For elements that should maintain visual continuity:

```astro
<!-- Source page -->
<img 
  src="/hero-image.jpg" 
  transition:name="hero-image"
  alt="Hero"
/>

<!-- Destination page -->
<img 
  src="/hero-image.jpg" 
  transition:name="hero-image"
  alt="Hero"
  class="hero-detail"
/>
```

```css
/* Animate the shared element */
::view-transition-old(hero-image),
::view-transition-new(hero-image) {
  animation-duration: 500ms;
  animation-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
}
```

## Performance Optimization

### Hardware Acceleration

Always use `translate3d()` and `scale3d()` for hardware acceleration:

```css
@keyframes optimized-slide {
  from {
    transform: translate3d(-100%, 0, 0);
  }
  to {
    transform: translate3d(0, 0, 0);
  }
}
```

### Performance Hints

Add performance hints to your transitions:

```css
::view-transition-old(my-element),
::view-transition-new(my-element) {
  /* Force hardware acceleration */
  will-change: transform, opacity;
  transform: translateZ(0);
  backface-visibility: hidden;
  
  /* Prevent layout thrashing */
  contain: layout style paint;
}
```

### Responsive Optimizations

Optimize for different devices:

```css
/* Mobile optimizations */
@media (max-width: 768px) {
  [data-transition-context="my-custom"] {
    --transition-duration-normal: 250ms; /* Faster on mobile */
  }
}

/* Low-end device fallbacks */
@media (max-width: 480px) and (max-device-pixel-ratio: 1.5) {
  [data-transition-context="my-custom"] {
    --exit-animation: fade-out;
    --enter-animation: fade-in;
  }
}
```

## Troubleshooting

### Common Issues

1. **Transitions Not Working**
   - Ensure `ViewTransitions` component is included in your layout
   - Check that elements have unique `transition:name` attributes
   - Verify CSS animations are properly defined

2. **Performance Issues**
   - Use hardware-accelerated properties (`transform`, `opacity`)
   - Avoid animating `width`, `height`, `top`, `left`
   - Add `will-change` and `contain` properties

3. **Accessibility Issues**
   - Always respect `prefers-reduced-motion`
   - Provide fallbacks for users with motion sensitivity
   - Ensure transitions don't interfere with screen readers

### Debug Mode

Enable debug mode to troubleshoot transitions:

```typescript
// In browser console
transitionController.enableDebugMode();
```

This will log transition events and performance metrics to the console.

## API Reference

### TransitionController

```typescript
class TransitionController {
  // Detect navigation context
  detectNavigationContext(fromPath: string, toPath: string): NavigationContext;
  
  // Get current metrics
  getMetrics(): TransitionMetrics;
  
  // Check if transitions are supported
  isTransitionSupported(): boolean;
  
  // Enable/disable debug mode
  enableDebugMode(): void;
  disableDebugMode(): void;
}
```

### TransitionRegistry

```typescript
class TransitionRegistry {
  // Register custom transition
  registerTransition(pattern: RoutePattern, transition: TransitionConfig): void;
  
  // Get page type for route
  getPageType(route: string): PageType;
  
  // Get transition for navigation
  getTransitionForNavigation(context: NavigationContext): TransitionConfig;
  
  // Set default transition
  setDefaultTransition(transition: TransitionConfig): void;
}
```

### TransitionPreloader

```typescript
class TransitionPreloader {
  // Prefetch transition for path
  prefetchTransition(toPath: string, options?: PreloadOptions): Promise<void>;
  
  // Prefetch multiple paths
  prefetchPaths(paths: string[], options?: PreloadOptions): Promise<void[]>;
  
  // Get preload statistics
  getPreloadStats(): PreloadStats;
  
  // Clear all preloads
  clearPreloads(): void;
}
```

### CSS Custom Properties

Available CSS custom properties for customization:

```css
:root {
  /* Timing */
  --transition-duration-fast: 200ms;
  --transition-duration-normal: 300ms;
  --transition-duration-slow: 500ms;
  
  /* Easing */
  --transition-easing-standard: cubic-bezier(0.4, 0.0, 0.2, 1);
  --transition-easing-decelerate: cubic-bezier(0.0, 0.0, 0.2, 1);
  --transition-easing-accelerate: cubic-bezier(0.4, 0.0, 1, 1);
  
  /* Animations */
  --exit-animation: slide-out-left;
  --enter-animation: slide-in-right;
}
```

## Examples

### Example 1: Custom Page Transition

```astro
---
// src/pages/portfolio.astro
import Layout from '../layouts/PageLayout.astro';
---

<Layout content={{ title: 'Portfolio', description: 'My work' }}>
  <main transition:name="main-content" data-page-type="portfolio">
    <section transition:name="portfolio-grid" class="portfolio-grid">
      {projects.map((project, index) => (
        <article 
          transition:name={`project-${project.id}`}
          style={`--stagger-index: ${index}`}
          class="project-card"
        >
          <h2>{project.title}</h2>
          <p>{project.description}</p>
        </article>
      ))}
    </section>
  </main>
</Layout>
```

### Example 2: Modal Transitions

```astro
---
// src/components/Modal.astro
---

<div 
  class="modal-overlay" 
  transition:name="modal-overlay"
  data-transition-context="modal"
>
  <div 
    class="modal-content" 
    transition:name="modal-content"
  >
    <slot />
  </div>
</div>

<style>
  [data-transition-context="modal"] ::view-transition-old(modal-overlay) {
    animation: fade-out 200ms ease-out;
  }
  
  [data-transition-context="modal"] ::view-transition-new(modal-overlay) {
    animation: fade-in 200ms ease-in;
  }
  
  [data-transition-context="modal"] ::view-transition-old(modal-content) {
    animation: scale-out 300ms cubic-bezier(0.4, 0.0, 1, 1);
  }
  
  [data-transition-context="modal"] ::view-transition-new(modal-content) {
    animation: scale-in 300ms cubic-bezier(0.0, 0.0, 0.2, 1);
  }
</style>
```

This guide provides a comprehensive overview of the transition system. For more advanced use cases or specific questions, refer to the source code in `src/utils/` or create an issue in the project repository.