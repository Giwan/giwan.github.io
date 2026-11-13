/**
 * Logger utility - Provides development-only logging
 * 
 * In production builds, all log calls are no-ops, eliminating
 * console overhead and preventing sensitive information leakage.
 * 
 * This module uses a simple check that works in both browser and Node.js environments.
 */

/**
 * Check if we're in development mode
 * Works in both browser (import.meta.env.DEV) and Node.js (process.env.NODE_ENV)
 */
export function isDev(): boolean {
  // Check for Astro/ESM import.meta.env.DEV
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV) {
    return true;
  }
  // Check for Node.js process.env.NODE_ENV
  if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'development') {
    return true;
  }
  // Check for browser global
  if (typeof globalThis !== 'undefined' && (globalThis as any).import?.meta?.env?.DEV) {
    return true;
  }
  return false;
}

/**
 * Check if we're in production mode
 */
export function isProd(): boolean {
  return !isDev();
}

/**
 * Development-only logger
 * @param message - The message to log
 * @param args - Additional arguments to pass to console.log
 */
export function devLog(message: string, ...args: any[]): void {
  if (isDev()) {
    console.log(message, ...args);
  }
}

/**
 * Development-only warn logger
 * @param message - The message to log
 * @param args - Additional arguments to pass to console.warn
 */
export function devWarn(message: string, ...args: any[]): void {
  if (isDev()) {
    console.warn(message, ...args);
  }
}

/**
 * Development-only error logger
 * @param message - The message to log
 * @param args - Additional arguments to pass to console.error
 */
export function devError(message: string, ...args: any[]): void {
  if (isDev()) {
    console.error(message, ...args);
  }
}

/**
 * Production-safe logger that prefixes messages with [PROD] in production
 * Use sparingly - only for critical production debugging
 * @param message - The message to log
 * @param args - Additional arguments to pass to console.log
 */
export function prodLog(message: string, ...args: any[]): void {
  const prefix = isDev() ? '[DEV]' : '[PROD]';
  console.log(`${prefix} ${message}`, ...args);
}
