# Progressive Web App (PWA) Implementation Plan

This plan guides you (or your AI assistant) through turning the Astro blog into
a fully-featured Progressive Web App.\
Each step contains: • **Goal** – what we want to achieve.\
• **Action Items** – concrete tasks.\
• **Prompts / Commands** – commands or questions you can ask Cascade to complete
the step.

> Tip: Work through the checklist in order. Tick each box (`[x]`) when finished.

---

## 0. Prerequisites

- [ ] Ensure Node.js ≥ 18 and npm ≥ 9 are installed.
- [ ] Commit or stash any uncommitted changes.
- [ ] Run the dev server (`npm run dev`) to confirm the site works.

```
Prompt: "Run the site locally so I can confirm everything is okay."
```

---

## 1. Install PWA Support

**Goal:** Add the official Astro PWA integration.

- [ ] Install dependency: `@astrojs/pwa`.
- [ ] Register **and configure** the integration in `astro.config.mjs`, tailored for GitHub Pages:
      ```js
      import { defineConfig } from 'astro/config';
      import pwa from '@astrojs/pwa';

      export default defineConfig({
        site: 'https://<USERNAME>.github.io/<REPO>/',
        base: '/<REPO>/',              // GH Pages sub-folder
        integrations: [
          pwa({
            scope: '/<REPO>/',         // ensure SW scope matches subpath
            registerType: 'prompt',    // show update-available prompt
            workbox: {
              navigateFallback: '/<REPO>/index.html',
            },
          }),
        ],
      });
      ```
- [ ] Commit and push the change.

```
Prompt: "Add @astrojs/pwa to the project and configure it in astro.config.mjs."
```

---

## 2. Create Web App Manifest

**Goal:** Provide metadata for installability.

- [ ] Add `public/manifest.json` with name, short_name, theme colors, and **icons (192×192, 512×512, and 512×512 maskable)**.
- [ ] Set `start_url` and `scope` to `"/<REPO>/"` to match GitHub Pages base path.
- [ ] Reference the manifest in the `<head>` of every page (Astro `src/layouts/*` or a global `src/components/Head.astro`).

```
Prompt: "Generate a minimal manifest.json for the blog with name, short_name, start_url, theme_color, background_color, display, and icons (192px & 512px)."
```

---

## 3. Provide App Icons

**Goal:** Supply PNG icons referenced by the manifest.

- [ ] Place icons in `public/icons/`.
- [ ] Add `192.png`, `512.png`, and `512-maskable.png` (maskable, transparent background).
- [ ] Ensure paths match those in the manifest.

```
Prompt: "Create 192×192 and 512×512 PNG icons derived from the site logo and save them to public/icons/."
```

---

## 4. Configure Service Worker

**Goal:** Enable offline caching & update flow.

- [ ] Verify `@astrojs/pwa` generates a service worker with sensible defaults.
- [ ] Customize caching strategy if necessary (e.g., images, font files).
- [ ] Add logic to display an "update available" snackbar when a new service
      worker is waiting.

```
Prompt: "Expose a hook to detect when a new service worker is waiting and show a toast prompting the user to refresh."
```

---

## 5. Update Meta Tags

**Goal:** Make the site look good on mobile and when installed.

- [ ] Add viewport, theme-color, Apple mobile web app tags in `<head>`.
- [ ] Verify `og:` / Twitter card metadata still works.

```
Prompt: "Insert meta viewport and theme-color tags into the default layout."
```

---

## 6. Lighthouse Audit

**Goal:** Validate PWA criteria.

- [ ] Run Lighthouse in Chrome DevTools → **PWA** category.
- [ ] Fix any failing audits (e.g., maskable icon, HTTPS, service worker scope).

```
Prompt: "Run a Lighthouse audit and list all failed PWA audits."  
Prompt: "Fix the maskable icon audit failure by generating a 512px maskable icon."
```

---

## 7. Testing Offline & Install

**Goal:** Ensure the site works fully offline and can be installed.

- [ ] Toggle DevTools → Network → Offline and navigate.
- [ ] Install the app (Chrome Omnibox install button) and verify splash screen,
      theme color.

```
Prompt: "Simulate offline mode and verify that navigation still works." 
Prompt: "Take screenshots of the installed PWA on desktop and mobile."
```

---

## 8. CI/CD & Deployment

**Goal:** Keep PWA working in production.

- [ ] Ensure build step produces service worker and manifest in `/dist`.
- [ ] Deploy to GitHub Pages with HTTPS.
- [ ] GitHub Pages does not allow custom cache headers; rely on the plugin’s hashed filenames to guarantee service-worker updates.

```
Prompt: "Deploy the Astro site and verify the service worker is active."
```

---

## 9. Documentation & Maintenance

**Goal:** Record PWA behaviors for future contributors.

- [ ] Document how to update icons & manifest.
- [ ] Note caveats (clearing caches, versioning, etc.).

```
Prompt: "Add a PWA section to README explaining how to update icons and purge old caches."
```

---

## Completion Checklist

- [ ] All steps above are checked off.
- [ ] Lighthouse PWA score is 100.
- [ ] App installs & works offline without console errors.

---

### Next Action

Start with **Step 1 – Install PWA Support**.
