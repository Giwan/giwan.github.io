import {
  getFriendlyPageTitle,
  formatNavigationAnnouncement,
  formatLoadAnnouncement,
  formatSkipAnnouncement
} from '../domain/accessibility/announcements.domain';
import {
  resolvePreferences,
  AccessibilityPreferences
} from '../domain/accessibility/preferences.domain';
import {
  findFirstFocusable,
  getSkipTargetName
} from '../domain/accessibility/focus.domain';

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
    this.preferences = this.initPreferences();
    this.init();
  }

  private initPreferences(): AccessibilityPreferences {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('accessibility-preferences') : null;
    const systemReducedMotion = typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
    return resolvePreferences(stored, systemReducedMotion);
  }

  private init(): void {
    if (typeof document === 'undefined') return;

    this.createScreenReaderAnnouncer();
    this.setupEventListeners();
    this.applyReducedMotionPreferences();
  }

  private createScreenReaderAnnouncer(): void {
    if (!this.preferences.screenReaderAnnouncements) return;

    this.announcer = document.createElement('div');
    Object.assign(this.announcer.style, {
      position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px',
      overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0'
    });
    this.announcer.setAttribute('aria-live', 'polite');
    this.announcer.setAttribute('aria-atomic', 'true');
    this.announcer.className = 'sr-only';
    this.announcer.id = 'accessibility-announcer';
    document.body.appendChild(this.announcer);
  }

  private setupEventListeners(): void {
    document.addEventListener('astro:before-preparation', this.handleTransitionStart.bind(this));
    document.addEventListener('astro:after-swap', this.handleTransitionComplete.bind(this));
    document.addEventListener('astro:page-load', this.handlePageLoad.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));

    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.updatePreferences({ reducedMotion: e.matches });
    });
  }

  private handleTransitionStart(event: Event): void {
    this.isTransitioning = true;
    this.lastFocusedElement = document.activeElement as HTMLElement;

    if (this.preferences.screenReaderAnnouncements) {
      const detail = (event as CustomEvent).detail;
      const from = getFriendlyPageTitle(detail?.from?.pathname || '');
      const to = getFriendlyPageTitle(detail?.to?.pathname || '');
      this.announce({ message: formatNavigationAnnouncement(from, to), priority: 'polite' });
    }
  }

  private handleTransitionComplete(): void {
    this.isTransitioning = false;
    if (this.preferences.focusManagement) this.manageFocus();

    if (this.preferences.screenReaderAnnouncements) {
      this.announce({ message: formatLoadAnnouncement(document.title), priority: 'polite', delay: 100 });
    }
  }

  private handlePageLoad(): void {
    this.updateLandmarkTransitionNames();
    this.setupSkipLinks();
  }

  private manageFocus(): void {
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      setTimeout(() => main.removeAttribute('tabindex'), 100);
    } else {
      findFirstFocusable()?.focus();
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (event.ctrlKey && event.key === '/') this.skipToMainContent();
    if (event.altKey && event.key === 'ArrowLeft') window.history.back();
    if (event.altKey && event.key === 'ArrowRight') window.history.forward();
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') this.focusSearch();
    if (event.key === 'Tab' && this.isTransitioning) this.handleTabDuringTransition(event);
  }

  private skipToMainContent(): void {
    const main = document.getElementById('main-content');
    if (main) {
      main.setAttribute('tabindex', '-1');
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => main.removeAttribute('tabindex'), 100);
    }
  }

  private focusSearch(): void {
    const search = document.querySelector('input[type="search"], #search-input') as HTMLInputElement;
    if (search) {
      search.focus();
      this.announce({ message: 'Search focused', priority: 'polite' });
    } else {
      window.location.href = '/search';
    }
  }

  private handleTabDuringTransition(event: KeyboardEvent): void {
    const main = document.getElementById('main-content');
    if (!main) return;
    const first = findFirstFocusable(main);
    const last = Array.from(main.querySelectorAll('a, button, input, select, textarea')).pop() as HTMLElement;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }

  private setupSkipLinks(): void {
    document.querySelectorAll('.skip-link').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector((link as HTMLAnchorElement).getAttribute('href') || '');
        if (target) {
          (target as HTMLElement).focus();
          target.scrollIntoView({ behavior: 'smooth' });
          this.announce({ message: formatSkipAnnouncement(getSkipTargetName((link as HTMLAnchorElement).getAttribute('href') || '')), priority: 'polite' });
        }
      });
    });
  }

  private updateLandmarkTransitionNames(): void {
    const landmarks = { main: 'main-content', 'nav[aria-label="Main navigation"]': 'navigation', 'header[role="banner"]': 'header', 'footer[role="contentinfo"]': 'footer' };
    Object.entries(landmarks).forEach(([selector, name]) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) el.style.viewTransitionName = name;
    });
  }

  public announce(announcement: NavigationAnnouncement): void {
    if (!this.announcer || !this.preferences.screenReaderAnnouncements) return;
    const perform = () => {
      if (this.announcer) {
        this.announcer.setAttribute('aria-live', announcement.priority);
        this.announcer.textContent = announcement.message;
        setTimeout(() => { if (this.announcer) this.announcer.textContent = ''; }, 1000);
      }
    };
    announcement.delay ? setTimeout(perform, announcement.delay) : perform();
  }

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

  public updatePreferences(newPrefs: Partial<AccessibilityPreferences>): void {
    this.preferences = { ...this.preferences, ...newPrefs };
    localStorage.setItem('accessibility-preferences', JSON.stringify(this.preferences));
    this.applyReducedMotionPreferences();
  }

  public getPreferences(): AccessibilityPreferences { return { ...this.preferences }; }

  public destroy(): void {
    if (this.announcer) {
      document.body.removeChild(this.announcer);
      this.announcer = null;
    }
  }

  // Internal helpers for testing compatibility
  private getPageTitle(path: string) { return getFriendlyPageTitle(path); }
  private navigateBack() { window.history.back(); }
  private navigateForward() { window.history.forward(); }
  private getSkipTargetName(href: string) { return getSkipTargetName(href); }
}

export const accessibilityManager = new AccessibilityManager();
