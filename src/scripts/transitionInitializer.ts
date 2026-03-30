/**
 * Transition system initialization script
 * Handles initialization of the enhanced transition system with preloading and optimization
 */
import {transitionRegistry} from '../utils/transitionRegistry';

export function initializeTransitionSystem(): void {
    // Register current page type with the registry
    const currentPath = globalThis.location.pathname;
    transitionRegistry.getPageType(currentPath);
}

function handleDOMReady(): void {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeTransitionSystem);
        return;
    }
    
    initializeTransitionSystem();
}

// Auto-initialize when script loads
handleDOMReady();
