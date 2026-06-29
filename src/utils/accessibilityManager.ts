import {
  getFriendlyPageTitle,
  formatNavigationAnnouncement,
  formatLoadAnnouncement,
  formatSkipAnnouncement
} from '../domain/accessibility/announcements.domain';
import { resolvePreferences } from '../domain/accessibility/preferences.domain';
import type { AccessibilityPreferences } from '../domain/accessibility/preferences.domain';
import { findFirstFocusable, getSkipTargetName } from '../domain/accessibility/focus.domain';
import { identifyIntent, UserIntent, getLandmarkMap } from '../domain/accessibility/shortcuts.domain';

export interface NavigationAnnouncement {
  message: string;
  priority: 'polite' | 'assertive';
  delay?: number;
}

export class AccessibilityManager {
  private preferences: AccessibilityPreferences;
  private announcer: HTMLElement | null = null;
  private isTransitioning = false;

  constructor() {
    this.preferences = this.initPreferences();
    this.init();
  }

  private initPreferences(): AccessibilityPreferences {
    const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('accessibility-preferences') : null;
    const systemReducedMotion = typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
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
    this.applyAnnouncerStyles(this.announcer);
    this.applyAnnouncerAria(this.announcer);
    document.body.appendChild(this.announcer);
  }

  private applyAnnouncerStyles(el: HTMLElement): void {
    Object.assign(el.style, {
      position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px',
      overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: '0'
    });
    el.className = 'sr-only';
    el.id = 'accessibility-announcer';
  }

  private applyAnnouncerAria(el: HTMLElement): void {
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('aria-atomic', 'true');
  }

  private setupEventListeners(): void {
    document.addEventListener('astro:before-preparation', this.handleTransitionStart.bind(this));
    document.addEventListener('astro:after-swap', this.handleTransitionComplete.bind(this));
    document.addEventListener('astro:page-load', this.handlePageLoad.bind(this));
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    this.observeReducedMotion();
  }

  private observeReducedMotion(): void {
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.updatePreferences({ reducedMotion: e.matches });
    });
  }

  private handleTransitionStart(event: Event): void {
    this.isTransitioning = true;
    if (this.preferences.screenReaderAnnouncements) this.announceNavigation(event);
  }

  private announceNavigation(event: Event): void {
    const detail = (event as CustomEvent).detail;
    const from = getFriendlyPageTitle(detail?.from?.pathname || '');
    const to = getFriendlyPageTitle(detail?.to?.pathname || '');
    this.announce({ message: formatNavigationAnnouncement(from, to), priority: 'polite' });
  }

  private handleTransitionComplete(): void {
    this.isTransitioning = false;
    if (this.preferences.focusManagement) this.manageFocus();
    if (this.preferences.screenReaderAnnouncements) this.announceLoad();
  }

  private announceLoad(): void {
    this.announce({ message: formatLoadAnnouncement(document.title), priority: 'polite', delay: 100 });
  }

  private handlePageLoad(): void {
    this.updateLandmarkTransitionNames();
    this.setupSkipLinks();
  }

  private manageFocus(): void {
    const main = document.getElementById('main-content');
    main ? this.focusAndReset(main) : findFirstFocusable(document, window)?.focus();
  }

  private focusAndReset(el: HTMLElement): void {
    el.setAttribute('tabindex', '-1');
    el.focus();
    setTimeout(() => el.removeAttribute('tabindex'), 100);
  }

  private handleKeyDown(event: KeyboardEvent): void {
    const intent = identifyIntent(event);
    this.executeIntent(intent, event);
    if (event.key === 'Tab' && this.isTransitioning) this.handleTabDuringTransition(event);
  }

  private executeIntent(intent: UserIntent, event: KeyboardEvent): void {
    const actions: Record<UserIntent, () => void> = {
      [UserIntent.SKIP_TO_CONTENT]: () => this.skipToMainContent(),
      [UserIntent.GO_BACK]: () => window.history.back(),
      [UserIntent.GO_FORWARD]: () => window.history.forward(),
      [UserIntent.FOCUS_SEARCH]: () => this.focusSearch(),
      [UserIntent.NONE]: () => {}
    };
    actions[intent]();
  }

  private skipToMainContent(): void {
    const main = document.getElementById('main-content');
    if (main) {
      this.focusAndReset(main);
      main.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private focusSearch(): void {
    const search = document.querySelector('input[type="search"], #search-input') as HTMLInputElement;
    search ? search.focus() : (window.location.href = '/search');
  }

  private handleTabDuringTransition(event: KeyboardEvent): void {
    const main = document.getElementById('main-content');
    if (!main) return;
    const first = findFirstFocusable(main, window);
    const last = Array.from(main.querySelectorAll('a, button, input, select, textarea')).pop() as HTMLElement;
    this.trapFocus(event, first, last);
  }

  private trapFocus(event: KeyboardEvent, first: HTMLElement | null, last: HTMLElement | null): void {
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first?.focus();
    }
  }

  private setupSkipLinks(): void {
    document.querySelectorAll('.skip-link').forEach(link => {
      link.addEventListener('click', (e) => this.handleSkipLinkClick(e, link as HTMLAnchorElement));
    });
  }

  private handleSkipLinkClick(e: Event, link: HTMLAnchorElement): void {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href') || '');
    if (target) {
      this.focusAndReset(target as HTMLElement);
      target.scrollIntoView({ behavior: 'smooth' });
      this.announceSkip(link.getAttribute('href') || '');
    }
  }

  private announceSkip(href: string): void {
    const name = getSkipTargetName(href);
    this.announce({ message: formatSkipAnnouncement(name), priority: 'polite' });
  }

  private updateLandmarkTransitionNames(): void {
    Object.entries(getLandmarkMap()).forEach(([name, selector]) => {
      const el = document.querySelector<HTMLElement>(selector);
      if (el) el.style.viewTransitionName = name;
    });
  }

  public announce(announcement: NavigationAnnouncement): void {
    if (!this.announcer || !this.preferences.screenReaderAnnouncements) return;
    const perform = () => {
      if (!this.announcer) return;
      this.announcer.setAttribute('aria-live', announcement.priority);
      this.announcer.textContent = announcement.message;
      setTimeout(() => { if (this.announcer) this.announcer.textContent = ''; }, 1000);
    };
    announcement.delay ? setTimeout(perform, announcement.delay) : perform();
  }

  private applyReducedMotionPreferences(): void {
    const root = document.documentElement;
    this.preferences.reducedMotion ? this.setReducedMotion(root) : this.clearReducedMotion(root);
  }

  private setReducedMotion(root: HTMLElement): void {
    root.setAttribute('data-reduced-motion', 'true');
    ['fast', 'normal', 'slow'].forEach(s => root.style.setProperty(`--transition-duration-${s}`, '0ms'));
  }

  private clearReducedMotion(root: HTMLElement): void {
    root.removeAttribute('data-reduced-motion');
    ['fast', 'normal', 'slow'].forEach(s => root.style.removeProperty(`--transition-duration-${s}`));
  }

  public updatePreferences(newPrefs: Partial<AccessibilityPreferences>): void {
    this.preferences = { ...this.preferences, ...newPrefs };
    localStorage.setItem('accessibility-preferences', JSON.stringify(this.preferences));
    this.applyReducedMotionPreferences();
  }

  public getPreferences(): AccessibilityPreferences { return { ...this.preferences }; }

  public destroy(): void {
    if (this.announcer) document.body.removeChild(this.announcer);
    this.announcer = null;
  }

  // Internal helpers for testing compatibility
  private getPageTitle(path: string) { return getFriendlyPageTitle(path); }
  private navigateBack() { window.history.back(); }
  private navigateForward() { window.history.forward(); }
  private getSkipTargetName(href: string) { return getSkipTargetName(href); }
}

export const accessibilityManager = new AccessibilityManager();
