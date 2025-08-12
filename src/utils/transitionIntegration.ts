/**
 * Client-side integration between TransitionRegistry and Astro's routing system
 * This module handles the coordination between the transition system and Astro's navigation
 */

import { transitionController } from './transitionController';
import { transitionRegistry } from './transitionRegistry';

export class TransitionIntegration {
  private isInitialized = false;

  /**
   * Initialize the transition integration system
   */
  public initialize(): void {
    if (this.isInitialized || typeof window === 'undefined') {
      return;
    }

    // Register current page with the transition registry
    this.registerCurrentPage();

    // Set up Astro navigation event listeners
    this.setupAstroEventListeners();

    // Set up browser navigation listeners
    this.setupBrowserEventListeners();

    this.isInitialized = true;
    console.log('Transition integration initialized');
  }

  /**
   * Register the current page with the transition registry
   */
  private registerCurrentPage(): void {
    const currentPath = window.location.pathname;
    const pageType = transitionRegistry.getPageType(currentPath);
    
    // Apply initial page type to document
    document.documentElement.setAttribute('data-page-type', pageType);
    
    console.log(`Registered current page: ${currentPath} as ${pageType}`);
  }

  /**
   * Set up Astro-specific event listeners
   */
  private setupAstroEventListeners(): void {
    // Listen for Astro's navigation events
    document.addEventListener('astro:before-preparation', this.handleBeforePreparation.bind(this));
    document.addEventListener('astro:after-preparation', this.handleAfterPreparation.bind(this));
    document.addEventListener('astro:before-swap', this.handleBeforeSwap.bind(this));
    document.addEventListener('astro:after-swap', this.handleAfterSwap.bind(this));
    document.addEventListener('astro:page-load', this.handlePageLoad.bind(this));
  }

  /**
   * Set up browser navigation listeners
   */
  private setupBrowserEventListeners(): void {
    // Listen for browser back/forward navigation
    window.addEventListener('popstate', this.handlePopState.bind(this));
    
    // Listen for hash changes
    window.addEventListener('hashchange', this.handleHashChange.bind(this));
  }

  /**
   * Handle Astro's before-preparation event
   */
  private handleBeforePreparation(event: Event): void {
    const customEvent = event as CustomEvent;
    const toPath = customEvent.detail?.to?.pathname || window.location.pathname;
    const fromPath = window.location.pathname;

    // Get navigation context from transition controller
    const context = transitionController.detectNavigationContext(fromPath, toPath);
    
    // Get appropriate transition configuration from registry
    const transitionConfig = transitionRegistry.getTransitionForNavigation(context);
    
    // Apply transition configuration to document
    this.applyTransitionConfig(transitionConfig, context);
    
    console.log(`Preparing transition from ${fromPath} to ${toPath}:`, {
      context,
      transitionConfig: transitionConfig.name
    });
  }

  /**
   * Handle Astro's after-preparation event
   */
  private handleAfterPreparation(event: Event): void {
    // Transition preparation is complete, ready for swap
    console.log('Transition preparation complete');
  }

  /**
   * Handle Astro's before-swap event
   */
  private handleBeforeSwap(event: Event): void {
    // Document is about to be swapped
    console.log('Document swap starting');
  }

  /**
   * Handle Astro's after-swap event
   */
  private handleAfterSwap(event: Event): void {
    const customEvent = event as CustomEvent;
    const newPath = customEvent.detail?.newDocument?.location?.pathname || window.location.pathname;
    
    // Update page type for new page
    const newPageType = transitionRegistry.getPageType(newPath);
    document.documentElement.setAttribute('data-page-type', newPageType);
    
    // Clean up transition attributes
    this.cleanupTransitionAttributes();
    
    console.log(`Transition complete to ${newPath} (${newPageType})`);
  }

  /**
   * Handle Astro's page-load event
   */
  private handlePageLoad(event: Event): void {
    // Page has fully loaded
    this.registerCurrentPage();
    console.log('Page load complete');
  }

  /**
   * Handle browser popstate event (back/forward buttons)
   */
  private handlePopState(event: PopStateEvent): void {
    // Browser navigation occurred
    const newPath = window.location.pathname;
    const newPageType = transitionRegistry.getPageType(newPath);
    document.documentElement.setAttribute('data-page-type', newPageType);
    
    console.log(`Browser navigation to ${newPath} (${newPageType})`);
  }

  /**
   * Handle hash changes
   */
  private handleHashChange(event: HashChangeEvent): void {
    // Hash navigation doesn't typically require page transitions
    console.log('Hash navigation:', event.newURL);
  }

  /**
   * Apply transition configuration to the document
   */
  private applyTransitionConfig(config: any, context: any): void {
    const root = document.documentElement;
    
    // Apply transition class if specified
    if (config.cssClass) {
      root.classList.add(config.cssClass);
    }
    
    // Set CSS custom properties for transition timing
    root.style.setProperty('--transition-duration', `${config.duration}ms`);
    root.style.setProperty('--transition-easing', config.easing);
    
    // Apply transition context attributes (these are handled by TransitionController)
    // but we can add registry-specific attributes here
    root.setAttribute('data-transition-config', config.name);
    
    // Apply element-specific transition names
    config.elements?.forEach((element: any) => {
      const targetElements = document.querySelectorAll(element.selector);
      targetElements.forEach((el: Element) => {
        (el as HTMLElement).style.viewTransitionName = element.transitionName;
      });
    });
  }

  /**
   * Clean up transition attributes after transition completes
   */
  private cleanupTransitionAttributes(): void {
    const root = document.documentElement;
    
    // Remove transition-specific classes
    const transitionClasses = [
      'transition-slide-forward',
      'transition-slide-backward',
      'transition-fade',
      'transition-scale-up',
      'transition-scale-down',
      'transition-crossfade',
      'transition-default'
    ];
    
    transitionClasses.forEach(className => {
      root.classList.remove(className);
    });
    
    // Remove transition config attribute
    root.removeAttribute('data-transition-config');
    
    // Clean up CSS custom properties
    root.style.removeProperty('--transition-duration');
    root.style.removeProperty('--transition-easing');
  }

  /**
   * Manually trigger a transition (for programmatic navigation)
   */
  public triggerTransition(toPath: string): void {
    const fromPath = window.location.pathname;
    const context = transitionController.detectNavigationContext(fromPath, toPath);
    const transitionConfig = transitionRegistry.getTransitionForNavigation(context);
    
    this.applyTransitionConfig(transitionConfig, context);
    
    // Navigate using Astro's router if available, otherwise use browser navigation
    if (typeof window !== 'undefined' && 'history' in window) {
      window.history.pushState({}, '', toPath);
      
      // Trigger popstate to simulate navigation
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  }

  /**
   * Get current transition state
   */
  public getTransitionState(): {
    isTransitioning: boolean;
    currentPageType: string;
    transitionConfig?: string;
  } {
    const root = document.documentElement;
    
    return {
      isTransitioning: root.hasAttribute('data-transition-direction'),
      currentPageType: root.getAttribute('data-page-type') || 'unknown',
      transitionConfig: root.getAttribute('data-transition-config') || undefined
    };
  }

  /**
   * Destroy the integration and clean up event listeners
   */
  public destroy(): void {
    if (!this.isInitialized) {
      return;
    }

    // Remove Astro event listeners
    document.removeEventListener('astro:before-preparation', this.handleBeforePreparation.bind(this));
    document.removeEventListener('astro:after-preparation', this.handleAfterPreparation.bind(this));
    document.removeEventListener('astro:before-swap', this.handleBeforeSwap.bind(this));
    document.removeEventListener('astro:after-swap', this.handleAfterSwap.bind(this));
    document.removeEventListener('astro:page-load', this.handlePageLoad.bind(this));

    // Remove browser event listeners
    window.removeEventListener('popstate', this.handlePopState.bind(this));
    window.removeEventListener('hashchange', this.handleHashChange.bind(this));

    // Clean up document attributes
    this.cleanupTransitionAttributes();

    this.isInitialized = false;
    console.log('Transition integration destroyed');
  }
}

// Create and export singleton instance
export const transitionIntegration = new TransitionIntegration();

// Auto-initialize when module loads in browser
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      transitionIntegration.initialize();
    });
  } else {
    transitionIntegration.initialize();
  }
}

export default TransitionIntegration;