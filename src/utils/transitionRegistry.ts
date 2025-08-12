/**
 * TransitionRegistry - Route-based transition management for Astro view transitions
 * 
 * This class provides a centralized registry for mapping page types and navigation patterns
 * to appropriate transition configurations, supporting Astro's file-based routing system.
 */

// Types and interfaces
export enum PageType {
  HOME = 'home',
  BLOG_LIST = 'blog-list',
  BLOG_POST = 'blog-post',
  TOOLS_LIST = 'tools-list',
  TOOLS_CATEGORY = 'tools-category',
  SEARCH = 'search',
  ABOUT = 'about',
  CONTACT = 'contact',
  OFFLINE = 'offline',
  NOT_FOUND = 'not-found',
  UNKNOWN = 'unknown'
}

export enum PageRelationship {
  SIBLING = 'sibling',        // Same level (blog post to blog post)
  PARENT_CHILD = 'parent-child', // List to detail
  UNRELATED = 'unrelated',    // Different sections
  CONTEXTUAL = 'contextual'   // Related but different type
}

export interface RoutePattern {
  pattern: string | RegExp;
  pageType: PageType;
  priority: number; // Higher priority patterns are matched first
}

export interface ElementTransition {
  selector: string;
  transitionName: string;
  animation: AnimationConfig;
}

export interface AnimationConfig {
  keyframes: string;
  duration: number;
  easing: string;
  fillMode?: string;
}

export interface TransitionCondition {
  type: 'media-query' | 'user-preference' | 'performance';
  condition: string;
  fallback?: TransitionConfig;
}

export interface TransitionConfig {
  name: string;
  duration: number;
  easing: string;
  elements: ElementTransition[];
  conditions?: TransitionCondition[];
  cssClass?: string; // CSS class to apply during transition
}

export interface NavigationContext {
  direction: 'forward' | 'backward' | 'refresh';
  fromPageType: PageType;
  toPageType: PageType;
  relationship: PageRelationship;
}

export interface PageMetadata {
  type: PageType;
  level: number;
  category?: string;
  parentRoute?: string;
  childRoutes?: string[];
}

/**
 * TransitionRegistry class manages route-based transitions
 */
export class TransitionRegistry {
  private routePatterns: RoutePattern[] = [];
  private transitionConfigs: Map<string, TransitionConfig> = new Map();
  private defaultTransition: TransitionConfig;
  private pageMetadataCache: Map<string, PageMetadata> = new Map();

  constructor() {
    this.initializeDefaultPatterns();
    this.initializeDefaultTransitions();
    this.defaultTransition = this.createDefaultTransition();
  }

  /**
   * Initialize route patterns for Astro's file-based routing
   */
  private initializeDefaultPatterns(): void {
    // Order matters - more specific patterns should have higher priority
    this.routePatterns = [
      // Blog patterns
      { pattern: /^\/blog\/[\w-]+\/$/, pageType: PageType.BLOG_POST, priority: 100 },
      { pattern: /^\/blog\/?$/, pageType: PageType.BLOG_LIST, priority: 90 },
      
      // Tools patterns
      { pattern: /^\/tools\/[^\/]+\/?$/, pageType: PageType.TOOLS_CATEGORY, priority: 100 },
      { pattern: /^\/tools\/?$/, pageType: PageType.TOOLS_LIST, priority: 90 },
      
      // Search patterns
      { pattern: /^\/search/, pageType: PageType.SEARCH, priority: 80 },
      
      // Static pages
      { pattern: /^\/about\/?$/, pageType: PageType.ABOUT, priority: 70 },
      { pattern: /^\/contact\/?$/, pageType: PageType.CONTACT, priority: 70 },
      { pattern: /^\/offline\/?$/, pageType: PageType.OFFLINE, priority: 70 },
      { pattern: /^\/404\/?$/, pageType: PageType.NOT_FOUND, priority: 70 },
      
      // Home page (should be last due to broad matching)
      { pattern: /^\/?$/, pageType: PageType.HOME, priority: 10 },
    ];

    // Sort by priority (highest first)
    this.routePatterns.sort((a, b) => b.priority - a.priority);
  }

  /**
   * Initialize default transition configurations for all page types
   */
  private initializeDefaultTransitions(): void {
    // Slide transitions for sequential content
    this.transitionConfigs.set('slide-forward', {
      name: 'slide-forward',
      duration: 300,
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      cssClass: 'transition-slide-forward',
      elements: [
        {
          selector: 'main',
          transitionName: 'main-content',
          animation: {
            keyframes: 'slide-in-right',
            duration: 300,
            easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
          }
        }
      ]
    });

    this.transitionConfigs.set('slide-backward', {
      name: 'slide-backward',
      duration: 300,
      easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)',
      cssClass: 'transition-slide-backward',
      elements: [
        {
          selector: 'main',
          transitionName: 'main-content',
          animation: {
            keyframes: 'slide-in-left',
            duration: 300,
            easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
          }
        }
      ]
    });

    // Fade transitions for contextual switches
    this.transitionConfigs.set('fade', {
      name: 'fade',
      duration: 250,
      easing: 'ease-in-out',
      cssClass: 'transition-fade',
      elements: [
        {
          selector: 'main',
          transitionName: 'main-content',
          animation: {
            keyframes: 'fade-in',
            duration: 250,
            easing: 'ease-in-out'
          }
        }
      ]
    });

    // Scale transitions for drill-down navigation
    this.transitionConfigs.set('scale-up', {
      name: 'scale-up',
      duration: 350,
      easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)',
      cssClass: 'transition-scale-up',
      elements: [
        {
          selector: 'main',
          transitionName: 'main-content',
          animation: {
            keyframes: 'scale-in',
            duration: 350,
            easing: 'cubic-bezier(0.0, 0.0, 0.2, 1)'
          }
        }
      ]
    });

    this.transitionConfigs.set('scale-down', {
      name: 'scale-down',
      duration: 350,
      easing: 'cubic-bezier(0.4, 0.0, 1, 1)',
      cssClass: 'transition-scale-down',
      elements: [
        {
          selector: 'main',
          transitionName: 'main-content',
          animation: {
            keyframes: 'scale-out',
            duration: 350,
            easing: 'cubic-bezier(0.4, 0.0, 1, 1)'
          }
        }
      ]
    });

    // Crossfade for similar content types
    this.transitionConfigs.set('crossfade', {
      name: 'crossfade',
      duration: 400,
      easing: 'ease-in-out',
      cssClass: 'transition-crossfade',
      elements: [
        {
          selector: 'main',
          transitionName: 'main-content',
          animation: {
            keyframes: 'crossfade',
            duration: 400,
            easing: 'ease-in-out'
          }
        }
      ],
      conditions: [
        {
          type: 'media-query',
          condition: '(prefers-reduced-motion: reduce)',
          fallback: this.transitionConfigs.get('fade')
        }
      ]
    });
  }

  /**
   * Create default transition configuration
   */
  private createDefaultTransition(): TransitionConfig {
    return {
      name: 'default',
      duration: 200,
      easing: 'ease-in-out',
      cssClass: 'transition-default',
      elements: [
        {
          selector: 'main',
          transitionName: 'main-content',
          animation: {
            keyframes: 'fade-in',
            duration: 200,
            easing: 'ease-in-out'
          }
        }
      ]
    };
  }

  /**
   * Register a custom transition configuration
   */
  registerTransition(pattern: RoutePattern, transition: TransitionConfig): void {
    // Add pattern to route patterns with sorting
    this.routePatterns.push(pattern);
    this.routePatterns.sort((a, b) => b.priority - a.priority);
    
    // Store transition configuration
    this.transitionConfigs.set(transition.name, transition);
  }

  /**
   * Register a page type for a specific route
   */
  registerPageType(route: string, type: PageType): void {
    const metadata: PageMetadata = {
      type,
      level: this.calculateRouteLevel(route),
      category: this.extractCategory(route),
      parentRoute: this.findParentRoute(route),
      childRoutes: this.findChildRoutes(route)
    };
    
    this.pageMetadataCache.set(route, metadata);
  }

  /**
   * Get page type for a given route
   */
  getPageType(route: string): PageType {
    // Check cache first
    const cached = this.pageMetadataCache.get(route);
    if (cached) {
      return cached.type;
    }

    // Match against patterns
    for (const routePattern of this.routePatterns) {
      if (this.matchesPattern(route, routePattern.pattern)) {
        return routePattern.pageType;
      }
    }

    // Default fallback
    return PageType.UNKNOWN;
  }

  /**
   * Get appropriate transition for navigation context
   */
  getTransitionForNavigation(context: NavigationContext): TransitionConfig {
    const transitionName = this.selectTransitionName(context);
    const transition = this.transitionConfigs.get(transitionName);
    
    if (!transition) {
      console.warn(`Transition '${transitionName}' not found, using default`);
      return this.defaultTransition;
    }

    return transition;
  }

  /**
   * Set default transition configuration
   */
  setDefaultTransition(transition: TransitionConfig): void {
    this.defaultTransition = transition;
  }

  /**
   * Get default transition configuration
   */
  getDefaultTransition(): TransitionConfig {
    return this.defaultTransition;
  }

  /**
   * Determine page relationship between two page types
   */
  getPageRelationship(fromType: PageType, toType: PageType, fromRoute?: string, toRoute?: string): PageRelationship {
    // Same page type = sibling
    if (fromType === toType) {
      return PageRelationship.SIBLING;
    }

    // List to detail relationships
    if (fromType === PageType.BLOG_LIST && toType === PageType.BLOG_POST) {
      return PageRelationship.PARENT_CHILD;
    }
    if (fromType === PageType.BLOG_POST && toType === PageType.BLOG_LIST) {
      return PageRelationship.PARENT_CHILD;
    }
    if (fromType === PageType.TOOLS_LIST && toType === PageType.TOOLS_CATEGORY) {
      return PageRelationship.PARENT_CHILD;
    }
    if (fromType === PageType.TOOLS_CATEGORY && toType === PageType.TOOLS_LIST) {
      return PageRelationship.PARENT_CHILD;
    }

    // Contextual relationships (related sections)
    const contextualPairs = [
      [PageType.BLOG_LIST, PageType.TOOLS_LIST],
      [PageType.ABOUT, PageType.CONTACT],
      [PageType.SEARCH, PageType.BLOG_LIST],
      [PageType.SEARCH, PageType.TOOLS_LIST]
    ];

    for (const [type1, type2] of contextualPairs) {
      if ((fromType === type1 && toType === type2) || (fromType === type2 && toType === type1)) {
        return PageRelationship.CONTEXTUAL;
      }
    }

    // Everything else is unrelated
    return PageRelationship.UNRELATED;
  }

  /**
   * Select appropriate transition name based on navigation context
   */
  private selectTransitionName(context: NavigationContext): string {
    const { direction, relationship, fromPageType, toPageType } = context;

    // Handle reduced motion preference
    if (this.shouldUseReducedMotion()) {
      return 'fade';
    }

    // Direction-based transitions for siblings
    if (relationship === PageRelationship.SIBLING) {
      return direction === 'forward' ? 'slide-forward' : 'slide-backward';
    }

    // Parent-child relationships use scale transitions
    if (relationship === PageRelationship.PARENT_CHILD) {
      // Going from list to detail = drill down (scale up)
      // Going from detail to list = drill up (scale down)
      const isListToDetail = (
        (fromPageType === PageType.BLOG_LIST && toPageType === PageType.BLOG_POST) ||
        (fromPageType === PageType.TOOLS_LIST && toPageType === PageType.TOOLS_CATEGORY)
      );
      return isListToDetail ? 'scale-up' : 'scale-down';
    }

    // Contextual relationships use crossfade
    if (relationship === PageRelationship.CONTEXTUAL) {
      return 'crossfade';
    }

    // Unrelated pages use fade
    return 'fade';
  }

  /**
   * Check if route matches a pattern
   */
  private matchesPattern(route: string, pattern: string | RegExp): boolean {
    if (typeof pattern === 'string') {
      return route === pattern;
    }
    return pattern.test(route);
  }

  /**
   * Calculate route nesting level
   */
  private calculateRouteLevel(route: string): number {
    return route.split('/').filter(segment => segment.length > 0).length;
  }

  /**
   * Extract category from route (for tools, etc.)
   */
  private extractCategory(route: string): string | undefined {
    const toolsMatch = route.match(/^\/tools\/([^\/]+)/);
    if (toolsMatch) {
      return toolsMatch[1];
    }
    return undefined;
  }

  /**
   * Find parent route for hierarchical navigation
   */
  private findParentRoute(route: string): string | undefined {
    const segments = route.split('/').filter(segment => segment.length > 0);
    if (segments.length <= 1) {
      return undefined;
    }
    
    segments.pop(); // Remove last segment
    return '/' + segments.join('/');
  }

  /**
   * Find child routes (placeholder - would need actual route discovery in real implementation)
   */
  private findChildRoutes(route: string): string[] {
    // This would typically involve scanning the file system or route manifest
    // For now, return empty array as this is beyond the scope of this task
    return [];
  }

  /**
   * Check if reduced motion should be used
   */
  private shouldUseReducedMotion(): boolean {
    if (typeof window === 'undefined') return false;
    
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    return mediaQuery.matches;
  }

  /**
   * Get all registered page types
   */
  getAllPageTypes(): PageType[] {
    return Object.values(PageType);
  }

  /**
   * Get all registered transition configurations
   */
  getAllTransitions(): Map<string, TransitionConfig> {
    return new Map(this.transitionConfigs);
  }

  /**
   * Clear all custom registrations (useful for testing)
   */
  reset(): void {
    this.routePatterns = [];
    this.transitionConfigs.clear();
    this.pageMetadataCache.clear();
    this.initializeDefaultPatterns();
    this.initializeDefaultTransitions();
    this.defaultTransition = this.createDefaultTransition();
  }
}

// Export singleton instance
export const transitionRegistry = new TransitionRegistry();