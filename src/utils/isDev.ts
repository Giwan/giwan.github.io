import process from 'node:process';

const isUndefined = (a: unknown): a is undefined => typeof a === 'undefined';

/**
 * Development environment helper
 * 
 * Centralized utility for checking if the application is running in development mode
 * This provides a consistent way to handle development-only code across the codebase
 */
/**
 * Check if the application is running in development mode
 * 
 * @returns {boolean} True if in development mode, false otherwise
 * 
 * @example
 * ```typescript
 * import { isDev } from './utils/isDev';
 * 
 * if (isDev()) {
 *   console.log('This only runs in development');
 * }
 * ```
 */
export function isDev(): boolean {
    return ((!isUndefined(process)
        && process.env
        && (process.env.NODE_ENV === 'development'
        || process.env.NODE_ENV === 'test'))
        || (typeof window !== 'undefined' && globalThis.location.hostname === 'localhost'));
}

/**
 * Execute a function only in development mode
 * 
 * @param {Function} fn - The function to execute
 * @param {any[]} args - Arguments to pass to the function
 * 
 * @example
 * ```typescript
 * import { devOnly } from './utils/isDev';
 * 
 * devOnly(console.log, ['Development message']);
 * ```
 */
export function devOnly(fn: Function, args: unknown[] = []): void {
    if (isDev())
        fn(...args);
}

/**
 * Development-only console logger
 * 
 * @param {string} method - Console method to use (log, error, warn, etc.)
 * @param {any[]} args - Arguments to pass to console method
 * 
 * @example
 * ```typescript
 * import { devConsole } from './utils/isDev';
 * 
 * devConsole('warn', ['Development info:', someData]);
 * devConsole('error', ['Development error:', error]);
 * ```
 */
type ConsoleMethod = 'warn' | 'error';

export function devConsole(method: ConsoleMethod): void {
    if (isDev() && typeof console !== 'undefined' && method !== 'warn' && method === 'error') {}
}
