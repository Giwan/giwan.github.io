/**
 * Transition initialization utility
 * 
 * This module provides a simple way to initialize the TransitionController
 * and integrate it with the existing application.
 */

import { transitionController } from './transitionController';

/**
 * Initialize transitions for the application
 * This should be called once when the application starts
 */
export function initializeTransitions(): void {
  // The TransitionController is automatically initialized when imported
  // This function exists for explicit initialization if needed
  
  if (typeof window !== 'undefined') {
    // Initialize error handling first
    import('./transitionErrorInit').then(({ initializeTransitionErrorHandling }) => {
      initializeTransitionErrorHandling();
    });

    // Add any additional initialization logic here
    console.log('TransitionController initialized');
    
    // Optional: Log transition events in development
    if (import.meta.env.DEV) {
      document.addEventListener('astro:before-preparation', (event) => {
        const customEvent = event as CustomEvent;
        console.log('Transition starting:', {
          from: window.location.pathname,
          to: customEvent.detail?.to?.pathname
        });
      });
      
      document.addEventListener('astro:after-swap', (event) => {
        const context = transitionController.getCurrentContext();
        if (context) {
          console.log('Transition completed:', context);
        }
      });
    }
  }
}

/**
 * Get the global transition controller instance
 */
export function getTransitionController() {
  return transitionController;
}

/**
 * Check if view transitions are supported in the current browser
 */
export function isViewTransitionSupported(): boolean {
  return transitionController.isTransitionSupported();
}

export default initializeTransitions;