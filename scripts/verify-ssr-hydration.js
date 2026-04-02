#!/usr/bin/env node

/**
 * SSR and Hydration Verification Script
 * Checks that content is present in SSR and no hydration mismatches occur.
 */

import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTests() {
  console.log('Starting preview server...');
  const server = spawn('npx', ['http-server', 'docs', '-p', '4321', '-c-1'], {
    stdio: 'inherit',
    shell: true
  });

  // Give server time to start
  await new Promise(resolve => setTimeout(resolve, 5000));

  let exitCode = 0;
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    const consoleErrors = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    console.log('Checking for hydration errors on homepage...');
    await page.goto('http://localhost:4321/', { waitUntil: 'networkidle2' });

    // Wait a bit more for React to settle
    await new Promise(resolve => setTimeout(resolve, 2000));

    const hydrationErrors = consoleErrors.filter(
      (err) => err.toLowerCase().includes('hydration') || err.toLowerCase().includes('did not match')
    );

    if (hydrationErrors.length > 0) {
      console.error('❌ FAILED: Hydration errors found:');
      hydrationErrors.forEach(err => console.error(`  - ${err}`));
      exitCode = 1;
    } else {
      console.log('✅ PASSED: No hydration errors found.');
    }

    console.log('Checking for SSR content with JS disabled...');
    const noJsPage = await browser.newPage();
    await noJsPage.setJavaScriptEnabled(false);
    await noJsPage.goto('http://localhost:4321/', { waitUntil: 'networkidle2' });

    const mainContent = await noJsPage.$('#main-content');
    if (mainContent) {
      const isVisible = await noJsPage.evaluate(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden';
      }, mainContent);

      if (isVisible) {
        console.log('✅ PASSED: SSR content is visible.');
      } else {
        console.error('❌ FAILED: SSR content is hidden (display: none or visibility: hidden).');
        exitCode = 1;
      }
    } else {
      console.error('❌ FAILED: SSR content (#main-content) NOT found in HTML.');
      exitCode = 1;
    }

    await browser.close();
  } catch (error) {
    console.error('❌ Test execution failed:', error.message);
    exitCode = 1;
  } finally {
    console.log('Stopping preview server...');
    server.kill();
  }

  process.exit(exitCode);
}

runTests();
