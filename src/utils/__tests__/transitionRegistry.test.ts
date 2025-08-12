/**
 * Tests for TransitionRegistry
 */

import { TransitionRegistry, PageType, PageRelationship } from '../transitionRegistry';

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

describe('TransitionRegistry', () => {
  let registry: TransitionRegistry;

  beforeEach(() => {
    registry = new TransitionRegistry();
    // Reset matchMedia mock
    (window.matchMedia as jest.Mock).mockClear();
  });

  describe('Route Pattern Matching', () => {
    it('should correctly identify home page', () => {
      expect(registry.getPageType('/')).toBe(PageType.HOME);
      expect(registry.getPageType('')).toBe(PageType.HOME);
    });

    it('should correctly identify blog pages', () => {
      expect(registry.getPageType('/blog/')).toBe(PageType.BLOG_LIST);
      expect(registry.getPageType('/blog')).toBe(PageType.BLOG_LIST);
      expect(registry.getPageType('/blog/2024-01-21-deploy-astro-static-on-deno-deploy/')).toBe(PageType.BLOG_POST);
    });

    it('should correctly identify tools pages', () => {
      expect(registry.getPageType('/tools/')).toBe(PageType.TOOLS_LIST);
      expect(registry.getPageType('/tools')).toBe(PageType.TOOLS_LIST);
      expect(registry.getPageType('/tools/developer/')).toBe(PageType.TOOLS_CATEGORY);
      expect(registry.getPageType('/tools/design')).toBe(PageType.TOOLS_CATEGORY);
    });

    it('should correctly identify static pages', () => {
      expect(registry.getPageType('/about/')).toBe(PageType.ABOUT);
      expect(registry.getPageType('/contact')).toBe(PageType.CONTACT);
      expect(registry.getPageType('/search')).toBe(PageType.SEARCH);
      expect(registry.getPageType('/offline')).toBe(PageType.OFFLINE);
      expect(registry.getPageType('/404')).toBe(PageType.NOT_FOUND);
    });
  });

  describe('Page Relationships', () => {
    it('should identify sibling relationships', () => {
      const relationship = registry.getPageRelationship(PageType.BLOG_POST, PageType.BLOG_POST);
      expect(relationship).toBe(PageRelationship.SIBLING);
    });

    it('should identify parent-child relationships', () => {
      const listToPost = registry.getPageRelationship(PageType.BLOG_LIST, PageType.BLOG_POST);
      expect(listToPost).toBe(PageRelationship.PARENT_CHILD);

      const postToList = registry.getPageRelationship(PageType.BLOG_POST, PageType.BLOG_LIST);
      expect(postToList).toBe(PageRelationship.PARENT_CHILD);

      const toolsListToCategory = registry.getPageRelationship(PageType.TOOLS_LIST, PageType.TOOLS_CATEGORY);
      expect(toolsListToCategory).toBe(PageRelationship.PARENT_CHILD);
    });

    it('should identify contextual relationships', () => {
      const blogToTools = registry.getPageRelationship(PageType.BLOG_LIST, PageType.TOOLS_LIST);
      expect(blogToTools).toBe(PageRelationship.CONTEXTUAL);

      const aboutToContact = registry.getPageRelationship(PageType.ABOUT, PageType.CONTACT);
      expect(aboutToContact).toBe(PageRelationship.CONTEXTUAL);
    });

    it('should identify unrelated relationships', () => {
      const homeToOffline = registry.getPageRelationship(PageType.HOME, PageType.OFFLINE);
      expect(homeToOffline).toBe(PageRelationship.UNRELATED);
    });
  });

  describe('Transition Selection', () => {
    it('should select slide transitions for sibling navigation', () => {
      const forwardContext = {
        direction: 'forward' as const,
        fromPageType: PageType.BLOG_POST,
        toPageType: PageType.BLOG_POST,
        relationship: PageRelationship.SIBLING
      };

      const transition = registry.getTransitionForNavigation(forwardContext);
      expect(transition.name).toBe('slide-forward');

      const backwardContext = {
        ...forwardContext,
        direction: 'backward' as const
      };

      const backwardTransition = registry.getTransitionForNavigation(backwardContext);
      expect(backwardTransition.name).toBe('slide-backward');
    });

    it('should select scale transitions for parent-child navigation', () => {
      const drillDownContext = {
        direction: 'forward' as const,
        fromPageType: PageType.BLOG_LIST,
        toPageType: PageType.BLOG_POST,
        relationship: PageRelationship.PARENT_CHILD
      };

      const transition = registry.getTransitionForNavigation(drillDownContext);
      expect(transition.name).toBe('scale-up');

      const drillUpContext = {
        ...drillDownContext,
        fromPageType: PageType.BLOG_POST,
        toPageType: PageType.BLOG_LIST
      };

      const upTransition = registry.getTransitionForNavigation(drillUpContext);
      expect(upTransition.name).toBe('scale-down');
    });

    it('should select crossfade for contextual navigation', () => {
      const contextualContext = {
        direction: 'forward' as const,
        fromPageType: PageType.BLOG_LIST,
        toPageType: PageType.TOOLS_LIST,
        relationship: PageRelationship.CONTEXTUAL
      };

      const transition = registry.getTransitionForNavigation(contextualContext);
      expect(transition.name).toBe('crossfade');
    });

    it('should select fade for unrelated navigation', () => {
      const unrelatedContext = {
        direction: 'forward' as const,
        fromPageType: PageType.HOME,
        toPageType: PageType.OFFLINE,
        relationship: PageRelationship.UNRELATED
      };

      const transition = registry.getTransitionForNavigation(unrelatedContext);
      expect(transition.name).toBe('fade');
    });
  });

  describe('Custom Registration', () => {
    it('should allow registering custom transitions', () => {
      const customTransition = {
        name: 'custom-slide',
        duration: 500,
        easing: 'ease-out',
        elements: [],
        cssClass: 'custom-transition'
      };

      const customPattern = {
        pattern: /^\/custom/,
        pageType: PageType.HOME,
        priority: 200
      };

      registry.registerTransition(customPattern, customTransition);

      // Should be able to retrieve the custom transition
      const allTransitions = registry.getAllTransitions();
      expect(allTransitions.has('custom-slide')).toBe(true);
      expect(allTransitions.get('custom-slide')).toEqual(customTransition);
    });

    it('should allow setting custom default transition', () => {
      const customDefault = {
        name: 'custom-default',
        duration: 100,
        easing: 'linear',
        elements: []
      };

      registry.setDefaultTransition(customDefault);
      expect(registry.getDefaultTransition()).toEqual(customDefault);
    });
  });

  describe('Utility Methods', () => {
    it('should return all page types', () => {
      const pageTypes = registry.getAllPageTypes();
      expect(pageTypes).toContain(PageType.HOME);
      expect(pageTypes).toContain(PageType.BLOG_LIST);
      expect(pageTypes).toContain(PageType.BLOG_POST);
      expect(pageTypes.length).toBeGreaterThan(5);
    });

    it('should reset to initial state', () => {
      // Add custom data
      const customTransition = {
        name: 'test-transition',
        duration: 100,
        easing: 'linear',
        elements: []
      };
      
      registry.registerPageType('/test', PageType.HOME);
      registry.setDefaultTransition(customTransition);

      // Reset
      registry.reset();

      // Should be back to defaults
      expect(registry.getDefaultTransition().name).toBe('default');
      expect(registry.getPageType('/test')).toBe(PageType.UNKNOWN); // Should return unknown for unmatched routes
    });
  });
});