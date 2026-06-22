#!/usr/bin/env node

/**
 * Lighthouse PWA Audit Script
 * Runs Lighthouse audit to validate PWA score
 */

import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class LighthouseAuditor {
    constructor() {
        this.reportBase = path.join(rootDir, 'lighthouse-report');
        this.reportPath = `${this.reportBase}.report.html`;
        this.jsonReportPath = `${this.reportBase}.report.json`;
    }

    async checkLighthouseInstalled() {
        return new Promise((resolve) => {
            const lighthouse = spawn('lighthouse', ['--version'], { stdio: 'pipe' });
            lighthouse.on('close', (code) => {
                resolve(code === 0);
            });
        });
    }

    async installLighthouse() {
        console.log('Installing Lighthouse globally...');
        return new Promise((resolve, reject) => {
            const npm = spawn('npm', ['install', '-g', 'lighthouse'], { stdio: 'inherit' });
            npm.on('close', (code) => {
                if (code === 0) {
                    console.log('✅ Lighthouse installed successfully');
                    resolve();
                } else {
                    reject(new Error('Failed to install Lighthouse'));
                }
            });
        });
    }

    async startLocalServer() {
        console.log('Starting local server...');
        return new Promise((resolve, reject) => {
            // Try to start a simple HTTP server for the docs directory
            const server = spawn('npx', ['http-server', 'docs', '-p', '8080', '-c-1'], {
                stdio: 'pipe'
            });

            let serverReady = false;
            
            server.stdout.on('data', (data) => {
                const output = data.toString();
                console.log(output);
                if (output.includes('Available on:') && !serverReady) {
                    serverReady = true;
                    setTimeout(() => resolve(server), 2000); // Give server time to fully start
                }
            });

            server.stderr.on('data', (data) => {
                console.error(`Server error: ${data}`);
            });

            server.on('close', (code) => {
                if (code !== 0 && !serverReady) {
                    reject(new Error(`Server failed to start with code ${code}`));
                }
            });

            // Timeout after 10 seconds
            setTimeout(() => {
                if (!serverReady) {
                    server.kill();
                    reject(new Error('Server failed to start within timeout'));
                }
            }, 10000);
        });
    }

    async runLighthouseAudit(url = 'http://localhost:8080') {
        console.log(`Running Lighthouse audit on ${url}...`);
        
        const args = [
            url,
            '--only-categories=accessibility,best-practices,seo',
            '--chrome-flags="--headless --no-sandbox --disable-gpu"',
            '--output=html,json',
            `--output-path=${this.reportBase}`,
            '--quiet'
        ];

        return new Promise((resolve, reject) => {
            const lighthouse = spawn('lighthouse', args, { stdio: 'inherit' });
            
            lighthouse.on('close', (code) => {
                if (code === 0) {
                    console.log('✅ Lighthouse audit completed');
                    resolve();
                } else {
                    reject(new Error(`Lighthouse audit failed with code ${code}`));
                }
            });
        });
    }

    async parseResults() {
        if (!fs.existsSync(this.jsonReportPath)) {
            throw new Error('Lighthouse JSON report not found');
        }

        const reportData = JSON.parse(fs.readFileSync(this.jsonReportPath, 'utf8'));
        
        console.log('\n' + '='.repeat(60));
        console.log('LIGHTHOUSE AUDIT RESULTS');
        console.log('='.repeat(60));

        const categories = ['accessibility', 'best-practices', 'seo'];
        let overallPassed = true;

        for (const catId of categories) {
            const category = reportData.categories[catId];
            if (!category) continue;

            const score = Math.round(category.score * 100);
            console.log(`\n${catId.toUpperCase()} Score: ${score}/100`);

            if (category.auditRefs) {
                console.log(`\n${catId.toUpperCase()} Audit Details:`);
                for (const auditRef of category.auditRefs) {
                    const audit = reportData.audits[auditRef.id];
                    if (audit && audit.score !== 1) {
                        const status = audit.score === 1 ? '✅' : audit.score === null ? '⚠️' : '❌';
                        console.log(`${status} ${audit.title}: ${audit.displayValue || audit.score}`);

                        if (audit.score !== 1 && audit.description) {
                            console.log(`   ${audit.description}`);
                        }
                    }
                }
            }
            if (score < 90) overallPassed = false;
        }

        console.log(`\nFull report available at: ${this.reportPath}`);
        
        return overallPassed;
    }

    async cleanup(server) {
        if (server) {
            console.log('Stopping local server...');
            server.kill();
        }
        
        // Clean up report files if desired
        // fs.unlinkSync(this.jsonReportPath);
    }

    async run() {
        let server = null;
        
        try {
            // Check if Lighthouse is installed
            const isInstalled = await this.checkLighthouseInstalled();
            if (!isInstalled) {
                await this.installLighthouse();
            }

            // Start local server
            server = await this.startLocalServer();
            
            // Run Lighthouse audit
            await this.runLighthouseAudit();
            
            // Parse and display results
            const success = await this.parseResults();
            
            await this.cleanup(server);
            
            return success;
            
        } catch (error) {
            console.error('❌ Lighthouse audit failed:', error.message);
            await this.cleanup(server);
            return false;
        }
    }
}

// Run audit if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const auditor = new LighthouseAuditor();
    auditor.run().then(success => {
        process.exit(success ? 0 : 1);
    }).catch(error => {
        console.error('Audit failed:', error);
        process.exit(1);
    });
}

export default LighthouseAuditor;