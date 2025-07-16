#!/usr/bin/env node

/**
 * Final PWA Validation Script
 * Comprehensive validation to ensure 100/100 PWA score
 * Updated with enhanced validation checks
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const docsDir = path.join(rootDir, 'docs');

class PWAValidator {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.passed = [];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
        console.log(`${prefix} [${timestamp}] ${message}`);
        
        if (type === 'error') this.errors.push(message);
        else if (type === 'warning') this.warnings.push(message);
        else this.passed.push(message);
    }

    validateManifest() {
        this.log('Validating Web App Manifest...');
        
        const manifestPath = path.join(docsDir, 'manifest.webmanifest');
        if (!fs.existsSync(manifestPath)) {
            this.log('manifest.webmanifest not found in docs directory', 'error');
            return;
        }

        try {
            const manifestContent = fs.readFileSync(manifestPath, 'utf8');
            const manifest = JSON.parse(manifestContent);

            // Required fields for PWA
            const requiredFields = ['name', 'short_name', 'start_url', 'display', 'theme_color', 'background_color', 'icons'];
            
            for (const field of requiredFields) {
                if (!manifest[field]) {
                    this.log(`Missing required manifest field: ${field}`, 'error');
                } else {
                    this.log(`Manifest field '${field}' present`);
                }
            }

            // Validate icons
            if (manifest.icons && Array.isArray(manifest.icons)) {
                const requiredSizes = ['192x192', '512x512'];
                const foundSizes = manifest.icons.map(icon => icon.sizes);
                
                for (const size of requiredSizes) {
                    if (!foundSizes.includes(size)) {
                        this.log(`Missing required icon size: ${size}`, 'error');
                    } else {
                        this.log(`Icon size ${size} present`);
                    }
                }

                // Check if icon files exist
                for (const icon of manifest.icons) {
                    const iconPath = path.join(docsDir, icon.src);
                    if (!fs.existsSync(iconPath)) {
                        this.log(`Icon file not found: ${icon.src}`, 'error');
                    } else {
                        this.log(`Icon file exists: ${icon.src}`);
                    }
                }
            }

            // Validate display mode
            const validDisplayModes = ['fullscreen', 'standalone', 'minimal-ui', 'browser'];
            if (!validDisplayModes.includes(manifest.display)) {
                this.log(`Invalid display mode: ${manifest.display}`, 'error');
            } else {
                this.log(`Valid display mode: ${manifest.display}`);
            }

        } catch (error) {
            this.log(`Error parsing manifest: ${error.message}`, 'error');
        }
    }

    validateServiceWorker() {
        this.log('Validating Service Worker...');
        
        const swPath = path.join(docsDir, 'sw.js');
        if (!fs.existsSync(swPath)) {
            this.log('Service worker (sw.js) not found', 'error');
            return;
        }

        try {
            const swContent = fs.readFileSync(swPath, 'utf8');
            
            // Check for essential service worker features
            const requiredFeatures = [
                'install',
                'activate', 
                'fetch',
                'cache',
                'precache'
            ];

            for (const feature of requiredFeatures) {
                if (swContent.includes(feature)) {
                    this.log(`Service worker includes ${feature} handling`);
                } else {
                    this.log(`Service worker missing ${feature} handling`, 'warning');
                }
            }

            this.log('Service worker file exists and appears functional');
        } catch (error) {
            this.log(`Error reading service worker: ${error.message}`, 'error');
        }
    }

    validateOfflinePage() {
        this.log('Validating Offline Fallback...');
        
        const offlinePath = path.join(docsDir, 'offline', 'index.html');
        if (!fs.existsSync(offlinePath)) {
            this.log('Offline fallback page not found at /offline/', 'error');
            return;
        }

        try {
            const offlineContent = fs.readFileSync(offlinePath, 'utf8');
            
            // Check for basic HTML structure
            if (offlineContent.includes('<html') && offlineContent.includes('</html>')) {
                this.log('Offline page has valid HTML structure');
            } else {
                this.log('Offline page missing proper HTML structure', 'error');
            }

            // Check for offline-specific content
            if (offlineContent.toLowerCase().includes('offline')) {
                this.log('Offline page contains offline messaging');
            } else {
                this.log('Offline page should include offline messaging', 'warning');
            }

        } catch (error) {
            this.log(`Error reading offline page: ${error.message}`, 'error');
        }
    }

    validateHTTPS() {
        this.log('Validating HTTPS Configuration...');
        
        // Check for security headers file
        const headersPath = path.join(docsDir, '_headers');
        if (fs.existsSync(headersPath)) {
            const headersContent = fs.readFileSync(headersPath, 'utf8');
            
            if (headersContent.includes('Strict-Transport-Security')) {
                this.log('HSTS header configured');
            } else {
                this.log('Consider adding HSTS header for enhanced security', 'warning');
            }
        }

        this.log('HTTPS is required for PWA - ensure deployment uses HTTPS');
    }

    validateIcons() {
        this.log('Validating PWA Icons...');
        
        const iconsDir = path.join(docsDir, 'icons');
        if (!fs.existsSync(iconsDir)) {
            this.log('Icons directory not found', 'error');
            return;
        }

        const requiredIcons = [
            '192.png',
            '512.png',
            '512-maskable.png'
        ];

        for (const icon of requiredIcons) {
            const iconPath = path.join(iconsDir, icon);
            if (fs.existsSync(iconPath)) {
                this.log(`Required icon exists: ${icon}`);
            } else {
                this.log(`Missing required icon: ${icon}`, 'error');
            }
        }
    }

    validateMetaTags() {
        this.log('Validating PWA Meta Tags...');
        
        const indexPath = path.join(docsDir, 'index.html');
        if (!fs.existsSync(indexPath)) {
            this.log('index.html not found', 'error');
            return;
        }

        try {
            const indexContent = fs.readFileSync(indexPath, 'utf8');
            
            const requiredMetaTags = [
                'viewport',
                'theme-color',
                'apple-mobile-web-app-capable',
                'apple-mobile-web-app-status-bar-style'
            ];

            for (const metaTag of requiredMetaTags) {
                if (indexContent.includes(metaTag)) {
                    this.log(`Meta tag present: ${metaTag}`);
                } else {
                    this.log(`Missing meta tag: ${metaTag}`, 'warning');
                }
            }

        } catch (error) {
            this.log(`Error reading index.html: ${error.message}`, 'error');
        }
    }

    validateCaching() {
        this.log('Validating Caching Strategy...');
        
        // Check if workbox files are present
        const workboxFiles = fs.readdirSync(docsDir).filter(file => 
            file.includes('workbox') || file.includes('sw')
        );

        if (workboxFiles.length > 0) {
            this.log(`Workbox/SW files found: ${workboxFiles.join(', ')}`);
        } else {
            this.log('No workbox or service worker files found', 'warning');
        }
    }

    validateBuildOutput() {
        this.log('Validating Build Output...');
        
        if (!fs.existsSync(docsDir)) {
            this.log('Build output directory (docs) not found', 'error');
            return;
        }

        const requiredFiles = [
            'index.html',
            'manifest.webmanifest',
            'sw.js'
        ];

        for (const file of requiredFiles) {
            const filePath = path.join(docsDir, file);
            if (fs.existsSync(filePath)) {
                this.log(`Build output includes: ${file}`);
            } else {
                this.log(`Missing from build output: ${file}`, 'error');
            }
        }
    }

    generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('PWA VALIDATION REPORT');
        console.log('='.repeat(60));
        
        console.log(`\n✅ Passed: ${this.passed.length}`);
        console.log(`⚠️  Warnings: ${this.warnings.length}`);
        console.log(`❌ Errors: ${this.errors.length}`);

        if (this.warnings.length > 0) {
            console.log('\nWarnings:');
            this.warnings.forEach(warning => console.log(`  - ${warning}`));
        }

        if (this.errors.length > 0) {
            console.log('\nErrors:');
            this.errors.forEach(error => console.log(`  - ${error}`));
        }

        console.log('\n' + '='.repeat(60));
        
        if (this.errors.length === 0) {
            console.log('🎉 PWA validation passed! Ready for Lighthouse audit.');
            return true;
        } else {
            console.log('❌ PWA validation failed. Please fix errors before proceeding.');
            return false;
        }
    }

    async run() {
        console.log('Starting comprehensive PWA validation...\n');
        
        this.validateBuildOutput();
        this.validateManifest();
        this.validateServiceWorker();
        this.validateOfflinePage();
        this.validateIcons();
        this.validateMetaTags();
        this.validateCaching();
        this.validateHTTPS();
        
        return this.generateReport();
    }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const validator = new PWAValidator();
    validator.run().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Validation failed:', error);
        process.exit(1);
    });
}

export default PWAValidator;