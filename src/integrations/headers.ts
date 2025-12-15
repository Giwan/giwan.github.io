import fs from 'node:fs';
import path from 'node:path';

/**
 * Astro integration to generate _headers file for Cloudflare Pages / Netlify / Vercel
 */
export default function headersIntegration() {
    return {
        name: 'generate-headers',
        hooks: {
            'astro:build:done': async ({ dir }: { dir: URL }) => {
                const headersContent = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  
/manifest.json
  Content-Type: application/manifest+json
  Cache-Control: public, max-age=86400
  
/sw.js
  Content-Type: application/javascript
  Cache-Control: public, max-age=0, must-revalidate
  
/icons/*
  Cache-Control: public, max-age=31536000, immutable
  
/_astro/*
  Cache-Control: public, max-age=31536000, immutable`;

                const headersPath = path.join(dir.pathname, '_headers');

                // Remove file:// prefix if present (common in some environments)
                const cleanPath = headersPath.startsWith('file:') ? new URL(headersPath).pathname : headersPath;

                try {
                    fs.writeFileSync(cleanPath, headersContent);
                    console.log('\x1b[32m%s\x1b[0m', '✅ _headers file generated successfully');
                } catch (error: any) {
                    console.error('\x1b[31m%s\x1b[0m', `❌ Failed to generate _headers file: ${error.message}`);
                }
            },
        },
    };
}
