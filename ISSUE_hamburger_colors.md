# Hamburger Menu Color Contrast Issue

## Description
The hamburger menu icon in the HeaderNav component currently uses `bg-paper` for its lines, which may not provide sufficient contrast against the primary background color, potentially affecting visibility and accessibility.

## Current Implementation
- Hamburger icon lines use `bg-paper` class
- Background uses `bg-primary` class
- No hover state or focus indicator for better accessibility

## Expected Behavior
- The hamburger icon should have sufficient color contrast (at least 4.5:1) against its background
- Consider adding hover and focus states for better user interaction
- Ensure the icon remains visible in both light and dark modes if applicable

## Files Affected
- `src/components/HeaderNav/HeaderNav.jsx`

## Additional Context
The current implementation might make it difficult for users with visual impairments to locate and interact with the menu button. This is particularly important as it's the primary navigation control on mobile devices.

## Suggested Solution
Consider:
1. Using a more contrasting color for the hamburger icon
2. Adding hover and focus states
3. Implementing proper ARIA attributes if not already present
4. Ensuring the icon meets WCAG 2.1 AA contrast requirements

## Acceptance Criteria
- [ ] Hamburger icon is clearly visible against its background
- [ ] Meets WCAG 2.1 AA contrast requirements
- [ ] Includes proper hover/focus states
- [ ] Works well in both light and dark modes
