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
            workbox: {
                navigateFallback: '/index.html'
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
