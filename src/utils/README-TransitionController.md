# TransitionController

The TransitionController provides intelligent navigation context detection and enhanced view transitions for the Astro blog site.

## Features

- **Navigation Context Detection**: Automatically detects forward/backward/refresh navigation
- **Page Relationship Analysis**: Understands parent-child, sibling, and contextual page relationships
- **Performance Optimization**: Adapts transitions based on device capabilities and user preferences
- **Astro Integration**: Hooks into Astro's transition events for seamless integration

## Usage

### Basic Integration

1. Import and initialize the transition controller:

```typescript
import { initializeTransitions } from './utils/transitionInit';

// Initialize when the app starts
initializeTransitions();
```

2. Include the enhanced CSS in your layout:

```astro
---
// In your layout file
---
<link rel="stylesheet" href="/src/styles/enhanced-transitions.css" />
```

3. The TransitionController will automatically:
   - Detect navigation context
   - Apply appropriate data attributes to the document
   - Enable contextual CSS transitions

### Advanced Usage

#### Getting Navigation Context

```typescript
import { getTransitionController } from './utils/transitionInit';

const controller = getTransitionController();
const currentContext = controller.getCurrentContext();

if (currentContext) {
  console.log('Navigation direction:', currentContext.direction);
  console.log('Page relationship:', currentContext.relationship);
}
```

#### Checking Browser Support

```typescript
import { isViewTransitionSupported } from './utils/transitionInit';

if (isViewTransitionSupported()) {
  // Enhanced transitions are available
} else {
  // Fallback to basic transitions
}
```

#### Performance Metrics

```typescript
const controller = getTransitionController();
const metrics = controller.getMetrics();

console.log('Average transition duration:', metrics.averageDuration);
console.log('Total transitions:', metrics.totalTransitions);
```

## CSS Integration

The TransitionController applies data attributes to the document root that can be used for CSS targeting:

### Available Data Attributes

- `data-transition-direction`: `forward` | `backward` | `refresh`
- `data-transition-from-type`: Source page type
- `data-transition-to-type`: Target page type
- `data-transition-relationship`: `sibling` | `parent-child` | `child-parent` | `unrelated` | `contextual`
- `data-transition-context`: Simplified context name for CSS targeting
- `data-reduced-motion`: `true` when user prefers reduced motion
- `data-low-power`: `true` when device is in low power mode

### CSS Examples

```css
/* Forward navigation */
[data-transition-direction="forward"] ::view-transition-new(main-content) {
  animation: slide-in-right 300ms ease-out;
}

/* Backward navigation */
[data-transition-direction="backward"] ::view-transition-new(main-content) {
  animation: slide-in-left 300ms ease-out;
}

/* Drill-down navigation (list to detail) */
[data-transition-context="drill-down"] ::view-transition-new(main-content) {
  animation: scale-in 300ms ease-out;
}

/* Respect reduced motion */
[data-reduced-motion="true"] ::view-transition-new(main-content) {
  animation: none !important;
}
```

## Page Type Classification

The controller automatically classifies pages based on URL patterns:

- `home`: `/` or empty path
- `blog-list`: `/blog`
- `blog-post`: `/blog/[slug]`
- `tools-list`: `/tools`
- `tools-category`: `/tools/[category]`
- `search`: `/search`
- `about`: `/about`
- `contact`: `/contact`
- `offline`: `/offline`

## Navigation Relationships

The controller analyzes relationships between pages:

- **Sibling**: Same page type (blog post to blog post)
- **Parent-Child**: List to detail navigation
- **Child-Parent**: Detail to list navigation
- **Contextual**: Related sections (blog to search)
- **Unrelated**: Different sections (blog to tools)

## Performance Considerations

The TransitionController includes several performance optimizations:

- **Device Detection**: Adjusts transitions for mobile devices and low-power mode
- **Reduced Motion**: Respects user accessibility preferences
- **History Management**: Limits navigation history size to prevent memory issues
- **Metrics Tracking**: Monitors transition performance for optimization

## Browser Support

The controller gracefully handles browsers without View Transition API support:

- Checks for `document.startViewTransition` availability
- Provides fallback mechanisms for unsupported browsers
- Maintains functionality without breaking the user experience

## Testing

The TransitionController includes comprehensive tests covering:

- Page type classification
- Navigation direction detection
- Page relationship analysis
- Metrics tracking
- Browser support detection

Run tests with:

```bash
npm test src/utils/__tests__/transitionController.test.ts
```

## Integration with Existing Code

The TransitionController is designed to work with the existing Astro ViewTransitions setup:

1. It hooks into Astro's transition events (`astro:before-preparation`, `astro:after-swap`)
2. It extends the existing CSS transition system
3. It respects the current theme transition implementation
4. It maintains compatibility with existing `transition:name` attributes

## Future Enhancements

The TransitionController provides a foundation for future enhancements:

- Custom transition registration for specific routes
- Advanced performance monitoring and optimization
- Integration with service worker for offline transitions
- Enhanced accessibility features
- Visual debugging tools for development