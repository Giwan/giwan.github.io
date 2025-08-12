/**
 * Transition Error Initialization - Sets up comprehensive error handling
 * 
 * This module initializes:
 * - Error handler integration
 * - Fallback CSS loading
 * - Debug mode setup
 * - Global error recovery
 */

import { transitionErrorHandler } from './transitionErrorHandler';

/**
 * Initialize transition error handling system
 */
export function initializeTransitionErrorHandling(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // Load fallback CSS
  loadFallbackStyles();

  // Set up global error recovery
  setupGlobalErrorRecovery();

  // Initialize debug mode in development
  if (import.meta.env.DEV) {
    setupDevelopmentMode();
  }

  // Set up performance-based fallbacks
  setupPerformanceFallbacks();

  console.log('[TransitionErrorInit] Error handling initialized');
}

/**
 * Load fallback CSS styles
 */
function loadFallbackStyles(): void {
  // Check if styles are already loaded
  if (document.querySelector('#transition-fallback-styles')) {
    return;
  }

  // Create and inject fallback styles
  const link = document.createElement('link');
  link.id = 'transition-fallback-styles';
  link.rel = 'stylesheet';
  link.href = '/src/styles/transitionFallbacks.css';
  
  // Add to head
  document.head.appendChild(link);

  // Fallback: inject critical CSS inline if external file fails
  link.onerror = () => {
    injectCriticalFallbackCSS();
  };
}

/**
 * Inject critical fallback CSS inline
 */
function injectCriticalFallbackCSS(): void {
  const style = document.createElement('style');
  style.id = 'critical-transition-fallback';
  style.textContent = `
    /* Critical fallback styles */
    [data-view-transition-disabled="true"] * {
      view-transition-name: none !important;
    }
    
    [data-transition-fallback="true"] .main-content {
      transition: opacity 300ms ease-out, transform 300ms ease-out;
    }
    
    [data-transition-error="true"]::before {
      content: '';
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: 2px;
      background: rgba(239, 68, 68, 0.5);
      z-index: 9999;
      pointer-events: none;
    }
    
    @media (prefers-reduced-motion: reduce) {
      [data-transition-fallback="true"] .main-content {
        transition-duration: 0.01ms !important;
      }
    }
  `;
  
  document.head.appendChild(style);
}

/**
 * Set up global error recovery mechanisms
 */
function setupGlobalErrorRecovery(): void {
  // Monitor for stuck transitions
  let transitionStartTime: number | null = null;
  
  document.addEventListener('astro:before-preparation', () => {
    transitionStartTime = Date.now();
    
    // Set up timeout to detect stuck transitions
    setTimeout(() => {
      if (transitionStartTime && Date.now() - transitionStartTime > 10000) {
        console.warn('[TransitionErrorInit] Transition appears stuck, forcing recovery');
        forceTransitionRecovery();
      }
    }, 10000);
  });
  
  document.addEventListener('astro:after-swap', () => {
    transitionStartTime = null;
  });
  
  document.addEventListener('astro:page-load', () => {
    transitionStartTime = null;
  });
}

/**
 * Force transition recovery
 */
function forceTransitionRecovery(): void {
  const root = document.documentElement;
  
  // Remove any stuck transition states
  root.removeAttribute('data-astro-transition');
  root.removeAttribute('data-astro-transition-persist');
  
  // Force fallback mode temporarily
  root.setAttribute('data-transition-fallback', 'true');
  root.setAttribute('data-view-transition-disabled', 'true');
  
  // Clear after a short delay
  setTimeout(() => {
    root.removeAttribute('data-transition-fallback');
    root.removeAttribute('data-view-transition-disabled');
  }, 1000);
  
  console.log('[TransitionErrorInit] Forced transition recovery');
}

/**
 * Set up development mode features
 */
function setupDevelopmentMode(): void {
  // Enable debug mode
  transitionErrorHandler.enableDebugMode();
  
  // Add keyboard shortcuts for debugging
  document.addEventListener('keydown', (event) => {
    // Ctrl/Cmd + Shift + T for transition debug
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'T') {
      event.preventDefault();
      toggleTransitionDebugger();
    }
    
    // Ctrl/Cmd + Shift + F for force fallback
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'F') {
      event.preventDefault();
      transitionErrorHandler.forceFallback('keyboard-shortcut');
    }
    
    // Ctrl/Cmd + Shift + E for test errors
    if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.key === 'E') {
      event.preventDefault();
      transitionErrorHandler.testErrorHandling();
    }
  });
  
  // Log debug info to console
  console.log('[TransitionErrorInit] Development mode enabled');
  console.log('Keyboard shortcuts:');
  console.log('  Ctrl/Cmd + Shift + T: Toggle transition debugger');
  console.log('  Ctrl/Cmd + Shift + F: Force fallback mode');
  console.log('  Ctrl/Cmd + Shift + E: Test error handling');
}

/**
 * Toggle transition debugger visibility
 */
function toggleTransitionDebugger(): void {
  const debugger = document.querySelector('[data-transition-debug]');
  if (debugger) {
    const isVisible = debugger.getAttribute('data-debug-visible') === 'true';
    debugger.setAttribute('data-debug-visible', (!isVisible).toString());
  } else {
    // Create debugger if it doesn't exist
    createTransitionDebugger();
  }
}

/**
 * Create transition debugger element
 */
function createTransitionDebugger(): void {
  const debugger = document.createElement('div');
  debugger.id = 'transition-debugger';
  debugger.setAttribute('data-transition-debug', 'true');
  debugger.setAttribute('data-debug-visible', 'true');
  debugger.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: rgba(0, 0, 0, 0.9);
    color: white;
    padding: 10px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 12px;
    z-index: 10000;
    max-width: 300px;
    backdrop-filter: blur(8px);
  `;
  
  // Update debugger content
  updateDebuggerContent(debugger);
  
  // Update every second
  setInterval(() => updateDebuggerContent(debugger), 1000);
  
  document.body.appendChild(debugger);
}

/**
 * Update debugger content
 */
function updateDebuggerContent(debugger: HTMLElement): void {
  const debugInfo = transitionErrorHandler.getDebugInfo();
  const errorCount = debugInfo.errorHistory.length;
  const lastError = debugInfo.errorHistory[debugInfo.errorHistory.length - 1];
  
  debugger.innerHTML = `
    <div style="font-weight: bold; margin-bottom: 8px;">Transition Debug</div>
    <div>API Supported: ${debugInfo.apiSupported ? '✅' : '❌'}</div>
    <div>Current Path: ${debugInfo.currentPath}</div>
    <div>Transition Active: ${debugInfo.transitionInProgress ? '🔄' : '⏸️'}</div>
    <div>Errors: ${errorCount}</div>
    ${lastError ? `<div style="color: #ff6b6b; margin-top: 4px;">Last: ${lastError.type}</div>` : ''}
    <div style="margin-top: 8px; font-size: 10px; opacity: 0.7;">
      Ctrl+Shift+T to toggle
    </div>
  `;
}

/**
 * Set up performance-based fallbacks
 */
function setupPerformanceFallbacks(): void {
  // Monitor performance and apply fallbacks
  let performanceCheckInterval: NodeJS.Timeout;
  
  const checkPerformance = () => {
    // Simple performance check
    const start = performance.now();
    requestAnimationFrame(() => {
      const frameTime = performance.now() - start;
      
      // If frame time is too high, enable performance mode
      if (frameTime > 16.67 * 2) { // More than 2 frame times
        document.documentElement.setAttribute('data-performance-mode', 'low');
      } else if (frameTime < 16.67 * 0.5) { // Less than half frame time
        document.documentElement.setAttribute('data-performance-mode', 'high');
      } else {
        document.documentElement.setAttribute('data-performance-mode', 'normal');
      }
    });
  };
  
  // Check performance periodically
  performanceCheckInterval = setInterval(checkPerformance, 5000);
  
  // Initial check
  checkPerformance();
  
  // Clean up on page unload
  window.addEventListener('beforeunload', () => {
    if (performanceCheckInterval) {
      clearInterval(performanceCheckInterval);
    }
  });
}

/**
 * Check if error handling is properly initialized
 */
export function isTransitionErrorHandlingInitialized(): boolean {
  return document.querySelector('#transition-fallback-styles') !== null ||
         document.querySelector('#critical-transition-fallback') !== null;
}

/**
 * Get error handling status
 */
export function getErrorHandlingStatus(): {
  initialized: boolean;
  debugMode: boolean;
  fallbackStylesLoaded: boolean;
  errorCount: number;
} {
  const debugInfo = transitionErrorHandler.getDebugInfo();
  
  return {
    initialized: isTransitionErrorHandlingInitialized(),
    debugMode: import.meta.env.DEV,
    fallbackStylesLoaded: document.querySelector('#transition-fallback-styles') !== null,
    errorCount: debugInfo.errorHistory.length
  };
}

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeTransitionErrorHandling);
  } else {
    initializeTransitionErrorHandling();
  }
}