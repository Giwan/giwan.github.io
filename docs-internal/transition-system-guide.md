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

## Reduced motion

Under `@media (prefers-reduced-motion: reduce)` the transition must be a **hard
cut** (no animation). Two things are easy to get wrong here:

1. **Disable every group, not just `root`.** If you only target
   `::view-transition-old(root)`, every other named element (`header`, `footer`,
   `theme-toggle`, …) still runs the browser's default cross-fade, so a partial
   fade remains and reads as a flash. Use the `(*)` wildcard:

   ```css
   ::view-transition-group(*),
   ::view-transition-image-pair(*),
   ::view-transition-old(*),
   ::view-transition-new(*) {
     animation: none !important;
     mix-blend-mode: normal !important; /* Astro's fade is additive (plus-lighter) */
   }
   ```

2. **Neutralise the additive cross-fade.** Astro's built-in `fade` uses
   `mix-blend-mode: plus-lighter`; when the old/new snapshots are out of sync it
   brightens — a flash. Setting `mix-blend-mode: normal` avoids it.

Also keep **`html` opaque** (`background-color: var(--color-background)`) so the
browser's white canvas never shows through during the swap.

### Dark-mode canvas flash

The browser paints its default canvas **white** regardless of your page
background unless you declare `color-scheme`. In dark mode that white shows
through during a transition (which is why the flash is invisible in light mode).
Declare it per theme in `src/styles/global.css`:

```css
:root { color-scheme: light; }
.dark { color-scheme: dark; }
```

Plus `<meta name="color-scheme" content="light dark" />` in `BaseHead.astro` as a
pre-CSS hint.

## No-native-support fallback

On browsers without the native API (older Firefox), Astro can *simulate* the
transition by animating real elements via `data-astro-transition-fallback`.
That simulation is not motion-guarded and flashes. We use
`<ClientRouter fallback="swap" />` so those browsers swap instantly instead.

## Naming elements (keep it minimal)

Only add `transition:name` to elements that must animate/persist independently.
Naming a region **and** its children (`header` *and* `header-logo`,
`header-controls`, …) creates nested groups, extra compositing layers, and more
surface for flashes. The site names only: `page-container`, `header`,
`main-content`, `footer`, `theme-toggle`, the skip links, and per-article names.

## Verifying it works

- The call to `document.startViewTransition` comes from Astro's router
  (`astro_virtual-modules/transitions-router.js`), not from app code.
- `data-astro-transition` appears on `<html>` during a navigation.
- `getComputedStyle(el).viewTransitionName` values are unique per document
  (check the skip links and header/footer named regions).
- No app code should call `startViewTransition` for navigation; the only
  legitimate direct use is the theme toggle (`src/hooks/useTheme.ts`), which
  animates a same-document theme swap.
- With `prefers-reduced-motion: reduce` emulated, a navigation's
  `ViewTransition.finished` should resolve in ~1 frame (single-digit ms),
  not the full `--transition-duration-normal`.
