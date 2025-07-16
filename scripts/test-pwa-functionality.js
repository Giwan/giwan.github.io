#!/usr/bin/env node

/**
 * PWA Functionality Testing Script
 * Tests installation process and offline functionality
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class PWAFunctionalityTester {
    constructor() {
        this.browser = null;
        this.page = null;
        this.server = null;
        this.testResults = [];
    }

    log(message, passed = true) {
        const status = passed ? '✅' : '❌';
        console.log(`${status} ${message}`);
        this.testResults.push({ message, passed });
    }

    async startServer() {
        console.log('Starting test server...');
        return new Promise((resolve, reject) => {
            this.server = spawn('npx', ['http-server', 'docs', '-p', '8081', '-c-1'], {
                stdio: 'pipe'
            });

            let serverReady = false;
            
            this.server.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('Available on:') && !serverReady) {
                    serverReady = true;
                    setTimeout(() => resolve(), 2000);
                }
            });

            this.server.on('close', (code) => {
                if (code !== 0 && !serverReady) {
                    reject(new Error(`Server failed to start with code ${code}`));
                }
            });

            setTimeout(() => {
                if (!serverReady) {
                    this.server.kill();
                    reject(new Error('Server timeout'));
                }
            }, 10000);
        });
    }

    async setupBrowser() {
        console.log('Setting up browser...');
        this.browser = await puppeteer.launch({
            headless: true,
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-web-security',
                '--allow-running-insecure-content'
            ]
        });
        
        this.page = await this.browser.newPage();
        await this.page.setViewport({ width: 1200, height: 800 });
    }

    async testServiceWorkerRegistration() {
        console.log('\nTesting Service Worker Registration...');
        
        try {
            await this.page.goto('http://localhost:8081', { waitUntil: 'networkidle2' });
            
            // Wait for service worker registration
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            const swRegistered = await this.page.evaluate(() => {
                return 'serviceWorker' in navigator && navigator.serviceWorker.controller !== null;
            });
            
            this.log('Service Worker registered and active', swRegistered);
            
            // Check if service worker is controlling the page
            const swControlling = await this.page.evaluate(() => {
                return navigator.serviceWorker.controller !== null;
            });
            
            this.log('Service Worker controlling the page', swControlling);
            
        } catch (error) {
            this.log(`Service Worker registration test failed: ${error.message}`, false);
        }
    }

    async testManifestParsing() {
        console.log('\nTesting Web App Manifest...');
        
        try {
            // Check if manifest link exists
            const manifestLink = await this.page.$('link[rel="manifest"]');
            this.log('Manifest link tag present', !!manifestLink);
            
            if (manifestLink) {
                const manifestHref = await this.page.evaluate(
                    el => el.href, 
                    manifestLink
                );
                this.log(`Manifest URL: ${manifestHref}`);
                
                // Test manifest accessibility
                const manifestResponse = await this.page.goto(manifestHref);
                const manifestValid = manifestResponse.status() === 200;
                this.log('Manifest file accessible', manifestValid);
                
                if (manifestValid) {
                    const manifestContent = await manifestResponse.text();
                    try {
                        const manifest = JSON.parse(manifestContent);
                        this.log('Manifest JSON is valid', true);
                        this.log(`App name: ${manifest.name || manifest.short_name}`);
                        this.log(`Start URL: ${manifest.start_url}`);
                        this.log(`Display mode: ${manifest.display}`);
                        this.log(`Icons count: ${manifest.icons?.length || 0}`);
                    } catch (parseError) {
                        this.log('Manifest JSON parsing failed', false);
                    }
                }
            }
            
        } catch (error) {
            this.log(`Manifest test failed: ${error.message}`, false);
        }
    }

    async testInstallPrompt() {
        console.log('\nTesting Install Prompt...');
        
        try {
            await this.page.goto('http://localhost:8081', { waitUntil: 'networkidle2' });
            
            // Check for beforeinstallprompt event handling
            const installPromptSupported = await this.page.evaluate(() => {
                return new Promise((resolve) => {
                    let prompted = false;
                    
                    window.addEventListener('beforeinstallprompt', (e) => {
                        prompted = true;
                        resolve(true);
                    });
                    
                    // Timeout after 5 seconds
                    setTimeout(() => {
                        resolve(prompted);
                    }, 5000);
                });
            });
            
            this.log('Install prompt event handling', installPromptSupported);
            
        } catch (error) {
            this.log(`Install prompt test failed: ${error.message}`, false);
        }
    }

    async testOfflineFunctionality() {
        console.log('\nTesting Offline Functionality...');
        
        try {
            await this.page.goto('http://localhost:8081', { waitUntil: 'networkidle2' });
            
            // Wait for service worker to be ready
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // Simulate offline mode
            await this.page.setOfflineMode(true);
            this.log('Offline mode enabled');
            
            // Try to navigate to a cached page
            try {
                await this.page.reload({ waitUntil: 'networkidle2' });
                this.log('Page loads while offline', true);
            } catch (error) {
                this.log('Page failed to load while offline', false);
            }
            
            // Test offline fallback
            try {
                await this.page.goto('http://localhost:8081/non-existent-page', { 
                    waitUntil: 'networkidle2',
                    timeout: 10000 
                });
                
                const pageContent = await this.page.content();
                const isOfflinePage = pageContent.toLowerCase().includes('offline');
                this.log('Offline fallback page served', isOfflinePage);
                
            } catch (error) {
                // This might be expected if offline fallback isn't working
                this.log('Offline fallback test inconclusive', false);
            }
            
            // Re-enable online mode
            await this.page.setOfflineMode(false);
            this.log('Online mode restored');
            
        } catch (error) {
            this.log(`Offline functionality test failed: ${error.message}`, false);
        }
    }

    async testCaching() {
        console.log('\nTesting Caching Strategy...');
        
        try {
            await this.page.goto('http://localhost:8081', { waitUntil: 'networkidle2' });
            
            // Check cache storage
            const cacheNames = await this.page.evaluate(async () => {
                if ('caches' in window) {
                    return await caches.keys();
                }
                return [];
            });
            
            this.log(`Cache storage available: ${cacheNames.length > 0}`, cacheNames.length > 0);
            
            if (cacheNames.length > 0) {
                this.log(`Active caches: ${cacheNames.join(', ')}`);
                
                // Check if main page is cached
                const mainPageCached = await this.page.evaluate(async () => {
                    const cacheNames = await caches.keys();
                    for (const cacheName of cacheNames) {
                        const cache = await caches.open(cacheName);
                        const cachedResponse = await cache.match('/');
                        if (cachedResponse) {
                            return true;
                        }
                    }
                    return false;
                });
                
                this.log('Main page is cached', mainPageCached);
            }
            
        } catch (error) {
            this.log(`Caching test failed: ${error.message}`, false);
        }
    }

    async testUpdateNotification() {
        console.log('\nTesting Update Notification...');
        
        try {
            await this.page.goto('http://localhost:8081', { waitUntil: 'networkidle2' });
            
            // Look for update notification component
            const updateNotificationExists = await this.page.evaluate(() => {
                // Check for common update notification selectors
                const selectors = [
                    '[data-testid="update-notification"]',
                    '.update-notification',
                    '[class*="update"]',
                    '[id*="update"]'
                ];
                
                return selectors.some(selector => {
                    return document.querySelector(selector) !== null;
                });
            });
            
            this.log('Update notification component present', updateNotificationExists);
            
        } catch (error) {
            this.log(`Update notification test failed: ${error.message}`, false);
        }
    }

    async generateReport() {
        console.log('\n' + '='.repeat(60));
        console.log('PWA FUNCTIONALITY TEST REPORT');
        console.log('='.repeat(60));
        
        const passed = this.testResults.filter(r => r.passed).length;
        const failed = this.testResults.filter(r => !r.passed).length;
        const total = this.testResults.length;
        
        console.log(`\n✅ Passed: ${passed}/${total}`);
        console.log(`❌ Failed: ${failed}/${total}`);
        console.log(`📊 Success Rate: ${Math.round((passed / total) * 100)}%`);
        
        if (failed > 0) {
            console.log('\nFailed Tests:');
            this.testResults
                .filter(r => !r.passed)
                .forEach(r => console.log(`  - ${r.message}`));
        }
        
        console.log('\n' + '='.repeat(60));
        
        return failed === 0;
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
        }
        
        if (this.server) {
            this.server.kill();
        }
    }

    async run() {
        try {
            await this.startServer();
            await this.setupBrowser();
            
            await this.testServiceWorkerRegistration();
            await this.testManifestParsing();
            await this.testInstallPrompt();
            await this.testOfflineFunctionality();
            await this.testCaching();
            await this.testUpdateNotification();
            
            const success = await this.generateReport();
            await this.cleanup();
            
            return success;
            
        } catch (error) {
            console.error('❌ PWA functionality testing failed:', error.message);
            await this.cleanup();
            return false;
        }
    }
}

// Run tests if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const tester = new PWAFunctionalityTester();
    tester.run().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Testing failed:', error);
        process.exit(1);
    });
}

export default PWAFunctionalityTester;