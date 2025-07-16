#!/usr/bin/env node

/**
 * Build Optimization Script for PWA
 * Optimizes the build output for better PWA performance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');

class BuildOptimizer {
    constructor() {
        this.optimizations = [];
        this.errors = [];
    }

    log(message, type = 'info') {
        const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
        console.log(`${prefix} ${message}`);
        
        if (type === 'error') this.errors.push(message);
        else this.optimizations.push(message);
    }

    optimizeServiceWorker() {
        this.log('Optimizing Service Worker...');
        
        const swPath = path.join(docsDir, 'sw.js');
        if (!fs.existsSync(swPath)) {
            this.log('Service worker not found', 'error');
            return;
        }

        try {
            let swContent = fs.readFileSync(swPath, 'utf8');
            
            // Add performance optimizations to service worker
            const optimizations = `
// PWA Performance Optimizations
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    event.waitUntil(self.clients.claim());
});

// Network-first strategy for API calls
self.addEventListener('fetch', (event) => {
    if (event.request.url.includes('/api/')) {
        event.respondWith(
            fetch(event.request)
                .catch(() => caches.match(event.request))
        );
    }
});
`;

            // Only add if not already present
            if (!swContent.includes('Service Worker installing')) {
                swContent = optimizations + '\n' + swContent;
                fs.writeFileSync(swPath, swContent);
                this.log('Service worker optimized with performance enhancements');
            } else {
                this.log('Service worker already optimized');
            }

        } catch (error) {
            this.log(`Service worker optimization failed: ${error.message}`, 'error');
        }
    }

    optimizeManifest() {
        this.log('Optimizing Web App Manifest...');
        
        const manifestPath = path.join(docsDir, 'manifest.webmanifest');
        if (!fs.existsSync(manifestPath)) {
            this.log('Manifest not found', 'error');
            return;
        }

        try {
            const manifestContent = fs.readFileSync(manifestPath, 'utf8');
            const manifest = JSON.parse(manifestContent);
            
            // Ensure optimal PWA manifest settings (only add if missing)
            const optimizations = {
                orientation: 'portrait-primary',
                lang: 'en',
                dir: 'ltr'
            };

            let modified = false;
            for (const [key, value] of Object.entries(optimizations)) {
                if (!manifest[key]) {
                    manifest[key] = value;
                    modified = true;
                }
            }

            // Ensure categories exist but don't overwrite existing ones
            if (!manifest.categories || !Array.isArray(manifest.categories)) {
                manifest.categories = ['blog', 'technology', 'development'];
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
                this.log('Manifest optimized with additional PWA fields');
            } else {
                this.log('Manifest already optimized');
            }

        } catch (error) {
            this.log(`Manifest optimization failed: ${error.message}`, 'error');
        }
    }

    optimizeHeaders() {
        this.log('Optimizing HTTP Headers...');
        
        const headersPath = path.join(docsDir, '_headers');
        const headers = `/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  
/manifest.webmanifest
  Content-Type: application/manifest+json
  Cache-Control: public, max-age=86400
  
/sw.js
  Content-Type: application/javascript
  Cache-Control: public, max-age=0, must-revalidate
  
/icons/*
  Cache-Control: public, max-age=31536000, immutable
  
/_astro/*
  Cache-Control: public, max-age=31536000, immutable`;

        try {
            fs.writeFileSync(headersPath, headers);
            this.log('HTTP headers optimized for PWA performance and security');
        } catch (error) {
            this.log(`Headers optimization failed: ${error.message}`, 'error');
        }
    }

    validateBuildSize() {
        this.log('Validating Build Size...');
        
        try {
            const stats = this.getDirectorySize(docsDir);
            const sizeMB = (stats / 1024 / 1024).toFixed(2);
            
            this.log(`Total build size: ${sizeMB} MB`);
            
            if (stats > 50 * 1024 * 1024) { // 50MB
                this.log('Build size is quite large, consider optimization', 'warning');
            } else {
                this.log('Build size is reasonable for PWA');
            }

        } catch (error) {
            this.log(`Build size validation failed: ${error.message}`, 'error');
        }
    }

    getDirectorySize(dirPath) {
        let totalSize = 0;
        
        const files = fs.readdirSync(dirPath);
        for (const file of files) {
            const filePath = path.join(dirPath, file);
            const stats = fs.statSync(filePath);
            
            if (stats.isDirectory()) {
                totalSize += this.getDirectorySize(filePath);
            } else {
                totalSize += stats.size;
            }
        }
        
        return totalSize;
    }

    optimizeAssets() {
        this.log('Optimizing Assets...');
        
        // Check for large assets that might need optimization
        const iconsDir = path.join(docsDir, 'icons');
        if (fs.existsSync(iconsDir)) {
            const iconFiles = fs.readdirSync(iconsDir);
            let largeIcons = 0;
            
            for (const icon of iconFiles) {
                const iconPath = path.join(iconsDir, icon);
                const stats = fs.statSync(iconPath);
                
                if (stats.size > 100 * 1024) { // 100KB
                    largeIcons++;
                }
            }
            
            if (largeIcons > 0) {
                this.log(`Found ${largeIcons} large icon files, consider optimization`, 'warning');
            } else {
                this.log('Icon files are optimally sized');
            }
        }
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('BUILD OPTIMIZATION REPORT');
        console.log('='.repeat(60));
        
        console.log(`\n✅ Optimizations Applied: ${this.optimizations.length}`);
        console.log(`❌ Errors: ${this.errors.length}`);

        if (this.errors.length > 0) {
            console.log('\nErrors:');
            this.errors.forEach(error => console.log(`  - ${error}`));
        }

        console.log('\n' + '='.repeat(60));
        
        if (this.errors.length === 0) {
            console.log('🎉 Build optimization completed successfully!');
            return true;
        } else {
            console.log('❌ Build optimization completed with errors.');
            return false;
        }
    }

    async run() {
        console.log('Starting build optimization for PWA...\n');
        
        this.optimizeServiceWorker();
        this.optimizeManifest();
        this.optimizeHeaders();
        this.validateBuildSize();
        this.optimizeAssets();
        
        return this.generateReport();
    }
}

// Run optimization if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const optimizer = new BuildOptimizer();
    optimizer.run().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Optimization failed:', error);
        process.exit(1);
    });
}

export default BuildOptimizer;