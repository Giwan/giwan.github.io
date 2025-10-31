/**
 * Tests for TransitionController
 */

// Mock browser APIs before importing modules
const mockMatchMedia = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();

// Setup global mocks before importing
mockMatchMedia.mockReturnValue({
  matches: false,
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
});

// Mock properties on the existing window and document objects
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  configurable: true,
  value: mockMatchMedia,
});
window.addEventListener = jest.fn();
window.removeEventListener = jest.fn();


Object.defineProperty(window, 'innerWidth', {
  writable: true,
  configurable: true,
  value: 1024,
});

Object.defineProperty(window, 'innerHeight', {
  writable: true,
  configurable: true,
  value: 768,
});

Object.defineProperty(window, 'navigator', {
  writable: true,
  configurable: true,
  value: {
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    hardwareConcurrency: 8,
    connection: { 
      effectiveType: '4g',
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    }
  },
});

document.addEventListener = mockAddEventListener;
document.removeEventListener = mockRemoveEventListener;

Object.defineProperty(document, 'referrer', {
  writable: true,
  configurable: true,
  value: ''
});

Object.defineProperty(document, 'documentElement', {
  writable: true,
  configurable: true,
  value: {
    setAttribute: jest.fn(),
    removeAttribute: jest.fn(),
    style: {
      setProperty: jest.fn(),
      removeProperty: jest.fn()
    }
  },
});

Object.defineProperty(window, 'performance', {
  writable: true,
  configurable: true,
  value: {
    now: jest.fn(() => Date.now()),
    memory: {
      usedJSHeapSize: 50000000,
      jsHeapSizeLimit: 100000000
    }
  },
});

// Mock the dependencies
jest.mock('../mobileTransitionOptimizer', () => ({
  mobileTransitionOptimizer: {
    getTransitionOptimization: jest.fn(() => ({
      shouldOptimize: true,
      recommendedDuration: 300,
      recommendedEasing: 'ease-out',
      optimizationType: 'mobile'
    })),
    getDeviceCapabilities: jest.fn(() => ({
      isMobile: false,
      isTablet: false,
      isPWA: false,
      orientation: 'landscape',
      batteryLevel: 0.8,
      isLowBattery: false
    })),
    getNetworkCondition: jest.fn(() => ({
      effectiveType: '4g',
      saveData: false
    }))
  }
}));

jest.mock('../pwaTransitionIntegration', () => ({
  pwaTransitionIntegration: {
    getPWATransitionSettings: jest.fn(() => ({
      shouldOptimize: false,
      duration: 300,
      easing: 'ease-in-out'
    }))
  }
}));

jest.mock('../performanceMonitor', () => ({
  performanceMonitor: {
    startMonitoring: jest.fn(),
    stopMonitoring: jest.fn(() => ({
      startTime: Date.now() - 300,
      endTime: Date.now(),
      averageFrameRate: 60,
      droppedFrames: 0
    })),
    getCurrentMetrics: jest.fn(() => ({
      frameRate: 60,
      memoryUsage: 0.5
    })),
    destroy: jest.fn()
  }
}));

jest.mock('../transitionPreferences', () => ({
  transitionPreferences: {
    getPreferences: jest.fn(() => ({
      customDuration: null,
      debugMode: false,
      enableSoundEffects: false,
      enableHapticFeedback: false
    })),
    getEffectiveIntensity: jest.fn(() => 'normal'),
    destroy: jest.fn()
  }
}));

jest.mock('../transitionErrorHandler', () => ({
  transitionErrorHandler: {}
}));

// Now import the module after mocks are set up
import TransitionController, { 
  PageType, 
  NavigationDirection, 
  PageRelationship 
} from '../transitionController';

describe('TransitionController', () => {
  let controller: TransitionController;

  beforeEach(() => {
    jest.clearAllMocks();
    mockMatchMedia.mockReturnValue({ 
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    });
    
    controller = new TransitionController();
  });

  afterEach(() => {
    if (controller) {
      controller.destroy();
    }
  });

  describe('Page Type Classification', () => {
    it('should classify home page correctly', () => {
      const context = controller.detectNavigationContext('/', '/');
      expect(context.fromPageType).toBe(PageType.HOME);
      expect(context.toPageType).toBe(PageType.HOME);
    });

    it('should classify blog pages correctly', () => {
      const context = controller.detectNavigationContext('/', '/blog');
      expect(context.toPageType).toBe(PageType.BLOG_LIST);
      
      const postContext = controller.detectNavigationContext('/blog', '/blog/my-post');
      expect(postContext.toPageType).toBe(PageType.BLOG_POST);
    });

    it('should classify tools pages correctly', () => {
      const context = controller.detectNavigationContext('/', '/tools');
      expect(context.toPageType).toBe(PageType.TOOLS_LIST);
      
      const categoryContext = controller.detectNavigationContext('/tools', '/tools/developer');
      expect(categoryContext.toPageType).toBe(PageType.TOOLS_CATEGORY);
    });

    it('should classify static pages correctly', () => {
      const aboutContext = controller.detectNavigationContext('/', '/about');
      expect(aboutContext.toPageType).toBe(PageType.ABOUT);
      
      const contactContext = controller.detectNavigationContext('/', '/contact');
      expect(contactContext.toPageType).toBe(PageType.CONTACT);
    });
  });

  describe('Navigation Direction Detection', () => {
    it('should detect forward navigation', () => {
      const context = controller.detectNavigationContext('/', '/blog');
      expect(context.direction).toBe(NavigationDirection.FORWARD);
    });

    it('should detect backward navigation from detail to list', () => {
      const context = controller.detectNavigationContext('/blog/my-post', '/blog');
      expect(context.direction).toBe(NavigationDirection.BACKWARD);
    });

    it('should detect refresh navigation', () => {
      const context = controller.detectNavigationContext('/blog', '/blog');
      expect(context.direction).toBe(NavigationDirection.REFRESH);
    });
  });

  describe('Page Relationship Analysis', () => {
    it('should detect parent-child relationship', () => {
      const context = controller.detectNavigationContext('/blog', '/blog/my-post');
      expect(context.relationship).toBe(PageRelationship.PARENT_CHILD);
    });

    it('should detect child-parent relationship', () => {
      const context = controller.detectNavigationContext('/blog/my-post', '/blog');
      expect(context.relationship).toBe(PageRelationship.CHILD_PARENT);
    });

    it('should detect sibling relationship', () => {
      const context = controller.detectNavigationContext('/blog/post-1', '/blog/post-2');
      expect(context.relationship).toBe(PageRelationship.SIBLING);
    });

    it('should detect contextual relationship', () => {
      const context = controller.detectNavigationContext('/blog', '/search');
      expect(context.relationship).toBe(PageRelationship.CONTEXTUAL);
    });

    it('should detect unrelated relationship', () => {
      const context = controller.detectNavigationContext('/blog', '/tools');
      expect(context.relationship).toBe(PageRelationship.UNRELATED);
    });
  });

  describe('Metrics Tracking', () => {
    it('should initialize with zero metrics', () => {
      const metrics = controller.getMetrics();
      expect(metrics.totalTransitions).toBe(0);
      expect(metrics.averageDuration).toBe(0);
      expect(metrics.failureRate).toBe(0);
    });

    it('should track navigation context', () => {
      const context = controller.detectNavigationContext('/', '/blog');
      expect(context.timestamp).toBeGreaterThan(0);
      expect(context.fromPath).toBe('/');
      expect(context.toPath).toBe('/blog');
    });
  });

  describe('Browser Support Detection', () => {
    it('should detect view transition support', () => {
      // Mock startViewTransition support
      Object.defineProperty(document, 'startViewTransition', {
        writable: true,
        value: jest.fn(),
      });
      
      expect(controller.isTransitionSupported()).toBe(true);
    });

    it('should handle browser environment check', () => {
      // Test that the method exists and returns a boolean
      const result = controller.isTransitionSupported();
      expect(typeof result).toBe('boolean');
    });
  });

  describe('Cleanup', () => {
    it('should remove event listeners on destroy', () => {
      controller.destroy();
      expect(mockRemoveEventListener).toHaveBeenCalled();
    });
  });
});