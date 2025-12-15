/**
 * Accessibility Manager for View Transitions
 * 
 * Provides comprehensive accessibility support including:
 * - Screen reader announcements for navigation
 * - Focus management during transitions
 * - Reduced motion preference handling
 * - Keyboard navigation support
 */

export interface AccessibilityPreferences {
  reducedMotion: boolean;
  screenReaderAnnouncements: boolean;
  focusManagement: boolean;
  keyboardNavigation: boolean;
}

export interface NavigationAnnouncement {
  message: string;
  priority: 'polite' | 'assertive';
  delay?: number;
}

export class AccessibilityManager {
  private preferences: AccessibilityPreferences;
  private announcer: HTMLElement | null = null;
  private focusHistory: HTMLElement[] = [];
  private lastFocusedElement: HTMLElement | null = null;
  private isTransitioning = false;

  constructor() {
    this.preferences = this.loadPreferences();
    this.init();
  }

  /**
   * Initialize the accessibility manager
   */
  private init(): void {
    if (typeof document === 'undefined') return;

    this.createScreenReaderAnnouncer();
    this.setupTransitionEventListeners();
    this.setupKeyboardNavigation();
    this.setupReducedMotionHandling();
    this.setupFocusManagement();
  }

  /**
   * Load accessibility preferences from localStorage and system settings
   */
  private loadPreferences(): AccessibilityPreferences {
    const stored = typeof localStorage !== 'undefined' && typeof localStorage.getItem === 'function'
      ? localStorage.getItem('accessibility-preferences') 
      : null;
    
    const defaults: AccessibilityPreferences = {
      reducedMotion: this.detectReducedMotionPreference(),
      screenReaderAnnouncements: true,
      focusManagement: true,
      keyboardNavigation: true,
    };

    if (stored) {
      try {
        return { ...defaults, ...JSON.parse(stored) };
      } catch {
        return defaults;
      }
    }

    return defaults;
  }

  /**
   * Detect system reduced motion preference
   */
  private detectReducedMotionPreference(): boolean {
    if (typeof window === 'undefined') return false;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Create a hidden element for screen reader announcements
   */
  private createScreenReaderAnnouncer(): void {
    if (!this.preferences.screenReaderAnnouncements) return;

    this.announcer = document.createElement('div');
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    this.announcer.id = 'accessibility-announcer';
    
    // Add styles to ensure it's completely hidden but accessible to screen readers
    this.announcer.style.cssText = `
      position: absolute !important;
      width: 1px !important;
      height: 1px !important;
      padding: 0 !important;
      margin: -1px !important;
      overflow: hidden !important;
      clip: rect(0, 0, 0, 0) !important;
      white-space: nowrap !important;
      border: 0 !important;
    `;

    document.body.appendChild(this.announcer);
  }

  /**
   * Setup event listeners for Astro transition events
   */
  private setupTransitionEventListeners(): void {
    document.addEventListener('astro:before-preparation', this.handleTransitionStart.bind(this));
    document.addEventListener('astro:after-swap', this.handleTransitionComplete.bind(this));
    document.addEventListener('astro:page-load', this.handlePageLoad.bind(this));
  }

  /**
   * Handle transition start
   */
  private handleTransitionStart(event: Event): void {
    this.isTransitioning = true;
    
    // Store current focus for restoration if needed
    this.lastFocusedElement = document.activeElement as HTMLElement;
    
    // Announce navigation start to screen readers
    if (this.preferences.screenReaderAnnouncements) {
      const customEvent = event as CustomEvent;
      const fromPath = customEvent.detail?.from?.pathname || 'current page';
      const toPath = customEvent.detail?.to?.pathname || 'new page';
      
      this.announce({
        message: `Navigating from ${this.getPageTitle(fromPath)} to ${this.getPageTitle(toPath)}`,
        priority: 'polite'
      });
    }

    // Apply reduced motion preferences
    this.applyReducedMotionPreferences();
  }

  /**
   * Handle transition completion
   */
  private handleTransitionComplete(): void {
    this.isTransitioning = false;

    // Manage focus after transition
    if (this.preferences.focusManagement) {
      this.manageFocusAfterTransition();
    }

    // Announce page load completion
    if (this.preferences.screenReaderAnnouncements) {
      const pageTitle = document.title || 'New page';
      this.announce({
        message: `${pageTitle} loaded`,
        priority: 'polite',
        delay: 100 // Small delay to ensure page is fully rendered
      });
    }
  }

  /**
   * Handle page load
   */
  private handlePageLoad(): void {
    // Update page landmarks with transition names
    this.updateLandmarkTransitionNames();
    
    // Ensure skip links are properly configured
    this.setupSkipLinks();
  }

  /**
   * Setup keyboard navigation enhancements
   */
  private setupKeyboardNavigation(): void {
    if (!this.preferences.keyboardNavigation) return;

    // Enhanced keyboard navigation for transitions
    document.addEventListener('keydown', (event) => {
      // Skip to main content with Ctrl+/
      if (event.ctrlKey && event.key === '/') {
        event.preventDefault();
        this.skipToMainContent();
      }

      // Navigate back with Alt+Left Arrow
      if (event.altKey && event.key === 'ArrowLeft') {
        event.preventDefault();
        this.navigateBack();
      }

      // Navigate forward with Alt+Right Arrow
      if (event.altKey && event.key === 'ArrowRight') {
        event.preventDefault();
        this.navigateForward();
      }

      // Focus search with Ctrl+K or Cmd+K
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        this.focusSearch();
      }

      // Escape key to close modals/panels
      if (event.key === 'Escape') {
        this.handleEscapeKey();
      }

      // Tab navigation enhancement during transitions
      if (event.key === 'Tab' && this.isTransitioning) {
        this.handleTabDuringTransition(event);
      }
    });

    // Handle focus trapping during transitions
    document.addEventListener('focusin', (event) => {
      if (this.isTransitioning) {
        this.handleFocusDuringTransition(event);
      }
    });
  }

  /**
   * Setup reduced motion handling
   */
  private setupReducedMotionHandling(): void {
    // Listen for changes in reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    mediaQuery.addEventListener('change', (e) => {
      this.preferences.reducedMotion = e.matches;
      this.applyReducedMotionPreferences();
      this.savePreferences();
    });
  }

  /**
   * Apply reduced motion preferences to the document
   */
  private applyReducedMotionPreferences(): void {
    const root = document.documentElement;
    
    if (this.preferences.reducedMotion) {
      root.setAttribute('data-reduced-motion', 'true');
      root.style.setProperty('--transition-duration-fast', '0ms');
      root.style.setProperty('--transition-duration-normal', '0ms');
      root.style.setProperty('--transition-duration-slow', '0ms');
    } else {
      root.removeAttribute('data-reduced-motion');
      root.style.removeProperty('--transition-duration-fast');
      root.style.removeProperty('--transition-duration-normal');
      root.style.removeProperty('--transition-duration-slow');
    }
  }

  /**
   * Setup focus management
   */
  private setupFocusManagement(): void {
    if (!this.preferences.focusManagement) return;

    // Track focus changes
    document.addEventListener('focusin', (event) => {
      if (!this.isTransitioning) {
        this.focusHistory.push(event.target as HTMLElement);
        // Keep history manageable
        if (this.focusHistory.length > 10) {
          this.focusHistory.shift();
        }
      }
    });
  }

  /**
   * Manage focus after transition completion
   */
  private manageFocusAfterTransition(): void {
    // Try to focus on the main content area
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      // Make main content focusable temporarily
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      
      // Remove tabindex after focus to maintain natural tab order
      setTimeout(() => {
        mainContent.removeAttribute('tabindex');
      }, 100);
      
      return;
    }

    // Fallback: focus on the first focusable element
    const firstFocusable = this.getFirstFocusableElement();
    if (firstFocusable) {
      firstFocusable.focus();
    }
  }

  /**
   * Get the first focusable element on the page
   */
  private getFirstFocusableElement(): HTMLElement | null {
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])'
    ];

    for (const selector of focusableSelectors) {
      const element = document.querySelector(selector) as HTMLElement;
      if (element && this.isElementVisible(element)) {
        return element;
      }
    }

    return null;
  }

  /**
   * Check if an element is visible
   */
  private isElementVisible(element: HTMLElement): boolean {
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 && 
           window.getComputedStyle(element).visibility !== 'hidden';
  }

  /**
   * Update landmark elements with transition names for continuity
   */
  private updateLandmarkTransitionNames(): void {
    // Main content
    const main = document.querySelector('main');
    if (main && !main.style.viewTransitionName) {
      main.style.viewTransitionName = 'main-content';
    }

    // Navigation
    const nav = document.querySelector('nav[aria-label="Main navigation"]');
    if (nav && !nav.style.viewTransitionName) {
      nav.style.viewTransitionName = 'navigation';
    }

    // Header
    const header = document.querySelector('header[role="banner"]');
    if (header && !header.style.viewTransitionName) {
      header.style.viewTransitionName = 'header';
    }

    // Footer
    const footer = document.querySelector('footer[role="contentinfo"]');
    if (footer && !footer.style.viewTransitionName) {
      footer.style.viewTransitionName = 'footer';
    }

    // Skip links
    const skipLinks = document.querySelectorAll('.skip-link');
    skipLinks.forEach((link, index) => {
      if (!link.style.viewTransitionName) {
        (link as HTMLElement).style.viewTransitionName = `skip-link-${index}`;
      }
    });
  }

  /**
   * Setup skip links with proper transition names
   */
  private setupSkipLinks(): void {
    const skipLinks = document.querySelectorAll('.skip-link');
    
    skipLinks.forEach((link) => {
      // Ensure skip links work properly during transitions
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const href = (link as HTMLAnchorElement).getAttribute('href');
        if (href && href.startsWith('#')) {
          const target = document.querySelector(href);
          if (target) {
            // Make target focusable if it isn't already
            const originalTabIndex = (target as HTMLElement).getAttribute('tabindex');
            if (!originalTabIndex) {
              (target as HTMLElement).setAttribute('tabindex', '-1');
            }
            
            (target as HTMLElement).focus();
            (target as HTMLElement).scrollIntoView({ 
              behavior: this.preferences.reducedMotion ? 'auto' : 'smooth',
              block: 'start'
            });
            
            // Announce the skip action
            if (this.preferences.screenReaderAnnouncements) {
              const targetName = this.getSkipTargetName(href);
              this.announce({
                message: `Skipped to ${targetName}`,
                priority: 'polite',
                delay: 100
              });
            }
            
            // Remove temporary tabindex after a short delay
            if (!originalTabIndex) {
              setTimeout(() => {
                (target as HTMLElement).removeAttribute('tabindex');
              }, 100);
            }
          }
        }
      });
    });
  }

  /**
   * Get human-readable name for skip link targets
   */
  private getSkipTargetName(href: string): string {
    const targetMap: Record<string, string> = {
      '#main-content': 'main content',
      '#navigation': 'navigation',
      '#footer': 'footer',
      '#search': 'search',
      '#sidebar': 'sidebar'
    };
    
    return targetMap[href] || href.substring(1);
  }

  /**
   * Announce message to screen readers
   */
  public announce(announcement: NavigationAnnouncement): void {
    if (!this.announcer || !this.preferences.screenReaderAnnouncements) return;

    const announce = () => {
      if (this.announcer) {
        this.announcer.setAttribute('aria-live', announcement.priority);
        this.announcer.textContent = announcement.message;
        
        // Clear after announcement to allow repeated announcements
        setTimeout(() => {
          if (this.announcer) {
            this.announcer.textContent = '';
          }
        }, 1000);
      }
    };

    if (announcement.delay) {
      setTimeout(announce, announcement.delay);
    } else {
      announce();
    }
  }

  /**
   * Skip to main content
   */
  private skipToMainContent(): void {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.setAttribute('tabindex', '-1');
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: 'smooth' });
      
      setTimeout(() => {
        mainContent.removeAttribute('tabindex');
      }, 100);
    }
  }

  /**
   * Navigate back using browser history
   */
  private navigateBack(): void {
    if (window.history.length > 1) {
      window.history.back();
    }
  }

  /**
   * Navigate forward using browser history
   */
  private navigateForward(): void {
    window.history.forward();
  }

  /**
   * Focus on search input if available
   */
  private focusSearch(): void {
    const searchInput = document.querySelector('input[type="search"], input[name="search"], #search-input') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
      if (this.preferences.screenReaderAnnouncements) {
        this.announce({
          message: 'Search focused',
          priority: 'polite'
        });
      }
    }
  }

  /**
   * Handle escape key press
   */
  private handleEscapeKey(): void {
    // Close any open modals or panels
    const openModals = document.querySelectorAll('[role="dialog"][aria-hidden="false"], .modal.open, .panel.open');
    if (openModals.length > 0) {
      openModals.forEach((modal) => {
        const closeButton = modal.querySelector('[aria-label*="close"], [aria-label*="Close"], .close-button');
        if (closeButton) {
          (closeButton as HTMLElement).click();
        }
      });
    }
  }

  /**
   * Handle tab navigation during transitions
   */
  private handleTabDuringTransition(event: KeyboardEvent): void {
    // Ensure focus stays within the main content area during transitions
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    const focusableElements = mainContent.querySelectorAll(
      'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstFocusable = focusableElements[0] as HTMLElement;
    const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (event.shiftKey) {
      // Shift+Tab - moving backwards
      if (document.activeElement === firstFocusable) {
        event.preventDefault();
        lastFocusable.focus();
      }
    } else {
      // Tab - moving forwards
      if (document.activeElement === lastFocusable) {
        event.preventDefault();
        firstFocusable.focus();
      }
    }
  }

  /**
   * Handle focus events during transitions
   */
  private handleFocusDuringTransition(event: FocusEvent): void {
    const target = event.target as HTMLElement;
    
    // Ensure focused element is visible and properly announced
    if (target && this.preferences.screenReaderAnnouncements) {
      const elementType = target.tagName.toLowerCase();
      const elementRole = target.getAttribute('role');
      const elementLabel = target.getAttribute('aria-label') || target.textContent?.trim();

      if (elementLabel && (elementType === 'button' || elementType === 'a' || elementRole)) {
        // Don't announce every focus change, only important ones
        if (target.matches('[aria-describedby], [aria-expanded], [role="button"], [role="link"]')) {
          this.announce({
            message: `Focused on ${elementLabel}`,
            priority: 'polite',
            delay: 200
          });
        }
      }
    }
  }

  /**
   * Get page title from path
   */
  private getPageTitle(path: string): string {
    const pathMap: Record<string, string> = {
      '/': 'Home',
      '/blog': 'Blog',
      '/tools': 'Tools',
      '/about': 'About',
      '/contact': 'Contact',
      '/search': 'Search',
      '/offline': 'Offline'
    };

    // Check for exact matches first
    if (pathMap[path]) {
      return pathMap[path];
    }

    // Check for pattern matches
    if (path.startsWith('/blog/')) {
      return 'Blog Article';
    }
    if (path.startsWith('/tools/')) {
      return 'Tools Category';
    }

    return 'Page';
  }

  /**
   * Update accessibility preferences
   */
  public updatePreferences(newPreferences: Partial<AccessibilityPreferences>): void {
    this.preferences = { ...this.preferences, ...newPreferences };
    this.savePreferences();
    this.applyReducedMotionPreferences();
  }

  /**
   * Save preferences to localStorage
   */
  private savePreferences(): void {
    if (typeof localStorage !== 'undefined' && typeof localStorage.setItem === 'function') {
      localStorage.setItem('accessibility-preferences', JSON.stringify(this.preferences));
    }
  }

  /**
   * Get current preferences
   */
  public getPreferences(): AccessibilityPreferences {
    return { ...this.preferences };
  }

  /**
   * Destroy the accessibility manager
   */
  public destroy(): void {
    if (this.announcer) {
      document.body.removeChild(this.announcer);
      this.announcer = null;
    }

    // Remove event listeners would go here if we stored references
    // For now, they'll be cleaned up when the page unloads
  }
}

// Create and export a singleton instance
export const accessibilityManager = new AccessibilityManager();

// Re-export types for better compatibility
export type { AccessibilityPreferences, NavigationAnnouncement };
