# View Transitions Guide

The site uses the **standard browser View Transitions API**, driven by Astro's
[`<ClientRouter />`](https://docs.astro.build/en/guides/view-transitions/).
There is **no custom transition engine or controller**.

- MDN reference: <https://developer.mozilla.org/en-US/docs/Web/API/View_Transition_API>
- Astro reference: <https://docs.astro.build/en/guides/view-transitions/>

## How it works

1. `<ClientRouter />` is mounted once, in `src/components/BaseHead.astro`.
2. On client-side navigation (same-document), Astro calls the native
   `document.startViewTransition()`, which returns a `ViewTransition`
   (`.ready`, `.finished`, `.updateCallbackDone`, `.types`).
3. While the transition runs, Astro sets
   `data-astro-transition="forward|back|refresh|fallback"` on `<html>`.
4. Elements marked with `transition:name="X"` receive
   `view-transition-name: X`. Names **must be unique per document**.
5. `transition:animate="fade" | "slide" | "none"` selects Astro's built-in
   animations. Customization is done with the standard
   `::view-transition-old(name)` / `::view-transition-new(name)` /
   `::view-transition-group(name)` pseudo-elements.

## Shared elements across pages

Give the same element on two pages the same `transition:name` to morph it
across the navigation (e.g. a card title expanding into an article `<h1>`).
Keep names unique — duplicate names are ignored by the browser (with a console
warning) and produce a broken transition.

## Styling

All transition CSS lives in `src/styles/view-transitions.css` and uses only
standard pseudo-elements. It also defines the shared timing tokens
(`--transition-duration-*`, `--transition-easing-standard`).

## Accessibility

`@media (prefers-reduced-motion: reduce)` sets the transition durations to `0ms`
and removes the animations, so users who opt out get instant navigation.

## Verifying it works

- The call to `document.startViewTransition` comes from Astro's router
  (`astro_virtual-modules/transitions-router.js`), not from app code.
- `data-astro-transition` appears on `<html>` during a navigation.
- `getComputedStyle(el).viewTransitionName` values are unique per document
  (check the skip links and header/footer named regions).
- No app code should call `startViewTransition` for navigation; the only
  legitimate direct use is the theme toggle (`src/hooks/useTheme.ts`), which
  animates a same-document theme swap.
