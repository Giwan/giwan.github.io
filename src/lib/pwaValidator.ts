import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import {Buffer} from 'node:buffer';
import {devConsole} from '../utils/isDev.js';

function isError(value: unknown): value is Error {
    return Object.prototype.toString.call(value) === '[object Error]';
}

type LogType =
    | 'info'
    | 'warning'
    | 'error'
    | 'success';
type Logger = {
    info: (message?: string) => void;
    warn: (message?: string) => void;
    error: (message?: string) => void;
};

interface ManifestExpectations {
    name: string;
    shortName: string;
    themeColor: string;
    backgroundColor: string;
    display: string;
    startUrl: string;
    scope: string;
}

export interface PwaValidationOptions {
    outputDir: string;
    manifestExpectations: ManifestExpectations;
    requiredIconFiles: string[];
    logger?: Logger;
}

export interface ValidationResult {
    success: boolean;
    errors: string[];
    warnings: string[];
    passed: number;
}

export class PWABuildValidator {
    private readonly docsDir: string;
    private readonly manifestExpectations: ManifestExpectations;
    private readonly requiredIconFiles: string[];
    private readonly logger: Logger;
    private errors: string[] = [];
    private warnings: string[] = [];
    private validations = 0;
    constructor(options: PwaValidationOptions) {
        this.docsDir = options.outputDir;
        this.manifestExpectations = options.manifestExpectations;
        this.requiredIconFiles = options.requiredIconFiles;
        this.logger = options.logger ?? {
            info: (message?: string) => devConsole('log', [message]),
            warn: (message?: string) => devConsole('warn', [message]),
            error: (message?: string) => devConsole('error', [message]),
        };
    }

    private log(message: string, type: LogType = 'info') {
        const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️';
        const writer = type === 'error' ? this.logger.error : type === 'warning' ? this.logger.warn : this.logger.info;

        writer(`${prefix} ${message}`);
    }

    private addError(message: string) {
        this.errors.push(message);
        this.log(message, 'error');
    }

    private addWarning(message: string) {
        this.warnings.push(message);
        this.log(message, 'warning');
    }

    private addSuccess(message: string) {
        ++this.validations;
        this.log(message, 'success');
    }

    private validateFileExists(filePath: string, description: string) {
        if (fs.existsSync(filePath)) {
            this.addSuccess(`${description} exists: ${path.relative(process.cwd(), filePath)}`);
            return true;
        }

        this.addError(`${description} missing: ${path.relative(process.cwd(), filePath)}`);

        return false;
    }

    private validateServiceWorker() {
        this.log('\n🔧 Validating Service Worker...');

        const swPath = path.join(this.docsDir, 'sw.js');

        if (!this.validateFileExists(swPath, 'Service Worker'))
            return;

        try {
            const swContent = fs.readFileSync(swPath, 'utf8');
            const requiredFeatures = [{
                pattern: /precacheAndRoute/,
                name: 'Precaching',
            }, {
                pattern: /registerRoute/,
                name: 'Runtime caching routes',
            }, {
                pattern: /NavigationRoute/,
                name: 'Navigation fallback',
            }, {
                pattern: /skipWaiting/,
                name: 'Skip waiting',
            }, {
                pattern: /clientsClaim/,
                name: 'Clients claim',
            }, {
                pattern: /cleanupOutdatedCaches/,
                name: 'Cache cleanup',
            }];

            for (const {pattern, name} of requiredFeatures) {
                if (pattern.test(swContent))
                    this.addSuccess(`Service Worker includes ${name}`);
                else
                    this.addError(`Service Worker missing ${name}`);
            }

            const cachingStrategies = [{
                pattern: /blog-posts/,
                name: 'Blog posts caching',
            }, {
                pattern: /images/,
                name: 'Images caching',
            }, {
                pattern: /static-assets/,
                name: 'Static assets caching',
            }, {
                pattern: /google-fonts/,
                name: 'Google Fonts caching',
            }];

            for (const {pattern, name} of cachingStrategies) {
                if (pattern.test(swContent))
                    this.addSuccess(`Service Worker includes ${name}`);
                else
                    this.addWarning(`Service Worker missing ${name}`);
            }
        } catch(error) {
            const message = isError(error) ? error.message : String(error);
            this.addError(`Failed to read service worker: ${message}`);
        }
    }

    private validateManifest() {
        this.log('\n📱 Validating Web App Manifest...');

        const manifestPath = path.join(this.docsDir, 'manifest.json');

        if (!this.validateFileExists(manifestPath, 'Web App Manifest'))
            return;

        try {
            const manifestContent = fs.readFileSync(manifestPath, 'utf8');
            const manifest = JSON.parse(manifestContent);

            const requiredFields = [
                'name',
                'short_name',
                'start_url',
                'display',
                'theme_color',
                'background_color',
                'scope',
            ];

            for (const field of requiredFields) {
                if (manifest[field])
                    this.addSuccess(`Manifest includes required field: ${field}`);
                else
                    this.addError(`Manifest missing required field: ${field}`);
            }

            if (manifest.name === this.manifestExpectations.name)
                this.addSuccess('Manifest name matches requirements');
            else
                this.addWarning(`Manifest name is "${manifest.name}", expected "${this.manifestExpectations.name}"`);

            if (manifest.short_name === this.manifestExpectations.shortName)
                this.addSuccess('Manifest short name matches requirements');
            else
                this.addWarning(`Manifest short name is "${manifest.short_name}", expected "${this.manifestExpectations.shortName}"`);

            if (manifest.theme_color === this.manifestExpectations.themeColor)
                this.addSuccess('Manifest theme color matches requirements');
            else
                this.addWarning(`Manifest theme color is "${manifest.theme_color}", expected "${this.manifestExpectations.themeColor}"`);

            if (manifest.background_color === this.manifestExpectations.backgroundColor)
                this.addSuccess('Manifest background color matches requirements');
            else
                this.addWarning(`Manifest background color is "${manifest.background_color}", expected "${this.manifestExpectations.backgroundColor}"`);

            if (manifest.display === this.manifestExpectations.display)
                this.addSuccess(`Manifest display mode is ${this.manifestExpectations.display}`);
            else
                this.addError(`Manifest display mode is "${manifest.display}", expected "${this.manifestExpectations.display}"`);

            if (Array.isArray(manifest.icons) && manifest.icons.length > 0) {
                this.addSuccess(`Manifest includes ${manifest.icons.length} icons`);
                const availableSizes = manifest.icons.map((icon: {
                    sizes: string;
                }) => icon.sizes);

                const requiredSizes = ['192x192', '512x512'];

                for (const size of requiredSizes) {
                    if (availableSizes.includes(size))
                        this.addSuccess(`Manifest includes required icon size: ${size}`);
                    else
                        this.addError(`Manifest missing required icon size: ${size}`);
                }

                const hasMaskable = manifest.icons.some((icon: {
                    purpose?: string;
                }) => icon.purpose?.includes('maskable'));

                if (hasMaskable)
                    this.addSuccess('Manifest includes maskable icon');
                else
                    this.addWarning('Manifest missing maskable icon');
            } else {
                this.addError('Manifest missing icons array');
            }
        } catch(error) {
            const message = isError(error) ? error.message : String(error);
            this.addError(`Failed to parse manifest: ${message}`);
        }
    }

    private validateIcons() {
        this.log('\n🎨 Validating PWA Icons...');

        const iconsDir = path.join(this.docsDir, 'icons');

        if (!this.validateFileExists(iconsDir, 'Icons directory'))
            return;

        for (const iconFile of this.requiredIconFiles) {
            const iconPath = path.join(iconsDir, iconFile);
            this.validateFileExists(iconPath, `Icon ${iconFile}`);
        }

        try {
            const iconFiles = fs
                .readdirSync(iconsDir)
                .filter((file: string) => file.endsWith('.png') || file.endsWith('.ico'));

            this.addSuccess(`Found ${iconFiles.length} icon files`);
        } catch(error) {
            const message = isError(error) ? error.message : String(error);
            this.addError(`Failed to read icons directory: ${message}`);
        }
    }

    private validateOfflinePage() {
        this.log('\n📴 Validating Offline Fallback...');

        const offlinePath = path.join(this.docsDir, 'offline', 'index.html');

        if (this.validateFileExists(offlinePath, 'Offline fallback page'))
            try {
                const offlineContent = fs.readFileSync(offlinePath, 'utf8');

                if (/offline/i.test(offlineContent))
                    this.addSuccess('Offline page contains offline messaging');
                else
                    this.addWarning('Offline page may be missing offline messaging');

                const sizeKB = Buffer.byteLength(offlineContent, 'utf8') / 1024;

                if (sizeKB < 50)
                    this.addSuccess(`Offline page is lightweight: ${sizeKB.toFixed(2)}KB`);
                else
                    this.addWarning(`Offline page is large: ${sizeKB.toFixed(2)}KB`);
            } catch(error) {
                const message = isError(error) ? error.message : String(error);
                this.addError(`Failed to read offline page: ${message}`);
            }    }

    private validateAssetOptimization() {
        this.log('\n⚡ Validating Asset Optimization...');

        const assetsDir = path.join(this.docsDir, '_astro');

        if (!this.validateFileExists(assetsDir, 'Assets directory'))
            return;

        try {
            const assetFiles = fs.readdirSync(assetsDir);
            const jsFiles = assetFiles.filter((file) => file.endsWith('.js'));
            const cssFiles = assetFiles.filter((file) => file.endsWith('.css'));

            this.addSuccess(`Found ${jsFiles.length} JavaScript files`);
            this.addSuccess(`Found ${cssFiles.length} CSS files`);

            for (const file of jsFiles) {
                const filePath = path.join(assetsDir, file);
                const stats = fs.statSync(filePath);
                const sizeKB = stats.size / 1024;

                if (sizeKB > 500)
                    this.addWarning(`Large JavaScript bundle: ${file} (${sizeKB.toFixed(2)}KB)`);
                else
                    this.addSuccess(`JavaScript bundle size OK: ${file} (${sizeKB.toFixed(2)}KB)`);
            }
        } catch(error) {
            const message = isError(error) ? error.message : String(error);
            this.addError(`Failed to analyze assets: ${message}`);
        }
    }

    private validateBuildArtifacts() {
        this.log('\n🏗️ Validating Build Artifacts...');

        const requiredFiles = [
            'index.html',
            'sw.js',
            'manifest.json',
            'registerSW.js',
            'favicon.svg',
            'robots.txt',
        ];

        for (const file of requiredFiles) {
            const filePath = path.join(this.docsDir, file);
            this.validateFileExists(filePath, `Build artifact ${file}`);
        }

        try {
            const files = fs.readdirSync(this.docsDir);
            const workboxFile = files.find((file) => file.startsWith('workbox-') && file.endsWith('.js'));

            if (workboxFile)
                this.addSuccess(`Workbox runtime found: ${workboxFile}`);
            else
                this.addError('Workbox runtime file not found');
        } catch(error) {
            const message = isError(error) ? error.message : String(error);
            this.addError(`Failed to check for workbox file: ${message}`);
        }
    }

    private generateReport(): ValidationResult {
        this.log('\n📊 PWA Build Validation Report');
        this.log('='.repeat(50));
        this.log(`✅ Successful validations: ${this.validations}`);
        this.log(`⚠️ Warnings: ${this.warnings.length}`);
        this.log(`❌ Errors: ${this.errors.length}`);

        if (this.warnings.length) {
            this.log('\n⚠️ Warnings:');
            for (const [index, warning] of this.warnings.entries())
                this.log(`  ${index + 1}. ${warning}`);
        }

        if (this.errors.length) {
            this.log('\n❌ Errors:');
            for (const [index, error] of this.errors.entries())
                this.log(`  ${index + 1}. ${error}`);
        }

        const success = this.errors.length === 0;
        this.log(`\n🎯 Overall Status: ${success ? 'PASSED' : 'FAILED'}`);

        return {
            success,
            errors: [...this.errors],
            warnings: [...this.warnings],
            passed: this.validations,
        };
    }

    run(): Promise<ValidationResult> {
        this.log('🚀 Starting PWA Build Validation...');
        this.validateServiceWorker();
        this.validateManifest();
        this.validateIcons();
        this.validateOfflinePage();
        this.validateAssetOptimization();
        this.validateBuildArtifacts();
        return Promise.resolve(this.generateReport());
    }
}export function runPwaBuildValidation(options: PwaValidationOptions): Promise<ValidationResult> {
    const validator = new PWABuildValidator(options);
    return validator.run();
}
