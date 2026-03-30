/**
 * Example usage of TransitionRegistry
 * 
 * This file demonstrates how to use the TransitionRegistry for route-based transitions
 * in an Astro application with view transitions.
 */
import {
    transitionRegistry,
    PageType,
} from './transitionRegistry';

// Example 1: Basic page type detection
// Example 2: Page relationship detection
// Example 3: Transition selection based on navigation context
// Forward navigation between blog posts (sibling relationship)
// Drill-down navigation (list to detail)
// Contextual navigation (related sections)
const customTransition = {
    name: 'custom-bounce',
    duration: 600,
    easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    cssClass: 'transition-bounce',
    elements: [{
        selector: 'main',
        transitionName: 'main-content',
        animation: {
            keyframes: 'bounce-in',
            duration: 600,
            easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        },
    }],
};

const customPattern = {
    pattern: /^\/special/,
    pageType: PageType.HOME,
    priority: 150,
};

transitionRegistry.registerTransition(customPattern, customTransition);
// Example 5: Getting all available transitions
function handleNavigation(fromRoute: string, toRoute: string, direction: 'forward' | 'backward' = 'forward') {
    // Detect page types
    const fromPageType = transitionRegistry.getPageType(fromRoute);
    const toPageType = transitionRegistry.getPageType(toRoute);
    
    // Determine relationship
    const relationship = transitionRegistry.getPageRelationship(fromPageType, toPageType, fromRoute, toRoute);
    
    // Create navigation context
    const context = {
        direction,
        fromPageType,
        toPageType,
        relationship,
    };
    
    // Get appropriate transition
    return transitionRegistry.getTransitionForNavigation(context);
}

// Test various navigation scenarios
handleNavigation('/', '/blog/');
handleNavigation('/blog/', '/blog/2024-01-21-deploy-astro-static-on-deno-deploy/');
handleNavigation('/blog/post-1/', '/blog/post-2/');
handleNavigation('/blog/', '/tools/');
handleNavigation('/tools/', '/tools/developer/');

export {
    transitionRegistry,
};
