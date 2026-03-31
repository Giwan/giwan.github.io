/**
 * Tests for AccessibilityManager
 */

import { AccessibilityManager } from '../accessibilityManager';

// Mock DOM methods
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
};

const mockMatchMedia = jest.fn();
const mockAddEventListener = jest.fn();
const mockRemoveEventListener = jest.fn();
const mockCreateElement = jest.fn();
const mockAppendChild = jest.fn();
const mockRemoveChild = jest.fn();
const mockQuerySelector = jest.fn();
const mockGetBoundingClientRect = jest.fn();
const mockGetComputedStyle = jest.fn();

// Setup DOM mocks
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true,
  });

  Object.defineProperty(window, 'matchMedia', {
    value: mockMatchMedia,
    writable: true,
  });

  Object.defineProperty(document, 'addEventListener', {
    value: mockAddEventListener,
  });

  Object.defineProperty(document, 'removeEventListener', {
    value: mockRemoveEventListener,
  });

  Object.defineProperty(document, 'createElement', {
    value: mockCreateElement,
  });

  Object.defineProperty(document.body, 'appendChild', {
    value: mockAppendChild,
  });

  Object.defineProperty(document.body, 'removeChild', {
    value: mockRemoveChild,
  });

  Object.defineProperty(document, 'querySelector', {
    value: mockQuerySelector,
  });

  Object.defineProperty(window, 'getComputedStyle', {
    value: mockGetComputedStyle,
  });

  // Mock element methods
  const mockElement = {
    setAttribute: jest.fn(),
    removeAttribute: jest.fn(),
    style: {
      cssText: '',
      setProperty: jest.fn(),
      removeProperty: jest.fn(),
      viewTransitionName: '',
    },
    textContent: '',
    focus: jest.fn(),
    scrollIntoView: jest.fn(),
    getBoundingClientRect: jest.fn().mockReturnValue({
      width: 100,
      height: 100,
    }),
    addEventListener: jest.fn(),
  };

  mockCreateElement.mockReturnValue(mockElement);
  mockQuerySelector.mockReturnValue(mockElement);
  mockGetBoundingClientRect.mockReturnValue({
    width: 100,
    height: 100,
  });
  mockGetComputedStyle.mockReturnValue({
    visibility: 'visible',
  });

  // Mock media query
  mockMatchMedia.mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });
});

beforeEach(() => {
  jest.clearAllMocks();
  mockLocalStorage.getItem.mockReturnValue(null);
});

describe('AccessibilityManager', () => {
  describe('initialization', () => {
    it('should initialize with default preferences', () => {
      const manager = new AccessibilityManager();
      const preferences = manager.getPreferences();

      expect(preferences).toEqual({
        reducedMotion: false,
        screenReaderAnnouncements: true,
        focusManagement: true,
        keyboardNavigation: true,
      });
    });

    it('should load preferences from localStorage', () => {
      const storedPreferences = {
        reducedMotion: true,
        screenReaderAnnouncements: false,
        focusManagement: true,
        keyboardNavigation: false,
      };

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storedPreferences));

      const manager = new AccessibilityManager();
      const preferences = manager.getPreferences();

      expect(preferences).toEqual(expect.objectContaining(storedPreferences));
    });

    it('should detect reduced motion preference from system', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      });

      const manager = new AccessibilityManager();
      const preferences = manager.getPreferences();

      expect(preferences.reducedMotion).toBe(true);
    });

    it('should create screen reader announcer element', () => {
      new AccessibilityManager();

      expect(mockCreateElement).toHaveBeenCalledWith('div');
      expect(mockAppendChild).toHaveBeenCalled();
    });

    it('should setup event listeners', () => {
      new AccessibilityManager();

      expect(mockAddEventListener).toHaveBeenCalledWith(
        'astro:before-preparation',
        expect.any(Function)
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'astro:after-swap',
        expect.any(Function)
      );
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'astro:page-load',
        expect.any(Function)
      );
    });
  });

  describe('preferences management', () => {
    it('should update preferences', () => {
      const manager = new AccessibilityManager();

      manager.updatePreferences({ reducedMotion: true });

      const preferences = manager.getPreferences();
      expect(preferences.reducedMotion).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'accessibility-preferences',
        expect.stringContaining('"reducedMotion":true')
      );
    });

    it('should apply reduced motion preferences to DOM', () => {
      const mockRoot = {
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
        style: {
          setProperty: jest.fn(),
          removeProperty: jest.fn(),
        },
      };

      Object.defineProperty(document, 'documentElement', {
        value: mockRoot,
        configurable: true,
      });

      const manager = new AccessibilityManager();
      manager.updatePreferences({ reducedMotion: true });

      expect(mockRoot.setAttribute).toHaveBeenCalledWith('data-reduced-motion', 'true');
      expect(mockRoot.style.setProperty).toHaveBeenCalledWith('--transition-duration-fast', '0ms');
      expect(mockRoot.style.setProperty).toHaveBeenCalledWith('--transition-duration-normal', '0ms');
      expect(mockRoot.style.setProperty).toHaveBeenCalledWith('--transition-duration-slow', '0ms');
    });
  });

  describe('screen reader announcements', () => {
    it('should announce messages to screen readers', () => {
      const manager = new AccessibilityManager();
      const mockAnnouncer = {
        setAttribute: jest.fn(),
        textContent: '',
      };

      // Mock the announcer element
      manager['announcer'] = mockAnnouncer as any;

      manager.announce({
        message: 'Test announcement',
        priority: 'polite',
      });

      expect(mockAnnouncer.setAttribute).toHaveBeenCalledWith('aria-live', 'polite');
      expect(mockAnnouncer.textContent).toBe('Test announcement');
    });

    it('should not announce when screen reader announcements are disabled', () => {
      const manager = new AccessibilityManager();
      manager.updatePreferences({ screenReaderAnnouncements: false });

      const mockAnnouncer = {
        setAttribute: jest.fn(),
        textContent: '',
      };

      manager['announcer'] = mockAnnouncer as any;

      manager.announce({
        message: 'Test announcement',
        priority: 'polite',
      });

      expect(mockAnnouncer.setAttribute).not.toHaveBeenCalled();
    });

    it('should handle delayed announcements', (done) => {
      const manager = new AccessibilityManager();
      const mockAnnouncer = {
        setAttribute: jest.fn(),
        textContent: '',
      };

      manager['announcer'] = mockAnnouncer as any;

      manager.announce({
        message: 'Delayed announcement',
        priority: 'assertive',
        delay: 50,
      });

      // Should not be called immediately
      expect(mockAnnouncer.textContent).toBe('');

      setTimeout(() => {
        expect(mockAnnouncer.textContent).toBe('Delayed announcement');
        expect(mockAnnouncer.setAttribute).toHaveBeenCalledWith('aria-live', 'assertive');
        done();
      }, 60);
    });
  });

  describe('focus management', () => {
    it('should manage focus after transition', () => {
      const manager = new AccessibilityManager();
      const mockMainContent = {
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
        focus: jest.fn(),
        getBoundingClientRect: jest.fn().mockReturnValue({
          width: 100,
          height: 100,
        }),
      };

      // Mock getElementById specifically for main-content
      const mockGetElementById = jest.fn();
      Object.defineProperty(document, 'getElementById', {
        value: mockGetElementById,
        configurable: true,
      });

      mockGetElementById.mockReturnValue(mockMainContent);

      // Simulate transition completion
      manager['handleTransitionComplete']();

      expect(mockMainContent.setAttribute).toHaveBeenCalledWith('tabindex', '-1');
      expect(mockMainContent.focus).toHaveBeenCalled();
    });

    it('should not manage focus when disabled', () => {
      const manager = new AccessibilityManager();
      manager.updatePreferences({ focusManagement: false });

      const mockMainContent = {
        setAttribute: jest.fn(),
        focus: jest.fn(),
      };

      mockQuerySelector.mockReturnValue(mockMainContent);

      manager['handleTransitionComplete']();

      expect(mockMainContent.focus).not.toHaveBeenCalled();
    });
  });

  describe('page title detection', () => {
    it('should detect page titles from paths', () => {
      const manager = new AccessibilityManager();

      expect(manager['getPageTitle']('/')).toBe('Home');
      expect(manager['getPageTitle']('/blog')).toBe('Blog');
      expect(manager['getPageTitle']('/tools')).toBe('Tools');
      expect(manager['getPageTitle']('/about')).toBe('About');
      expect(manager['getPageTitle']('/contact')).toBe('Contact');
      expect(manager['getPageTitle']('/search')).toBe('Search');
      expect(manager['getPageTitle']('/offline')).toBe('Offline');
    });

    it('should detect blog article pages', () => {
      const manager = new AccessibilityManager();

      expect(manager['getPageTitle']('/blog/some-article')).toBe('Blog Article');
    });

    it('should detect tools category pages', () => {
      const manager = new AccessibilityManager();

      expect(manager['getPageTitle']('/tools/category')).toBe('Tools Category');
    });

    it('should return generic page title for unknown paths', () => {
      const manager = new AccessibilityManager();

      expect(manager['getPageTitle']('/unknown-path')).toBe('Page');
    });
  });

  describe('keyboard navigation', () => {
    it('should skip to main content when requested', () => {
      const manager = new AccessibilityManager();
      const mockMainContent = {
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
        focus: jest.fn(),
        scrollIntoView: jest.fn(),
        getAttribute: jest.fn().mockReturnValue(null),
      };

      const mockGetElementById = jest.fn();
      Object.defineProperty(document, 'getElementById', {
        value: mockGetElementById,
        configurable: true,
      });

      mockGetElementById.mockReturnValue(mockMainContent);

      // Call the skip to main content method directly
      manager['skipToMainContent']();

      expect(mockMainContent.setAttribute).toHaveBeenCalledWith('tabindex', '-1');
      expect(mockMainContent.focus).toHaveBeenCalled();
      expect(mockMainContent.scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('should navigate back when requested', () => {
      const manager = new AccessibilityManager();
      const mockHistory = {
        back: jest.fn(),
        forward: jest.fn(),
        length: 2,
      };

      Object.defineProperty(window, 'history', {
        value: mockHistory,
        configurable: true,
      });

      // Call the navigate back method directly
      manager['navigateBack']();

      expect(mockHistory.back).toHaveBeenCalled();
    });

    it('should navigate forward when requested', () => {
      const manager = new AccessibilityManager();
      const mockHistory = {
        back: jest.fn(),
        forward: jest.fn(),
        length: 2,
      };

      Object.defineProperty(window, 'history', {
        value: mockHistory,
        configurable: true,
      });

      // Call the navigate forward method directly
      manager['navigateForward']();

      expect(mockHistory.forward).toHaveBeenCalled();
    });

    it('should focus search when available', () => {
      const manager = new AccessibilityManager();
      const mockSearchInput = {
        focus: jest.fn(),
      };

      mockQuerySelector.mockReturnValue(mockSearchInput);

      // Call the focus search method directly
      manager['focusSearch']();

      expect(mockSearchInput.focus).toHaveBeenCalled();
    });
  });

  describe('skip links', () => {
    it('should get correct skip target names', () => {
      const manager = new AccessibilityManager();

      expect(manager['getSkipTargetName']('#main-content')).toBe('main content');
      expect(manager['getSkipTargetName']('#navigation')).toBe('navigation');
      expect(manager['getSkipTargetName']('#footer')).toBe('footer');
      expect(manager['getSkipTargetName']('#custom-target')).toBe('custom-target');
    });
  });

  describe('cleanup', () => {
    it('should remove announcer element on destroy', () => {
      const manager = new AccessibilityManager();
      const mockAnnouncer = document.createElement('div');
      manager['announcer'] = mockAnnouncer;

      manager.destroy();

      expect(mockRemoveChild).toHaveBeenCalledWith(mockAnnouncer);
      expect(manager['announcer']).toBeNull();
    });
  });
});