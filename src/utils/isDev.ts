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
  // Check for various development environment indicators
  // This covers different build systems and environments
  return (
    import.meta.env?.DEV === true ||
    process.env.NODE_ENV === 'development' ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost')
  );
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
export function devOnly(fn: Function, args: any[] = []): void {
  if (isDev()) {
    fn(...args);
  }
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
 * devConsole('log', ['Development info:', someData]);
 * devConsole('error', ['Development error:', error]);
 * ```
 */
export function devConsole(method: string, args: any[] = []): void {
  if (isDev() && typeof console !== 'undefined' && console[method]) {
    console[method](...args);
  }
}