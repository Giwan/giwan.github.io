# giwan.github.io

[![Deploy to GitHub Pages](https://github.com/Giwan/giwan.github.io/actions/workflows/deploy.yml/badge.svg)](https://github.com/Giwan/giwan.github.io/actions/workflows/deploy.yml)

This project is automatically deployed to GitHub Pages whenever changes are
pushed to the `main` branch via a GitHub Action.

This is a blog built with Astro. One of the main
benefits for using Astro is the **islands architecture**. Most of the site is
static. Only those areas that need some interactivity (islands) are given that
with a **small** bundle of JavaScript.

The end result is a much lighter page with the interactivity benefits.

## The content

The first page lists the articles. These are written in markdown or **mdx**. The
articles can be found in `src/pages/blog`. Each folder in the `blog` folder is
an article. It starts with the `index.mdx` file. Other related content like
images, videos or even components that are specific to that article can be
placed inside the folder.

### Drafts

There is a separate drafts folder next to the blog folder. There all the draft
articles are kept. This because it's a bit tricky to get astro to only read
"published" articles. Having them in a separate drafts folder means less smart
solutions that need to be built and maintained (for now)

## Search

There is a search feature. An index can either be manually created or is created
on deploy. Users can search per keyword which searches the title of the article
which is based on the folder name of the article.

# Tools

There is a [tools page]("/tools") that allows the user to see the listed tools.
They can be subfiltered by category.

## Islands architecture

# Deploy

The blog is deployed on [GitHub Pages](https://giwan.github.io).

## Automated Deployment

Deployment is handled automatically via GitHub Actions. The workflow is defined in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).

When you push changes to the `main` branch:
1.  The **Deploy** workflow is triggered.
2.  It installs dependencies and builds the project (`npm run build` and `npm run build:pwa`).
3.  It runs tests (`npm test`).
4.  It deploys the contents of the `docs` output directory to GitHub Pages using the `peaceiris/actions-gh-pages` action.

## Configuration

The project is configured to build to the `docs` directory in `astro.config.ts`:

```js
output: "static",
outDir: "./docs",
```

This aligns with the deployment workflow which publishes the `docs` directory.

### Running Locally

To test the site locally:

```sh
npm run dev     # Start development server
npm run build   # Build the site
npm run preview # Preview the built site
```

The `build` script also runs the `populateSearchData` script to ensure the
search index is up to date.

# Progressive Web App (PWA)

This blog is implemented as a fully-featured Progressive Web App (PWA) that meets all modern PWA standards. Users can install the app on their devices and access content offline.

## PWA Features

### Installation
- **App Installation**: Users can install the blog as an app on their devices through browser prompts
- **Standalone Mode**: The installed app runs in standalone mode without browser UI
- **App Icons**: Comprehensive icon set for all platforms (iOS, Android, Windows)
- **Splash Screen**: Custom splash screen with gray background (#808080) and app branding

### Offline Functionality
- **Service Worker**: Automatically caches visited pages and static assets
- **Offline Fallback**: Custom offline page when uncached content is accessed
- **Cache Strategy**: Stale-while-revalidate caching for optimal performance
- **Blog Post Caching**: Last 3 visited articles are cached for offline reading
- **Asset Caching**: Images, fonts, and static assets cached for 1 month

### Performance
- **Fast Loading**: Critical resources are precached for instant loading
- **Background Updates**: Content updates automatically in the background
- **Update Notifications**: Non-intrusive notifications when new content is available

## PWA Configuration

### Manifest Configuration
The web app manifest is generated via the VitePWA integration in `astro.config.ts` (values sourced from `src/config.ts`) and includes:

```json
{
  "name": "Giwan Blog",
  "short_name": "G1",
  "theme_color": "#272822",
  "background_color": "#808080",
  "display": "standalone",
  "start_url": "/",
  "scope": "/"
}
```

### Service Worker Configuration
PWA functionality is configured in `astro.config.ts` using VitePWA:

```javascript
VitePWA({
  scope: '/',
  registerType: 'autoUpdate',
  workbox: {
    navigateFallback: '/offline.html',
    runtimeCaching: [
      // Blog posts - stale while revalidate
      {
        urlPattern: /\/blog\/.*/,
        handler: 'StaleWhileRevalidate',
        options: {
          cacheName: 'blog-posts',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
          }
        }
      }
    ]
  }
})
```

## Updating PWA Assets

### Updating Icons
1. Replace icon files in `public/icons/` directory
2. Ensure all required sizes are included (16x16 to 1024x1024)
3. Include maskable icons for Android adaptive icons
4. Update the icon list in `src/config.ts` (`PWA_ICONS`) if filenames change
5. Test installation on different platforms

### Updating Manifest
1. Edit `src/config.ts` to modify site or PWA metadata
2. Adjust the VitePWA configuration in `astro.config.ts` if additional settings are required
3. Test changes with Lighthouse PWA audit
4. Verify installation behavior after changes

### Updating Caching Strategies
1. Modify `workbox.runtimeCaching` in `astro.config.ts`
2. Adjust cache expiration times and entry limits
3. Test offline functionality after changes
4. Monitor cache storage usage

## Testing PWA Functionality

### Local Testing
```bash
# Build the site with PWA features
npm run build

# Serve the built site locally
npm run preview

# Test PWA features at http://localhost:4321
```

### PWA Testing Checklist
- [ ] Install prompt appears in supported browsers
- [ ] App installs correctly on desktop and mobile
- [ ] Standalone mode works without browser UI
- [ ] Offline pages load from cache
- [ ] Offline fallback displays for uncached content
- [ ] Service worker updates work correctly
- [ ] Icons and splash screen display properly

### Lighthouse Audit
Run Lighthouse PWA audit to verify compliance:
1. Open Chrome DevTools
2. Go to Lighthouse tab
3. Select "Progressive Web App" category
4. Run audit and aim for 100/100 score

### Browser Testing
- **Chrome**: Full PWA support including installation
- **Safari**: iOS PWA features and home screen installation
- **Edge**: Windows PWA installation and features
- **Firefox**: Basic PWA functionality

## Troubleshooting PWA Issues

### Installation Issues
**Problem**: Install prompt doesn't appear
- **Solution**: Ensure HTTPS is enabled and manifest is valid
- **Check**: Verify all required manifest fields are present
- **Test**: Use Chrome DevTools Application tab to inspect manifest

**Problem**: App doesn't install on iOS
- **Solution**: Verify Apple-specific meta tags in BaseHead component
- **Check**: Ensure `apple-mobile-web-app-capable` meta tag is present
- **Test**: Use Safari on iOS device or simulator

### Offline Issues
**Problem**: Pages don't load offline
- **Solution**: Check if pages were visited while online first
- **Check**: Inspect service worker cache in DevTools
- **Debug**: Look for service worker errors in console

**Problem**: Offline fallback not showing
- **Solution**: Verify `/offline.html` exists and is accessible
- **Check**: Ensure `navigateFallback` is configured in workbox
- **Test**: Disable network in DevTools and navigate to uncached page

### Caching Issues
**Problem**: Content doesn't update
- **Solution**: Check if service worker is updating properly
- **Check**: Look for update notifications or force refresh
- **Debug**: Clear cache and reload, or unregister service worker

**Problem**: Cache storage full
- **Solution**: Reduce cache limits in workbox configuration
- **Check**: Monitor cache usage in DevTools Application tab
- **Fix**: Implement cache cleanup strategies

### Service Worker Issues
**Problem**: Service worker fails to register
- **Solution**: Check console for registration errors
- **Check**: Verify service worker file is accessible
- **Debug**: Ensure HTTPS is enabled (required for service workers)

**Problem**: Service worker not updating
- **Solution**: Check `registerType` configuration in VitePWA
- **Check**: Verify build process generates new service worker
- **Fix**: Clear browser cache and hard refresh

### Performance Issues
**Problem**: Slow loading after PWA installation
- **Solution**: Review caching strategies and precache critical resources
- **Check**: Use Lighthouse performance audit
- **Optimize**: Reduce bundle sizes and optimize images

### Debugging Tools
- **Chrome DevTools**: Application tab for PWA inspection
- **Lighthouse**: PWA audit and performance testing
- **Workbox**: Service worker debugging and cache inspection
- **PWA Builder**: Microsoft's PWA validation tool

### Common Fixes
1. **Clear all caches**: DevTools > Application > Storage > Clear storage
2. **Unregister service worker**: DevTools > Application > Service Workers > Unregister
3. **Hard refresh**: Ctrl+Shift+R (Cmd+Shift+R on Mac)
4. **Incognito testing**: Test PWA features in private browsing mode

# Styling

The project uses a combination of styling approaches:

## Tailwind CSS

Tailwind CSS is integrated through the Astro Tailwind integration. The
configuration can be found in `tailwind.config.cjs`, where custom colors, fonts,
and theme extensions are defined. Tailwind classes can be used directly in
component templates:

```sh
<div class="p-4 h-screen w-screen">
```

## CSS Variables

Global CSS variables are defined in `src/styles/global.css` for consistent
theming across the site:

```css
:root {
    --color-background: #111827;
    --color-primary: #d2d7d3;
    --font-family-default: "Merriweather", serif;
    /* More variables... */
}
```

These variables are used throughout the project to maintain a consistent design
system.

## Component-Scoped CSS

Astro components can include scoped styles directly within the component file:

```astro
<style>
    header {
        display: flex;
        justify-content: space-between;
    }
</style>
```

These styles are automatically scoped to the component to prevent global style
conflicts.

## CSS Modules

For more complex styling needs, CSS modules are used (e.g., `tools.module.css`).
These provide local class name scoping to avoid conflicts between components.

This hybrid approach allows for both the utility-based rapid development that
Tailwind provides, while still supporting component-specific styling when
needed.
