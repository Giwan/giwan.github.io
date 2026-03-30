import {setInterval, setTimeout} from 'node:timers/promises';
import {tryToCatch} from 'try-to-catch';


/**
 * PWA utility functions with comprehensive error handling
 * Enhanced with mobile transition optimizations
 */
const isError = (a) => a instanceof Error;

// Types for error handling
export interface PWAError {
    type: 'service-worker' | 'cache' | 'network' | 'manifest';
    message: string;
    originalError?: Error;
    timestamp: number;
}

export interface RetryConfig {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
    backoffFactor: number;
}

interface NetworkConnection {
    effectiveType: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown';
    downlink: number;
    rtt: number;
    saveData: boolean;
    type?: string;
}

interface NavigatorWithExtensions extends Navigator {
    deviceMemory?: number;
    connection?: NetworkConnection;
    mozConnection?: NetworkConnection;
    webkitConnection?: NetworkConnection;
}

// Default retry configuration
const DEFAULT_RETRY_CONFIG: RetryConfig = {
    maxAttempts: 3,
    baseDelay: 1000, // 1 second
    maxDelay: 10000, // 10 seconds
    backoffFactor: 2,
};

/**
 * Enhanced service worker registration with error handling and fallbacks
 */
export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
    // Check if service workers are supported
    if (!('serviceWorker' in navigator)) {
        handlePWAError({
            type: 'service-worker',
            message: 'Service workers not supported in this browser',
            timestamp: Date.now(),
        });
        return null;
    }
    
    // Check if we're in a secure context (required for service workers)
    if (!globalThis.isSecureContext) {
        handlePWAError({
            type: 'service-worker',
            message: 'Service workers require HTTPS',
            timestamp: Date.now(),
        });
        return null;
    }
    
    try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
            scope: '/',
        });
        
        // Set up update detection with error handling
        setupServiceWorkerUpdateHandling(registration);
                // Set up error recovery mechanisms
        setupServiceWorkerErrorRecovery(registration);
        // Initialize mobile transition optimizations
        
        return registration;
    } catch(error) {
        const pwaError: PWAError = {
            type: 'service-worker',
            message: 'Failed to register service worker',
            originalError: error as Error,
            timestamp: Date.now(),
        };
        
        handlePWAError(pwaError);
        // Attempt fallback registration with different scope
        try {
            const fallbackRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: './',
            });
            
            setupServiceWorkerUpdateHandling(fallbackRegistration);
            return fallbackRegistration;
        } catch {
            // Final graceful degradation - app continues to work without SW
            return null;
        }
    }
};

/**
 * Set up service worker update handling with error recovery
 */
const setupServiceWorkerUpdateHandling = (registration: ServiceWorkerRegistration): void => {
    try {
        registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            
            if (newWorker)
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // Dispatch custom event for update notification
                        globalThis.dispatchEvent(new CustomEvent('sw-update-available', {
                            detail: {
                                registration,
                                newWorker,
                            },
                        }));
                    }
                });
        });
        
        // Handle service worker errors
        registration.addEventListener('error', (event) => {
            const pwaError: PWAError = {
                type: 'service-worker',
                message: 'Service worker error occurred',
                originalError: Error(event.toString()),
                timestamp: Date.now(),
            };
            
            handlePWAError(pwaError);
        });
    } catch {}
};

/**
 * Set up service worker error recovery mechanisms
 */
const setupServiceWorkerErrorRecovery = (registration: ServiceWorkerRegistration): void => {
    try {
        // Monitor service worker state changes for error recovery
        if (registration.active)
            registration.active.addEventListener('error', () => {
                handleServiceWorkerRecovery(registration);
            });
        
        // Set up periodic health checks
        const healthCheckInterval = setInterval(async () => {
            try {
                // Check if service worker is still responsive
                const isHealthy = await checkServiceWorkerHealth(registration);
                
                if (!isHealthy)
                    await handleServiceWorkerRecovery(registration);
            } catch {}
        }, 5 * 60 * 1000);
        
        // Check every 5 minutes
        // Clean up interval when page unloads
        globalThis.addEventListener('beforeunload', () => {
            clearInterval(healthCheckInterval);
        });
    } catch {}
};

/**
 * Check service worker health
 */
const checkServiceWorkerHealth = async (registration: ServiceWorkerRegistration): Promise<boolean> => {
    try {
        // Simple health check - try to communicate with service worker
        if (!registration.active)
            return false;
        
        // Check if service worker is intercepting requests properly
        const testUrl = '/favicon.svg';
        
        const response = await fetch(testUrl, {
            cache: 'no-cache',
        });
        
        // If we get a response, service worker is likely working
        return response.ok || response.status === 404; // 404 is acceptable for health check
    } catch {
        return false;
    }
};

/**
 * Handle service worker recovery
 */
const handleServiceWorkerRecovery = async (registration: ServiceWorkerRegistration): Promise<void> => {
    const [error] = await tryToCatch(registration.update);
    
    if (error) {
        // Log recovery failure
        handlePWAError({
            type: 'service-worker',
            message: 'Service worker recovery failed',
            originalError: error as Error,
            timestamp: Date.now(),
        });
    }
    
    // If that doesn't work, try to unregister and re-register
    if (!registration.active) {
        await registration.unregister();
        // Wait a moment before re-registering
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // Re-register service worker
        await registerServiceWorker();
    }
};

/**
 * Network request with retry mechanism and fallback strategies
 */
export const fetchWithRetry = async (url: string, options: RequestInit = {}, retryConfig: Partial<RetryConfig> = {}): Promise<Response> => {
    const config = {
        ...DEFAULT_RETRY_CONFIG,
        ...retryConfig,
    };
    
    let lastError: Error = Error('Unknown error');
    const networkStatus = getNetworkStatus();
    
    // If offline, try cache first
    if (!networkStatus.isOnline) {
        const cachedResponse = await getCacheWithFallback('runtime-cache', url);
        
        if (cachedResponse)
            return cachedResponse;
    }
    
    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
        try {
            // Create abort controller for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            
            // 10 second timeout
            const response = await fetch(url, {
                ...options,
                signal: controller.signal,
            });
            
            clearTimeout(timeoutId);
            
            if (response.ok) {
                // Cache successful responses for future offline use
                if (response.status === 200)
                    putInCacheWithFallback('runtime-cache', url, response.clone());
                
                return response;
            }
            
            // Handle specific HTTP errors
            if (response.status === 404) {
                throw Error(`Content not found: ${url}`);
            } else if (response.status >= 500) {
                throw Error(`Server error (${response.status}): ${response.statusText}`);
            } else {
                if (response.status === 429) {
                    // Rate limited - wait longer before retry
                    const retryAfter = response.headers.get('Retry-After');
                    const waitTime = retryAfter ? parseInt(retryAfter) * 1000 : config.baseDelay * 2;
                    
                    await new Promise((resolve) => setTimeout(resolve, waitTime));
                    continue;
                }
                
                throw Error(`HTTP ${response.status}: ${response.statusText}`);
            }
        } catch(error) {
            lastError = error as Error;
            // Check if it's an abort error (timeout)
            if (isError(error) && error.name === 'AbortError')
                lastError = Error(`Request timeout after 10 seconds: ${url}`);
            
            // Don't retry on certain errors
            if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
                // Network error - check if we have cached content
                const cachedResponse = await getCacheWithFallback('runtime-cache', url);
                
                if (cachedResponse)
                    return cachedResponse;
                
                break;
            }
            
            // Don't retry on 404 errors
            if (lastError.message.includes('not found'))
                break;
            
            if (attempt < config.maxAttempts) {
                const delay = Math.min(config.baseDelay * config.backoffFactor ** attempt - 1, config.maxDelay);
                
                // Add jitter to prevent thundering herd
                const jitter = Math.random() * 1000;
                
                await new Promise((resolve) => setTimeout(resolve, delay + jitter));
            }
        }
    }
    
    // All retries failed - try one last cache lookup
    const cachedResponse = await getCacheWithFallback('runtime-cache', url);
    
    if (cachedResponse)
        return cachedResponse;
    
    // Log the failure
    const pwaError: PWAError = {
        type: 'network',
        message: `Failed to fetch ${url} after ${config.maxAttempts} attempts`,
        originalError: lastError,
        timestamp: Date.now(),
    };
    
    handlePWAError(pwaError);
    throw lastError;
};

/**
 * Cache management with error handling
 */
export const getCacheWithFallback = async (cacheName: string, request: string | Request): Promise<Response | null> => {
    try {
        const cache = await caches.open(cacheName);
        const cachedResponse = await cache.match(request);
        
        return cachedResponse || null;
    } catch(error) {
        const pwaError: PWAError = {
            type: 'cache',
            message: `Failed to access cache: ${cacheName}`,
            originalError: error as Error,
            timestamp: Date.now(),
        };
        
        handlePWAError(pwaError);
        return null;
    }
};

/**
 * Safe cache storage with error handling
 */
export const putInCacheWithFallback = async (cacheName: string, request: string | Request, response: Response): Promise<boolean> => {
    try {
        const cache = await caches.open(cacheName);
        await cache.put(request, response.clone());
        return true;
    } catch(error) {
        const pwaError: PWAError = {
            type: 'cache',
            message: `Failed to store in cache: ${cacheName}`,
            originalError: error as Error,
            timestamp: Date.now(),
        };
        
        handlePWAError(pwaError);
        return false;
    }
};

/**
 * Network status detection
 */
export const getNetworkStatus = (): {
    isOnline: boolean;
    connectionType?: string;
    effectiveType?: string;
} => {
    const isOnline = navigator.onLine;
    
    // Get connection info if available
    const navigatorWithExtensions = navigator as NavigatorWithExtensions;
    const connection = navigatorWithExtensions.connection || navigatorWithExtensions.mozConnection || navigatorWithExtensions.webkitConnection;
    
    return {
        isOnline,
        connectionType: connection?.type,
        effectiveType: connection?.effectiveType,
    };
};

/**
 * Check if content is available offline
 */
export const isContentCached = async (url: string): Promise<boolean> => {
    try {
        const cacheNames = await caches.keys();
        
        for (const cacheName of cacheNames) {
            const cache = await caches.open(cacheName);
            const response = await cache.match(url);
            
            if (response)
                return true;
        }
        
        return false;
    } catch {
        return false;
    }
};

/**
 * Get offline fallback content suggestions
 */
export const getOfflineFallbackSuggestions = async (): Promise<string[]> => {
    try {
        const suggestions: string[] = [];
        const cacheNames = await caches.keys();
        
        for (const cacheName of cacheNames) {
            if (cacheName.includes('blog-posts')) {
                const cache = await caches.open(cacheName);
                const keys = await cache.keys();
                
                // Extract URLs from cached blog posts
                for (const request of keys) {
                    if (request.url.includes('/blog/'))
                        suggestions.push(request.url);
                }
            }
        }
        
        return suggestions.slice(0, 5); // Return top 5 suggestions
    } catch {
        return [];
    }
};

/**
 * Clear corrupted caches
 */
export const clearCorruptedCaches = async (): Promise<void> => {
    try {
        const cacheNames = await caches.keys();
        
        for (const cacheName of cacheNames) {
            try {
                const cache = await caches.open(cacheName);
                const keys = await cache.keys();
                
                // Test a few cache entries
                for (let i = 0; i < Math.min(keys.length, 3); i++) {
                    const response = await cache.match(keys[i]);
                    
                    if (response) {
                        // Try to read the response to check if it's corrupted
                        await response.text();
                    }
                }
            } catch {
                await caches.delete(cacheName);
            }
        }
    } catch {}
};

/**
 * Central error handling for PWA-related errors
 */
export const handlePWAError = (error: PWAError): void => {
    // Log error for debugging
    // Store error for analytics/debugging
    try {
        const errorLog = JSON.parse(localStorage.getItem('pwa-errors') || '[]');
        errorLog.push(error);
        // Keep only last 10 errors
        if (errorLog.length > 10)
            errorLog.splice(0, errorLog.length - 10);
        
        localStorage.setItem('pwa-errors', JSON.stringify(errorLog));
    } catch {}


        // Dispatch custom event for error handling components
    globalThis.dispatchEvent(new CustomEvent('pwa-error', {
        detail: error,
    }));
};

/**
 * Get stored PWA errors for debugging
 */
export const getPWAErrors = (): PWAError[] => {
    try {
        return JSON.parse(localStorage.getItem('pwa-errors') || '[]');
    } catch {
        return [];
    }
};

/**
 * Clear stored PWA errors
 */
export const clearPWAErrors = (): void => {
    try {
        localStorage.removeItem('pwa-errors');
    } catch {}
};
