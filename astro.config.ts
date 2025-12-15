import { defineConfig } from "astro/config";
import sharpImageService from "astro/assets/services/sharp";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import { default as VitePWA } from "@vite-pwa/astro";
import headersIntegration from "./src/integrations/headers";
import pwaValidationIntegration from "./src/integrations/pwaValidation";
import { SITE_CONFIG, PWA_CONFIG } from "./src/config";

// https://astro.build/config
// https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project
export default defineConfig({
    site: SITE_CONFIG.siteUrl,
    integrations: [mdx(), tailwind(), react(), headersIntegration(), VitePWA({
        scope: '/',
        registerType: 'prompt',
        manifestFilename: 'manifest.json',
        minify: false,
        manifest: {
            name: PWA_CONFIG.name,
            short_name: PWA_CONFIG.shortName,
            description: PWA_CONFIG.description,
            lang: PWA_CONFIG.lang,
            dir: PWA_CONFIG.dir,
            icons: PWA_CONFIG.icons,
            start_url: PWA_CONFIG.startUrl,
            scope: PWA_CONFIG.scope,
            display: PWA_CONFIG.display,
            orientation: PWA_CONFIG.orientation,
            theme_color: PWA_CONFIG.themeColor,
            background_color: PWA_CONFIG.backgroundColor,
            categories: PWA_CONFIG.categories,
            prefer_related_applications: false
        },
        workbox: {
            mode: 'development',
            disableDevLogs: true,
            navigateFallback: '/offline.html',
            globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}'],
            maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB limit
            // Cache cleanup and management policies
            cleanupOutdatedCaches: true, // Remove old caches automatically
            skipWaiting: true, // Activate new service worker immediately
            clientsClaim: true, // Take control of all clients immediately
            runtimeCaching: [
                // Blog posts - stale-while-revalidate, cache last 3 articles visited
                {
                    urlPattern: /\/blog\/.*/,
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'blog-posts',
                        expiration: {
                            maxEntries: 3, // Store only last 3 articles visited
                            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days (1 month)
                        }
                    }
                },
                // Images - cache-first with 1-month expiration and size limits
                {
                    urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'images',
                        expiration: {
                            maxEntries: 50, // Reasonable limit for images
                            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days (1 month)
                        }
                    }
                },
                // Static assets - cache-first with optimized limits
                {
                    urlPattern: /\.(?:js|css|woff|woff2|ttf|eot)$/,
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'static-assets',
                        expiration: {
                            maxEntries: 30, // Reduced for better cache management
                            maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days (1 month)
                        }
                    }
                },
                // Google Fonts stylesheets - stale while revalidate
                {
                    urlPattern: ({ url }) => url.origin === 'https://fonts.googleapis.com',
                    handler: 'StaleWhileRevalidate',
                    options: {
                        cacheName: 'google-fonts-stylesheets',
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 30 * 24 * 60 * 60
                        }
                    }
                },
                // Google Fonts files - cache first
                {
                    urlPattern: ({ url }) => url.origin === 'https://fonts.gstatic.com',
                    handler: 'CacheFirst',
                    options: {
                        cacheName: 'google-fonts-webfonts',
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 365 * 24 * 60 * 60
                        },
                        cacheableResponse: {
                            statuses: [0, 200]
                        }
                    }
                },
                // API calls - network-first
                {
                    urlPattern: /\/api\/.*/,
                    handler: 'NetworkFirst',
                    options: {
                        cacheName: 'api-cache',
                        expiration: {
                            maxEntries: 10,
                            maxAgeSeconds: 24 * 60 * 60 // 24 hours
                        }
                    }
                }
            ]
        }
    }), pwaValidationIntegration()],
    output: "static",
    outDir: "./docs",
    markdown: {
        shikiConfig: {
            theme: 'monokai',
            wrap: true
        },
        image: {
            service: sharpImageService,
        }
    }
});
