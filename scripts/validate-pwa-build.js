#!/usr/bin/env node

/**
 * PWA Build Validation Script
 * Validates that the PWA build meets all requirements
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '..', 'docs');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

class PWABuildValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.validations = 0;
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  addError(message) {
    this.errors.push(message);
    this.log(message, 'error');
  }

  addWarning(message) {
    this.warnings.push(message);
    this.log(message, 'warning');
  }

  addSuccess(message) {
    this.validations++;
    this.log(message, 'success');
  }

  validateFileExists(filePath, description) {
    if (fs.existsSync(filePath)) {
      this.addSuccess(`${description} exists: ${path.relative(process.cwd(), filePath)}`);
      return true;
    } else {
      this.addError(`${description} missing: ${path.relative(process.cwd(), filePath)}`);
      return false;
    }
  }

  validateServiceWorker() {
    this.log('\n🔧 Validating Service Worker...');
    
    const swPath = path.join(DOCS_DIR, 'sw.js');
    if (!this.validateFileExists(swPath, 'Service Worker')) {
      return;
    }

    try {
      const swContent = fs.readFileSync(swPath, 'utf8');
      
      // Check for essential service worker features
      const requiredFeatures = [
        { pattern: /precacheAndRoute/, name: 'Precaching' },
        { pattern: /registerRoute/, name: 'Runtime caching routes' },
        { pattern: /NavigationRoute/, name: 'Navigation fallback' },
        { pattern: /skipWaiting/, name: 'Skip waiting' },
        { pattern: /clientsClaim/, name: 'Clients claim' },
        { pattern: /cleanupOutdatedCaches/, name: 'Cache cleanup' }
      ];

      requiredFeatures.forEach(({ pattern, name }) => {
        if (pattern.test(swContent)) {
          this.addSuccess(`Service Worker includes ${name}`);
        } else {
          this.addError(`Service Worker missing ${name}`);
        }
      });

      // Check for specific caching strategies
      const cachingStrategies = [
        { pattern: /blog-posts/, name: 'Blog posts caching' },
        { pattern: /images/, name: 'Images caching' },
        { pattern: /static-assets/, name: 'Static assets caching' },
        { pattern: /google-fonts/, name: 'Google Fonts caching' }
      ];

      cachingStrategies.forEach(({ pattern, name }) => {
        if (pattern.test(swContent)) {
          this.addSuccess(`Service Worker includes ${name}`);
        } else {
          this.addWarning(`Service Worker missing ${name}`);
        }
      });

    } catch (error) {
      this.addError(`Failed to read service worker: ${error.message}`);
    }
  }

  validateManifest() {
    this.log('\n📱 Validating Web App Manifest...');
    
    const manifestPath = path.join(DOCS_DIR, 'manifest.json');
    if (!this.validateFileExists(manifestPath, 'Web App Manifest')) {
      return;
    }

    try {
      const manifestContent = fs.readFileSync(manifestPath, 'utf8');
      const manifest = JSON.parse(manifestContent);

      // Check required manifest fields
      const requiredFields = [
        'name',
        'short_name',
        'start_url',
        'display',
        'theme_color',
        'background_color',
        'scope'
      ];

      requiredFields.forEach(field => {
        if (manifest[field]) {
          this.addSuccess(`Manifest includes required field: ${field}`);
        } else {
          this.addError(`Manifest missing required field: ${field}`);
        }
      });

      // Validate specific values based on requirements
      if (manifest.name === 'Giwan Blog') {
        this.addSuccess('Manifest name matches requirements');
      } else {
        this.addWarning(`Manifest name is "${manifest.name}", expected "Giwan Blog"`);
      }

      if (manifest.theme_color === '#272822') {
        this.addSuccess('Manifest theme color matches requirements');
      } else {
        this.addWarning(`Manifest theme color is "${manifest.theme_color}", expected "#272822"`);
      }

      if (manifest.background_color === '#808080') {
        this.addSuccess('Manifest background color matches requirements');
      } else {
        this.addWarning(`Manifest background color is "${manifest.background_color}", expected "#808080"`);
      }

      if (manifest.display === 'standalone') {
        this.addSuccess('Manifest display mode is standalone');
      } else {
        this.addError(`Manifest display mode is "${manifest.display}", expected "standalone"`);
      }

      // Check icons
      if (manifest.icons && Array.isArray(manifest.icons) && manifest.icons.length > 0) {
        this.addSuccess(`Manifest includes ${manifest.icons.length} icons`);
        
        // Check for required icon sizes
        const requiredSizes = ['192x192', '512x512'];
        const availableSizes = manifest.icons.map(icon => icon.sizes);
        
        requiredSizes.forEach(size => {
          if (availableSizes.includes(size)) {
            this.addSuccess(`Manifest includes required icon size: ${size}`);
          } else {
            this.addError(`Manifest missing required icon size: ${size}`);
          }
        });

        // Check for maskable icon
        const hasMaskable = manifest.icons.some(icon => 
          icon.purpose && icon.purpose.includes('maskable')
        );
        
        if (hasMaskable) {
          this.addSuccess('Manifest includes maskable icon');
        } else {
          this.addWarning('Manifest missing maskable icon');
        }
      } else {
        this.addError('Manifest missing icons array');
      }

    } catch (error) {
      this.addError(`Failed to parse manifest: ${error.message}`);
    }
  }

  validateIcons() {
    this.log('\n🎨 Validating PWA Icons...');
    
    const iconsDir = path.join(DOCS_DIR, 'icons');
    if (!this.validateFileExists(iconsDir, 'Icons directory')) {
      return;
    }

    // Check for required icon sizes
    const requiredIcons = [
      '16.png', '32.png', '64.png', '128.png', '192.png', '256.png', '512.png',
      '512-maskable.png'
    ];

    requiredIcons.forEach(iconFile => {
      const iconPath = path.join(iconsDir, iconFile);
      this.validateFileExists(iconPath, `Icon ${iconFile}`);
    });

    // Count total icons
    try {
      const iconFiles = fs.readdirSync(iconsDir).filter(file => 
        file.endsWith('.png') || file.endsWith('.ico') || file.endsWith('.svg')
      );
      this.addSuccess(`Found ${iconFiles.length} icon files`);
    } catch (error) {
      this.addError(`Failed to read icons directory: ${error.message}`);
    }
  }

  validateOfflinePage() {
    this.log('\n📴 Validating Offline Fallback...');
    
    const offlinePath = path.join(DOCS_DIR, 'offline', 'index.html');
    if (this.validateFileExists(offlinePath, 'Offline fallback page')) {
      try {
        const offlineContent = fs.readFileSync(offlinePath, 'utf8');
        
        // Check for basic offline page content
        if (offlineContent.includes('offline') || offlineContent.includes('Offline')) {
          this.addSuccess('Offline page contains offline messaging');
        } else {
          this.addWarning('Offline page may be missing offline messaging');
        }

        // Check for reasonable file size (should be lightweight)
        const sizeKB = Buffer.byteLength(offlineContent, 'utf8') / 1024;
        if (sizeKB < 50) {
          this.addSuccess(`Offline page is lightweight: ${sizeKB.toFixed(2)}KB`);
        } else {
          this.addWarning(`Offline page is large: ${sizeKB.toFixed(2)}KB`);
        }
      } catch (error) {
        this.addError(`Failed to read offline page: ${error.message}`);
      }
    }
  }

  validateAssetOptimization() {
    this.log('\n⚡ Validating Asset Optimization...');
    
    // Check for compressed assets
    const assetsDir = path.join(DOCS_DIR, '_astro');
    if (this.validateFileExists(assetsDir, 'Assets directory')) {
      try {
        const assetFiles = fs.readdirSync(assetsDir);
        const jsFiles = assetFiles.filter(file => file.endsWith('.js'));
        const cssFiles = assetFiles.filter(file => file.endsWith('.css'));
        
        this.addSuccess(`Found ${jsFiles.length} JavaScript files`);
        this.addSuccess(`Found ${cssFiles.length} CSS files`);

        // Check for reasonable bundle sizes
        jsFiles.forEach(file => {
          const filePath = path.join(assetsDir, file);
          const stats = fs.statSync(filePath);
          const sizeKB = stats.size / 1024;
          
          if (sizeKB > 500) {
            this.addWarning(`Large JavaScript bundle: ${file} (${sizeKB.toFixed(2)}KB)`);
          } else {
            this.addSuccess(`JavaScript bundle size OK: ${file} (${sizeKB.toFixed(2)}KB)`);
          }
        });
      } catch (error) {
        this.addError(`Failed to analyze assets: ${error.message}`);
      }
    }
  }

  validateBuildArtifacts() {
    this.log('\n🏗️ Validating Build Artifacts...');
    
    const requiredFiles = [
      'index.html',
      'sw.js',
      'manifest.json',
      'registerSW.js',
      'favicon.svg',
      'robots.txt'
    ];

    requiredFiles.forEach(file => {
      const filePath = path.join(DOCS_DIR, file);
      this.validateFileExists(filePath, `Build artifact ${file}`);
    });

    // Check for workbox file
    try {
      const files = fs.readdirSync(DOCS_DIR);
      const workboxFile = files.find(file => file.startsWith('workbox-') && file.endsWith('.js'));
      if (workboxFile) {
        this.addSuccess(`Workbox runtime found: ${workboxFile}`);
      } else {
        this.addError('Workbox runtime file not found');
      }
    } catch (error) {
      this.addError(`Failed to check for workbox file: ${error.message}`);
    }
  }

  generateReport() {
    this.log('\n📊 PWA Build Validation Report');
    this.log('='.repeat(50));
    
    this.log(`✅ Successful validations: ${this.validations}`);
    this.log(`⚠️ Warnings: ${this.warnings.length}`);
    this.log(`❌ Errors: ${this.errors.length}`);
    
    if (this.warnings.length > 0) {
      this.log('\n⚠️ Warnings:');
      this.warnings.forEach((warning, index) => {
        this.log(`  ${index + 1}. ${warning}`);
      });
    }
    
    if (this.errors.length > 0) {
      this.log('\n❌ Errors:');
      this.errors.forEach((error, index) => {
        this.log(`  ${index + 1}. ${error}`);
      });
    }
    
    const success = this.errors.length === 0;
    this.log(`\n🎯 Overall Status: ${success ? 'PASSED' : 'FAILED'}`);
    
    return success;
  }

  async run() {
    this.log('🚀 Starting PWA Build Validation...');
    
    this.validateServiceWorker();
    this.validateManifest();
    this.validateIcons();
    this.validateOfflinePage();
    this.validateAssetOptimization();
    this.validateBuildArtifacts();
    
    const success = this.generateReport();
    process.exit(success ? 0 : 1);
  }
}

// Run validation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const validator = new PWABuildValidator();
  validator.run().catch(error => {
    console.error('❌ Validation failed:', error);
    process.exit(1);
  });
}

export default PWABuildValidator;