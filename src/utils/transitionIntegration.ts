/**
 * Client-side integration between TransitionRegistry and Astro's routing system
 * This module handles the coordination between the transition system and Astro's navigation
 */
import {transitionController} from './transitionController';
import {transitionRegistry} from './transitionRegistry';

export class TransitionIntegration {
    private isInitialized = false;
    /**
   * Initialize the transition integration system
   */
    public initialize(): void {
        if (this.isInitialized || typeof window === 'undefined')
            return;

        // Register current page with the transition registry
        this.registerCurrentPage();
                // Set up Astro navigation event listeners
        this.setupAstroEventListeners();
                // Set up browser navigation listeners
        this.setupBrowserEventListeners();

        this.isInitialized = true;
    }
    /**
   * Register the current page with the transition registry
   */
    private registerCurrentPage(): void {
        const currentPath = globalThis.location.pathname;
        const pageType = transitionRegistry.getPageType(currentPath);

        // Apply initial page type to document
        document.documentElement.setAttribute('data-page-type', pageType);
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
        globalThis.addEventListener('popstate', this.handlePopState.bind(this));
                // Listen for hash changes
        globalThis.addEventListener('hashchange', this.handleHashChange.bind(this));
    }
    /**
   * Handle Astro's before-preparation event
   */
    private handleBeforePreparation(event: Event): void {
        const customEvent = event as CustomEvent;
        const toPath = customEvent.detail?.to?.pathname || globalThis.location.pathname;
        const fromPath = globalThis.location.pathname;

        // Get navigation context from transition controller
        const context = transitionController.detectNavigationContext(fromPath, toPath);

        // Get appropriate transition configuration from registry
        this.applyTransitionConfig(context);
    }
    /**
   * Handle Astro's after-preparation event
   */
    private handleAfterPreparation(): void {}
    /**
   * Handle Astro's before-swap event
   */
    private handleBeforeSwap(): void {}
    /**
   * Handle Astro's after-swap event
   */
    private handleAfterSwap(event: Event): void {
        const customEvent = event as CustomEvent;
        const newPath = customEvent.detail?.newDocument?.location?.pathname || globalThis.location.pathname;

        // Update page type for new page
        const newPageType = transitionRegistry.getPageType(newPath);

        document.documentElement.setAttribute('data-page-type', newPageType);
                // Clean up transition attributes
        this.cleanupTransitionAttributes();
    }
    /**
   * Handle Astro's page-load event
   */
    private handlePageLoad(): void {
        // Page has fully loaded
        this.registerCurrentPage();
    }
    /**
   * Handle browser popstate event (back/forward buttons)
   */
    private handlePopState(): void {
        // Browser navigation occurred
        const newPath = globalThis.location.pathname;
        const newPageType = transitionRegistry.getPageType(newPath);

        document.documentElement.setAttribute('data-page-type', newPageType);
    }
    /**
   * Handle hash changes
   */
    private handleHashChange(): void {}
   /**
    * Apply transition configuration to the document
    */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private applyTransitionConfig(config: any): void {
        const root = document.documentElement;

        // Apply transition class if specified
        if (config.cssClass)
            root.classList.add(config.cssClass);

        // Set CSS custom properties for transition timing
        root.style.setProperty('--transition-duration', `${config.duration}ms`);
        root.style.setProperty('--transition-easing', config.easing);
                // Apply transition context attributes (these are handled by TransitionController)
        // but we can add registry-specific attributes here
        root.setAttribute('data-transition-config', config.name);
        // Apply element-specific transition names
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config.elements?.forEach((element: any) => {
            const targetElements = document.querySelectorAll(element.selector);

            for (const el of targetElements) {
                (el as HTMLElement).style.viewTransitionName = element.transitionName;
            }
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
            'transition-default',
        ];

        for (const className of transitionClasses) {
            root.classList.remove(className);
        }

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
        const fromPath = globalThis.location.pathname;
        const context = transitionController.detectNavigationContext(fromPath, toPath);

        this.applyTransitionConfig(context);
        // Navigate using Astro's router if available, otherwise use browser navigation
        if (typeof window !== 'undefined' && 'history' in window) {
            globalThis.history.pushState({}, '', toPath);
                        // Trigger popstate to simulate navigation
            globalThis.dispatchEvent(new PopStateEvent('popstate'));
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
            transitionConfig: root.getAttribute('data-transition-config') || undefined,
        };
    }
    /**
   * Destroy the integration and clean up event listeners
   */
    public destroy(): void {
        if (!this.isInitialized)
            return;

        // Remove Astro event listeners
        document.removeEventListener('astro:before-preparation', this.handleBeforePreparation.bind(this));
        document.removeEventListener('astro:after-preparation', this.handleAfterPreparation.bind(this));
        document.removeEventListener('astro:before-swap', this.handleBeforeSwap.bind(this));
        document.removeEventListener('astro:after-swap', this.handleAfterSwap.bind(this));
        document.removeEventListener('astro:page-load', this.handlePageLoad.bind(this));
                // Remove browser event listeners
        globalThis.removeEventListener('popstate', this.handlePopState.bind(this));
        globalThis.removeEventListener('hashchange', this.handleHashChange.bind(this));
                // Clean up document attributes
        this.cleanupTransitionAttributes();

        this.isInitialized = false;
    }
}
// Create and export singleton instance
export const transitionIntegration = new TransitionIntegration();

// Auto-initialize when module loads in browser
if (typeof window !== 'undefined') {
    // Initialize after DOM is ready
    if (document.readyState === 'loading')
        document.addEventListener('DOMContentLoaded', () => {
            transitionIntegration.initialize();
        });
    else
        transitionIntegration.initialize();
}

export default TransitionIntegration;
