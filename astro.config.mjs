import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";
import { default as VitePWA } from "@vite-pwa/astro";

// https://astro.build/config
// https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project
export default defineConfig({
    site: "https://giwan.github.io",
    integrations: [mdx(), tailwind(), react(), VitePWA({
            scope: '/',
            registerType: 'prompt',
            manifest: {
                name: "Giwan Blog",
                short_name: "G1",
                description: "Personal technical blog by Giwan – built with Astro.",
                lang: "en",
                dir: "ltr",
                icons: [
                    {
                        src: "/icons/16.png",
                        sizes: "16x16",
                        type: "image/png"
                    },
                    {
                        src: "/icons/32.png",
                        sizes: "32x32",
                        type: "image/png"
                    },
                    {
                        src: "/icons/64.png",
                        sizes: "64x64",
                        type: "image/png"
                    },
                    {
                        src: "/icons/72.png",
                        sizes: "72x72",
                        type: "image/png"
                    },
                    {
                        src: "/icons/android-launchericon-96-96.png",
                        sizes: "96x96",
                        type: "image/png"
                    },
                    {
                        src: "/icons/128.png",
                        sizes: "128x128",
                        type: "image/png"
                    },
                    {
                        src: "/icons/144.png",
                        sizes: "144x144",
                        type: "image/png"
                    },
                    {
                        src: "/icons/152.png",
                        sizes: "152x152",
                        type: "image/png"
                    },
                    {
                        src: "/icons/180.png",
                        sizes: "180x180",
                        type: "image/png"
                    },
                    {
                        src: "/icons/192.png",
                        sizes: "192x192",
                        type: "image/png"
                    },
                    {
                        src: "/icons/256.png",
                        sizes: "256x256",
                        type: "image/png"
                    },
                    {
                        src: "/icons/512.png",
                        sizes: "512x512",
                        type: "image/png"
                    },
                    {
                        src: "/icons/512-maskable.png",
                        sizes: "512x512",
                        type: "image/png",
                        purpose: "maskable"
                    },
                    {
                        src: "/icons/1024.png",
                        sizes: "1024x1024",
                        type: "image/png"
                    }
                ],
                start_url: "/",
                scope: "/",
                display: "standalone",
                orientation: "portrait-primary",
                theme_color: "#272822",
                background_color: "#808080",
                categories: ["blog", "technology", "development"],
                prefer_related_applications: false
            },
            workbox: {
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
                    // Google Fonts CSS - stale-while-revalidate for stylesheets
                    {
                        urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
                        handler: 'StaleWhileRevalidate',
                        options: {
                            cacheName: 'google-fonts-stylesheets',
                            expiration: {
                                maxEntries: 10, // Limited number of font stylesheets
                                maxAgeSeconds: 7 * 24 * 60 * 60 // 7 days for stylesheets
                            }
                        }
                    },
                    // Google Fonts files - cache-first for font files
                    {
                        urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
                        handler: 'CacheFirst',
                        options: {
                            cacheName: 'google-fonts-webfonts',
                            expiration: {
                                maxEntries: 20, // Reasonable limit for font files
                                maxAgeSeconds: 365 * 24 * 60 * 60 // 1 year for font files
                            }
                        }
                    }
                ]
            }
        })],
    output: "static",
    outDir: "./docs",
    markdown: {
        shikiConfig: {
            theme: 'monokai',
            wrap: true
        }
    }
});
