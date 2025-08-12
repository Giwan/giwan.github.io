/**
 * Transition Error Handler - Comprehensive error handling for view transitions
 * 
 * This module provides:
 * - Graceful degradation when View Transition API is unsupported
 * - Error handling for Astro's astro:before-preparation failures
 * - Fallback mechanisms using Astro's built-in transition system
 * - Transition debugging tools for development mode
 */

export interface TransitionError {
  type: 'api-unsupported' | 'preparation-failed' | 'transition-failed' | 'timeout' | 'unknown';
  message: string;
  originalError?: Error;
  context?: {
    fromPath?: string;
    toPath?: string;
    timestamp: number;
    userAgent?: string;
  };
}

export interface FallbackOptions {
  useAstroBuiltIn: boolean;
  disableAnimations: boolean;
  enableDebugMode: boolean;
  timeoutMs: number;
}

export interface DebugInfo {
  apiSupported: boolean;
  currentPath: string;
  transitionInProgress: boolean;
  errorHistory: TransitionError[];
  performanceMetrics?: any;
  deviceCapabilities?: any;
}

export class TransitionErrorHandler {
  private errorHistory: TransitionError[] = [];
  private fallbackOptions: FallbackOptions = {
    useAstroBuiltIn: true,
    disableAnimations: false,
    enableDebugMode: false,
    timeoutMs: 5000
  };
  private isInitialized: boolean = false;
  private debugMode: boolean = false;
  private transitionTimeouts: Map<string, NodeJS.Timeout> = new Map();

  constructor() {
    this.initialize();
  }

  /**
   * Initialize error handling system
   */
  private initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) {
      return;
    }

    // Check if we're in development mode
    this.debugMode = this.isDevMode() || this.fallbackOptions.enableDebugMode;

    // Set up error listeners
    this.setupErrorListeners();

    // Set up Astro transition event listeners
    this.setupAstroEventListeners();

    // Set up global error handlers
    this.setupGlobalErrorHandlers();

    this.isInitialized = true;

    if (this.debugMode) {
      console.log('[TransitionErrorHandler] Initialized with debug mode enabled');
    }
  }

  /**
   * Set up error event listeners
   */
  private setupErrorListeners(): void {
    // Listen for unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      if (this.isTransitionRelatedError(event.reason)) {
        this.handleTransitionError({
          type: 'unknown',
          message: 'Unhandled promise rejection during transition',
          originalError: event.reason,
          context: {
            timestamp: Date.now(),
            userAgent: navigator.userAgent
          }
        });
        event.preventDefault();
      }
    });

    // Listen for general errors
    window.addEventListener('error', (event) => {
      if (this.isTransitionRelatedError(event.error)) {
        this.handleTransitionError({
          type: 'unknown',
          message: event.message || 'Unknown transition error',
          originalError: event.error,
          context: {
            timestamp: Date.now(),
            userAgent: navigator.userAgent
          }
        });
      }
    });
  }

  /**
   * Set up Astro transition event listeners
   */
  private setupAstroEventListeners(): void {
    // Handle before-preparation errors
    document.addEventListener('astro:before-preparation', (event) => {
      const customEvent = event as CustomEvent;
      const fromPath = customEvent.detail?.from?.pathname || window.location.pathname;
      const toPath = customEvent.detail?.to?.pathname || 'unknown';

      try {
        // Set up timeout for transition
        const timeoutId = setTimeout(() => {
          this.handleTransitionError({
            type: 'timeout',
            message: 'Transition preparation timed out',
            context: {
              fromPath,
              toPath,
              timestamp: Date.now(),
              userAgent: navigator.userAgent
            }
          });
        }, this.fallbackOptions.timeoutMs);

        this.transitionTimeouts.set(`${fromPath}->${toPath}`, timeoutId);

        // Check if View Transition API is supported
        if (!this.isViewTransitionSupported()) {
          this.handleApiUnsupported(fromPath, toPath);
        }

        if (this.debugMode) {
          console.log('[TransitionErrorHandler] Transition preparation started', {
            from: fromPath,
            to: toPath,
            apiSupported: this.isViewTransitionSupported()
          });
        }
      } catch (error) {
        this.handleTransitionError({
          type: 'preparation-failed',
          message: 'Failed during transition preparation',
          originalError: error as Error,
          context: {
            fromPath,
            toPath,
            timestamp: Date.now(),
            userAgent: navigator.userAgent
          }
        });
      }
    });

    // Handle after-swap success
    document.addEventListener('astro:after-swap', (event) => {
      const customEvent = event as CustomEvent;
      const fromPath = customEvent.detail?.from?.pathname || 'unknown';
      const toPath = customEvent.detail?.to?.pathname || window.location.pathname;

      // Clear timeout
      const timeoutKey = `${fromPath}->${toPath}`;
      const timeoutId = this.transitionTimeouts.get(timeoutKey);
      if (timeoutId) {
        clearTimeout(timeoutId);
        this.transitionTimeouts.delete(timeoutKey);
      }

      if (this.debugMode) {
        console.log('[TransitionErrorHandler] Transition completed successfully', {
          from: fromPath,
          to: toPath
        });
      }
    });

    // Handle page load completion
    document.addEventListener('astro:page-load', () => {
      // Clear any remaining timeouts
      this.transitionTimeouts.forEach((timeoutId) => {
        clearTimeout(timeoutId);
      });
      this.transitionTimeouts.clear();

      if (this.debugMode) {
        console.log('[TransitionErrorHandler] Page load completed');
      }
    });
  }

  /**
   * Set up global error handlers
   */
  private setupGlobalErrorHandlers(): void {
    // Override console.error to catch transition-related errors
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const errorMessage = args.join(' ');
      if (this.isTransitionRelatedError(errorMessage)) {
        this.handleTransitionError({
          type: 'unknown',
          message: errorMessage,
          context: {
            timestamp: Date.now(),
            userAgent: navigator.userAgent
          }
        });
      }
      originalConsoleError.apply(console, args);
    };
  }

  /**
   * Check if View Transition API is supported
   */
  private isViewTransitionSupported(): boolean {
    return typeof document !== 'undefined' && 'startViewTransition' in document;
  }

  /**
   * Handle API unsupported scenario
   */
  private handleApiUnsupported(fromPath: string, toPath: string): void {
    const error: TransitionError = {
      type: 'api-unsupported',
      message: 'View Transition API is not supported in this browser',
      context: {
        fromPath,
        toPath,
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      }
    };

    this.handleTransitionError(error);
    this.enableFallbackMode();
  }

  /**
   * Handle transition errors
   */
  private handleTransitionError(error: TransitionError): void {
    // Add to error history
    this.errorHistory.push(error);

    // Keep only last 50 errors
    if (this.errorHistory.length > 50) {
      this.errorHistory.shift();
    }

    // Log error in debug mode
    if (this.debugMode) {
      console.error('[TransitionErrorHandler] Transition error:', error);
    }

    // Apply appropriate fallback based on error type
    this.applyErrorFallback(error);

    // Dispatch custom event for other systems to react
    const errorEvent = new CustomEvent('transition-error', {
      detail: error
    });
    document.dispatchEvent(errorEvent);
  }

  /**
   * Apply appropriate fallback based on error type
   */
  private applyErrorFallback(error: TransitionError): void {
    const root = document.documentElement;

    switch (error.type) {
      case 'api-unsupported':
        this.enableFallbackMode();
        root.setAttribute('data-transition-fallback-reason', 'api-unsupported');
        break;

      case 'preparation-failed':
        this.enableAstroBuiltInTransitions();
        root.setAttribute('data-transition-fallback-reason', 'preparation-failed');
        break;

      case 'transition-failed':
        this.enableAstroBuiltInTransitions();
        root.setAttribute('data-transition-fallback-reason', 'transition-failed');
        break;

      case 'timeout':
        this.enableAstroBuiltInTransitions();
        root.setAttribute('data-transition-fallback-reason', 'timeout');
        break;

      default:
        this.enableFallbackMode();
        root.setAttribute('data-transition-fallback-reason', 'unknown');
        break;
    }

    // Set error state attributes
    root.setAttribute('data-transition-error', 'true');
    root.setAttribute('data-transition-error-type', error.type);

    // Auto-recover after some time
    setTimeout(() => {
      this.attemptRecovery();
    }, 10000);
  }

  /**
   * Enable fallback mode with Astro's built-in transitions
   */
  private enableFallbackMode(): void {
    const root = document.documentElement;
    
    root.setAttribute('data-transition-fallback', 'true');
    root.setAttribute('data-view-transition-disabled', 'true');
    
    // Disable custom view transition names
    root.style.setProperty('--disable-view-transitions', '1');
    
    if (this.debugMode) {
      console.log('[TransitionErrorHandler] Fallback mode enabled');
    }
  }

  /**
   * Enable Astro's built-in transition system
   */
  private enableAstroBuiltInTransitions(): void {
    const root = document.documentElement;
    
    root.setAttribute('data-astro-transitions-only', 'true');
    root.setAttribute('data-view-transition-fallback', 'astro');
    
    // Reduce transition complexity
    root.style.setProperty('--transition-duration', '200ms');
    root.style.setProperty('--transition-easing', 'ease-out');
    
    if (this.debugMode) {
      console.log('[TransitionErrorHandler] Astro built-in transitions enabled');
    }
  }

  /**
   * Attempt to recover from error state
   */
  private attemptRecovery(): void {
    const root = document.documentElement;
    
    // Check if conditions have improved
    const recentErrors = this.errorHistory.filter(
      error => Date.now() - error.context!.timestamp < 30000
    );

    // If no recent errors and API is supported, try to recover
    if (recentErrors.length === 0 && this.isViewTransitionSupported()) {
      root.removeAttribute('data-transition-error');
      root.removeAttribute('data-transition-error-type');
      root.removeAttribute('data-transition-fallback-reason');
      root.removeAttribute('data-transition-fallback');
      root.removeAttribute('data-view-transition-disabled');
      root.removeAttribute('data-astro-transitions-only');
      root.removeAttribute('data-view-transition-fallback');
      
      // Reset CSS properties
      root.style.removeProperty('--disable-view-transitions');
      root.style.removeProperty('--transition-duration');
      root.style.removeProperty('--transition-easing');
      
      if (this.debugMode) {
        console.log('[TransitionErrorHandler] Recovery attempted');
      }
    }
  }

  /**
   * Check if error is transition-related
   */
  private isTransitionRelatedError(error: any): boolean {
    if (!error) return false;
    
    const errorString = typeof error === 'string' ? error : error.message || error.toString();
    
    const transitionKeywords = [
      'view-transition',
      'startViewTransition',
      'astro:before-preparation',
      'astro:after-swap',
      'transition-name',
      'view-transition-name'
    ];
    
    return transitionKeywords.some(keyword => 
      errorString.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  /**
   * Get debug information
   */
  public getDebugInfo(): DebugInfo {
    return {
      apiSupported: this.isViewTransitionSupported(),
      currentPath: window.location.pathname,
      transitionInProgress: this.transitionTimeouts.size > 0,
      errorHistory: [...this.errorHistory],
      performanceMetrics: this.getPerformanceMetrics(),
      deviceCapabilities: this.getDeviceCapabilities()
    };
  }

  /**
   * Get performance metrics for debugging
   */
  private getPerformanceMetrics(): any {
    try {
      // Try to get performance metrics from performance monitor if available
      const performanceMonitor = (window as any).performanceMonitor;
      if (performanceMonitor && typeof performanceMonitor.getCurrentMetrics === 'function') {
        return performanceMonitor.getCurrentMetrics();
      }
    } catch (error) {
      // Fallback to basic metrics
    }

    return {
      memory: (performance as any).memory ? {
        used: (performance as any).memory.usedJSHeapSize,
        total: (performance as any).memory.totalJSHeapSize,
        limit: (performance as any).memory.jsHeapSizeLimit
      } : null,
      timing: performance.timing ? {
        navigationStart: performance.timing.navigationStart,
        loadEventEnd: performance.timing.loadEventEnd,
        domContentLoaded: performance.timing.domContentLoadedEventEnd
      } : null
    };
  }

  /**
   * Get device capabilities for debugging
   */
  private getDeviceCapabilities(): any {
    try {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;

      return {
        userAgent: navigator?.userAgent || 'unknown',
        hardwareConcurrency: navigator?.hardwareConcurrency || 4,
        deviceMemory: (navigator as any)?.deviceMemory,
        connectionType: connection?.effectiveType || 'unknown',
        prefersReducedMotion: window?.matchMedia ? 
          window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
        viewportSize: {
          width: window?.innerWidth || 1024,
          height: window?.innerHeight || 768
        }
      };
    } catch (error) {
      return {
        userAgent: 'unknown',
        hardwareConcurrency: 4,
        deviceMemory: undefined,
        connectionType: 'unknown',
        prefersReducedMotion: false,
        viewportSize: {
          width: 1024,
          height: 768
        }
      };
    }
  }

  /**
   * Enable debug mode
   */
  public enableDebugMode(): void {
    this.debugMode = true;
    this.fallbackOptions.enableDebugMode = true;
    
    const root = document.documentElement;
    root.setAttribute('data-transition-debug', 'true');
    
    console.log('[TransitionErrorHandler] Debug mode enabled');
    console.log('[TransitionErrorHandler] Current debug info:', this.getDebugInfo());
  }

  /**
   * Disable debug mode
   */
  public disableDebugMode(): void {
    this.debugMode = false;
    this.fallbackOptions.enableDebugMode = false;
    
    const root = document.documentElement;
    root.removeAttribute('data-transition-debug');
    
    console.log('[TransitionErrorHandler] Debug mode disabled');
  }

  /**
   * Get error history
   */
  public getErrorHistory(): TransitionError[] {
    return [...this.errorHistory];
  }

  /**
   * Clear error history
   */
  public clearErrorHistory(): void {
    this.errorHistory = [];
    
    if (this.debugMode) {
      console.log('[TransitionErrorHandler] Error history cleared');
    }
  }

  /**
   * Update fallback options
   */
  public updateFallbackOptions(options: Partial<FallbackOptions>): void {
    this.fallbackOptions = { ...this.fallbackOptions, ...options };
    
    if (options.enableDebugMode !== undefined) {
      if (options.enableDebugMode) {
        this.enableDebugMode();
      } else {
        this.disableDebugMode();
      }
    }
    
    if (this.debugMode) {
      console.log('[TransitionErrorHandler] Fallback options updated:', this.fallbackOptions);
    }
  }

  /**
   * Force fallback mode
   */
  public forceFallback(reason: string = 'manual'): void {
    this.handleTransitionError({
      type: 'unknown',
      message: `Fallback forced: ${reason}`,
      context: {
        timestamp: Date.now(),
        userAgent: navigator.userAgent
      }
    });
  }

  /**
   * Test error handling (development only)
   */
  public testErrorHandling(): void {
    if (!this.debugMode) {
      console.warn('[TransitionErrorHandler] Test methods only available in debug mode');
      return;
    }

    console.log('[TransitionErrorHandler] Testing error handling...');

    // Test API unsupported
    setTimeout(() => {
      this.handleApiUnsupported('/test-from', '/test-to');
    }, 1000);

    // Test preparation failed
    setTimeout(() => {
      this.handleTransitionError({
        type: 'preparation-failed',
        message: 'Test preparation failure',
        context: {
          fromPath: '/test-from',
          toPath: '/test-to',
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        }
      });
    }, 2000);

    // Test timeout
    setTimeout(() => {
      this.handleTransitionError({
        type: 'timeout',
        message: 'Test timeout',
        context: {
          fromPath: '/test-from',
          toPath: '/test-to',
          timestamp: Date.now(),
          userAgent: navigator.userAgent
        }
      });
    }, 3000);
  }

  /**
   * Check if we're in development mode
   */
  private isDevMode(): boolean {
    try {
      // Try to access import.meta.env safely
      return (globalThis as any).import?.meta?.env?.DEV || 
             process?.env?.NODE_ENV === 'development' ||
             false;
    } catch {
      return false;
    }
  }

  /**
   * Cleanup resources
   */
  public destroy(): void {
    // Clear all timeouts
    this.transitionTimeouts.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    this.transitionTimeouts.clear();

    // Remove event listeners would go here if we stored references
    // For now, we rely on page unload to clean up

    this.isInitialized = false;
    
    if (this.debugMode) {
      console.log('[TransitionErrorHandler] Destroyed');
    }
  }
}

// Create and export singleton instance
export const transitionErrorHandler = new TransitionErrorHandler();

// Export for testing and advanced usage
export default TransitionErrorHandler;