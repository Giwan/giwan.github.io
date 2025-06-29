import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import tailwind from "@astrojs/tailwind";
import react from "@astrojs/react";

// https://astro.build/config
// https://docs.astro.build/en/guides/server-side-rendering/#enabling-ssr-in-your-project
export default defineConfig({
    site: "https://giwan.github.io",
    integrations: [mdx(), tailwind(), react()],
    output: "static",
    outDir: "./docs",
    markdown: {
        shikiConfig: {
            theme: 'monokai',
            wrap: true
        }
    }
});
