/**
 * Example usage of TransitionRegistry
 * 
 * This file demonstrates how to use the TransitionRegistry for route-based transitions
 * in an Astro application with view transitions.
 */

import { transitionRegistry, PageType, PageRelationship } from './transitionRegistry';

// Example 1: Basic page type detection
console.log('=== Page Type Detection ===');
console.log('Home page:', transitionRegistry.getPageType('/'));
console.log('Blog list:', transitionRegistry.getPageType('/blog/'));
console.log('Blog post:', transitionRegistry.getPageType('/blog/2024-01-21-deploy-astro-static-on-deno-deploy/'));
console.log('Tools list:', transitionRegistry.getPageType('/tools/'));
console.log('Tools category:', transitionRegistry.getPageType('/tools/developer/'));

// Example 2: Page relationship detection
console.log('\n=== Page Relationships ===');
const blogListToBlogPost = transitionRegistry.getPageRelationship(PageType.BLOG_LIST, PageType.BLOG_POST);
console.log('Blog list to blog post:', blogListToBlogPost);

const blogPostToBlogPost = transitionRegistry.getPageRelationship(PageType.BLOG_POST, PageType.BLOG_POST);
console.log('Blog post to blog post:', blogPostToBlogPost);

const blogToTools = transitionRegistry.getPageRelationship(PageType.BLOG_LIST, PageType.TOOLS_LIST);
console.log('Blog to tools:', blogToTools);

// Example 3: Transition selection based on navigation context
console.log('\n=== Transition Selection ===');

// Forward navigation between blog posts (sibling relationship)
const siblingForwardContext = {
  direction: 'forward' as const,
  fromPageType: PageType.BLOG_POST,
  toPageType: PageType.BLOG_POST,
  relationship: PageRelationship.SIBLING
};
const siblingTransition = transitionRegistry.getTransitionForNavigation(siblingForwardContext);
console.log('Sibling forward transition:', siblingTransition.name, `(${siblingTransition.duration}ms)`);

// Drill-down navigation (list to detail)
const drillDownContext = {
  direction: 'forward' as const,
  fromPageType: PageType.BLOG_LIST,
  toPageType: PageType.BLOG_POST,
  relationship: PageRelationship.PARENT_CHILD
};
const drillDownTransition = transitionRegistry.getTransitionForNavigation(drillDownContext);
console.log('Drill-down transition:', drillDownTransition.name, `(${drillDownTransition.duration}ms)`);

// Contextual navigation (related sections)
const contextualContext = {
  direction: 'forward' as const,
  fromPageType: PageType.BLOG_LIST,
  toPageType: PageType.TOOLS_LIST,
  relationship: PageRelationship.CONTEXTUAL
};
const contextualTransition = transitionRegistry.getTransitionForNavigation(contextualContext);
console.log('Contextual transition:', contextualTransition.name, `(${contextualTransition.duration}ms)`);

// Example 4: Custom transition registration
console.log('\n=== Custom Transition Registration ===');

// Register a custom transition for a specific route pattern
const customTransition = {
  name: 'custom-bounce',
  duration: 600,
  easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  cssClass: 'transition-bounce',
  elements: [
    {
      selector: 'main',
      transitionName: 'main-content',
      animation: {
        keyframes: 'bounce-in',
        duration: 600,
        easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
      }
    }
  ]
};

const customPattern = {
  pattern: /^\/special/,
  pageType: PageType.HOME,
  priority: 150
};

transitionRegistry.registerTransition(customPattern, customTransition);
console.log('Registered custom transition:', customTransition.name);

// Example 5: Getting all available transitions
console.log('\n=== Available Transitions ===');
const allTransitions = transitionRegistry.getAllTransitions();
console.log('Available transition names:', Array.from(allTransitions.keys()));

// Example 6: Practical usage in a navigation handler
console.log('\n=== Practical Navigation Handler Example ===');

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
    relationship
  };
  
  // Get appropriate transition
  const transition = transitionRegistry.getTransitionForNavigation(context);
  
  console.log(`Navigation: ${fromRoute} → ${toRoute}`);
  console.log(`  Page types: ${fromPageType} → ${toPageType}`);
  console.log(`  Relationship: ${relationship}`);
  console.log(`  Transition: ${transition.name} (${transition.duration}ms)`);
  console.log(`  CSS class: ${transition.cssClass || 'none'}`);
  
  return transition;
}

// Test various navigation scenarios
handleNavigation('/', '/blog/');
handleNavigation('/blog/', '/blog/2024-01-21-deploy-astro-static-on-deno-deploy/');
handleNavigation('/blog/post-1/', '/blog/post-2/');
handleNavigation('/blog/', '/tools/');
handleNavigation('/tools/', '/tools/developer/');

export { transitionRegistry };