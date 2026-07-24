import fs from 'node:fs';
import path from 'node:path';
import { devConsole } from '../utils/isDev';

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
  Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
  Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cloud.umami.is; connect-src 'self' https://cloud.umami.is; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://res.cloudinary.com https://ik.imagekit.io https://storage.googleapis.com; font-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none';
  Permissions-Policy: accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), publickey-credentials-get=(), sync-xhr=(), usb=(), web-share=(), xr-spatial-tracking=()
  
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
          // Only log in development mode
          devConsole('log', ['\x1b[32m%s\x1b[0m', '✅ _headers file generated successfully']);
        } catch (error: any) {
          // Only log errors in development mode
          devConsole('error', ['\x1b[31m%s\x1b[0m', `❌ Failed to generate _headers file: ${error.message}`]);
        }
      },
    },
  };
}
