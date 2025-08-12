/**
 * PWA Transition Integration
 * 
 * This utility integrates view transitions with PWA-specific behaviors:
 * - Service worker coordination
 * - Offline state handling
 * - App lifecycle events
 * - Native-like transition behaviors
 */

import { mobileTransitionOptimizer } from './mobileTransitionOptimizer';

export interface PWATransitionState {
  isOnline: boolean;
  isInstalled: boolean;
  serviceWorkerReady: boolean;
  hasUpdate: boolean;
  isBackground: boolean;
}

export interface ServiceWorkerTransitionData {
  fromUrl: string;
  toUrl: string;
  transitionType: string;
  timestamp: number;
  userAgent: string;
}

export class PWATransitionIntegration {
  private pwaState: PWATransitionState;
  private serviceWorkerRegistration: ServiceWorkerRegistration | null = null;
  private transitionQueue: ServiceWorkerTransitionData[] = [];
  private isInitialized = false;

  constructor() {
    this.pwaState = {
      isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
      isInstalled: this.detectPWAInstallation(),
      serviceWorkerReady: false,
      hasUpdate: false,
      isBackground: typeof document !== 'undefined' ? document.visibilityState === 'hidden' : false
    };
    
    this.initialize();
  }

  /**
   * Initialize PWA transition integration
   */
  private async initialize(): Promise<void> {
    if (typeof window === 'undefined' || this.isInitialized) {
      return;
    }

    // Set up service worker integration
    await this.setupServiceWorkerIntegration();
    
    // Set up online/offline handling
    this.setupNetworkHandling();
    
    // Set up app lifecycle handling
    this.setupAppLifecycleHandling();
    
    // Set up PWA-specific transition behaviors
    this.setupPWATransitionBehaviors();
    
    this.isInitialized = true;
  }

  /**
   * Detect if app is installed as PWA
   */
  private detectPWAInstallation(): boolean {
    // Handle server-side rendering
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return false;
    }

    return window.matchMedia('(display-mode: standalone)').matches ||
           (window.navigator as any).standalone === true ||
           (typeof document !== 'undefined' && document.referrer ? document.referrer.includes('android-app://') : false);
  }

  /**
   * Set up service worker integration
   */
  private async setupServiceWorkerIntegration(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      return;
    }

    try {
      // Get existing registration or wait for new one
      this.serviceWorkerRegistration = await navigator.serviceWorker.ready;
      this.pwaState.serviceWorkerReady = true;

      // Set up service worker message handling
      navigator.serviceWorker.addEventListener('message', this.handleServiceWorkerMessage.bind(this));

      // Set up update detection
      this.serviceWorkerRegistration.addEventListener('updatefound', () => {
        this.pwaState.hasUpdate = true;
        this.handleServiceWorkerUpdate();
      });

      // Listen for service worker state changes
      if (this.serviceWorkerRegistration.installing) {
        this.trackServiceWorkerState(this.serviceWorkerRegistration.installing);
      }

      if (this.serviceWorkerRegistration.waiting) {
        this.pwaState.hasUpdate = true;
      }

    } catch (error) {
      console.warn('Failed to set up service worker integration:', error);
    }
  }

  /**
   * Track service worker state changes
   */
  private trackServiceWorkerState(worker: ServiceWorker): void {
    worker.addEventListener('statechange', () => {
      if (worker.state === 'installed' && navigator.serviceWorker.controller) {
        this.pwaState.hasUpdate = true;
        this.handleServiceWorkerUpdate();
      }
    });
  }

  /**
   * Handle service worker messages
   */
  private handleServiceWorkerMessage(event: MessageEvent): void {
    const { type, data } = event.data;

    switch (type) {
      case 'TRANSITION_CACHE_READY':
        this.handleTransitionCacheReady(data);
        break;
      case 'OFFLINE_FALLBACK':
        this.handleOfflineFallback(data);
        break;
      case 'CACHE_UPDATE':
        this.handleCacheUpdate(data);
        break;
    }
  }

  /**
   * Handle service worker updates
   */
  private handleServiceWorkerUpdate(): void {
    // Optimize transitions during service worker updates
    const root = document.documentElement;
    root.setAttribute('data-sw-updating', 'true');

    // Dispatch custom event for components to handle
    window.dispatchEvent(new CustomEvent('pwa-update-available', {
      detail: { registration: this.serviceWorkerRegistration }
    }));

    // Remove attribute after update completes
    setTimeout(() => {
      root.removeAttribute('data-sw-updating');
    }, 2000);
  }

  /**
   * Set up network handling
   */
  private setupNetworkHandling(): void {
    const handleOnline = () => {
      this.pwaState.isOnline = true;
      this.handleNetworkStateChange(true);
    };

    const handleOffline = () => {
      this.pwaState.isOnline = false;
      this.handleNetworkStateChange(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
  }

  /**
   * Handle network state changes
   */
  private handleNetworkStateChange(isOnline: boolean): void {
    const root = document.documentElement;
    
    root.setAttribute('data-network-state', isOnline ? 'online' : 'offline');
    
    if (!isOnline) {
      // Optimize transitions for offline mode
      root.setAttribute('data-offline-mode', 'true');
      
      // Simplify transitions to conserve resources
      root.style.setProperty('--transition-duration-fast', '100ms');
      root.style.setProperty('--transition-duration-normal', '150ms');
      root.style.setProperty('--transition-duration-slow', '200ms');
    } else {
      root.removeAttribute('data-offline-mode');
      
      // Restore normal transition durations
      const optimizer = mobileTransitionOptimizer.getTransitionOptimization();
      root.style.setProperty('--transition-duration-normal', `${optimizer.recommendedDuration}ms`);
    }

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-network-change', {
      detail: { isOnline, timestamp: Date.now() }
    }));
  }

  /**
   * Set up app lifecycle handling
   */
  private setupAppLifecycleHandling(): void {
    // Handle visibility changes
    document.addEventListener('visibilitychange', () => {
      const isBackground = document.visibilityState === 'hidden';
      this.pwaState.isBackground = isBackground;
      
      this.handleAppStateChange(isBackground);
    });

    // Handle page focus/blur
    window.addEventListener('focus', () => {
      this.handleAppFocus();
    });

    window.addEventListener('blur', () => {
      this.handleAppBlur();
    });

    // Handle PWA install prompt
    window.addEventListener('beforeinstallprompt', (event) => {
      this.handleInstallPrompt(event as any);
    });

    // Handle app installed
    window.addEventListener('appinstalled', () => {
      this.pwaState.isInstalled = true;
      this.handleAppInstalled();
    });
  }

  /**
   * Handle app state changes (foreground/background)
   */
  private handleAppStateChange(isBackground: boolean): void {
    const root = document.documentElement;
    
    root.setAttribute('data-app-state', isBackground ? 'background' : 'foreground');
    
    if (isBackground) {
      // Pause or simplify transitions when app is in background
      root.setAttribute('data-transitions-paused', 'true');
    } else {
      // Resume normal transitions when app comes to foreground
      root.removeAttribute('data-transitions-paused');
      
      // Check for any queued transitions
      this.processQueuedTransitions();
    }
  }

  /**
   * Handle app focus
   */
  private handleAppFocus(): void {
    // Resume normal transition behavior
    const root = document.documentElement;
    root.removeAttribute('data-app-unfocused');
    
    // Process any queued service worker messages
    this.processQueuedTransitions();
  }

  /**
   * Handle app blur
   */
  private handleAppBlur(): void {
    // Optimize transitions when app loses focus
    const root = document.documentElement;
    root.setAttribute('data-app-unfocused', 'true');
  }

  /**
   * Handle install prompt
   */
  private handleInstallPrompt(event: BeforeInstallPromptEvent): void {
    // Store the event for later use
    (window as any).deferredPrompt = event;
    
    // Dispatch custom event for install UI
    window.dispatchEvent(new CustomEvent('pwa-install-available', {
      detail: { event }
    }));
  }

  /**
   * Handle app installed
   */
  private handleAppInstalled(): void {
    const root = document.documentElement;
    root.setAttribute('data-pwa-installed', 'true');
    
    // Apply PWA-specific transition optimizations
    const pwaSettings = mobileTransitionOptimizer.getPWATransitionSettings();
    root.style.setProperty('--transition-duration-normal', `${pwaSettings.duration}ms`);
    root.style.setProperty('--transition-easing-standard', pwaSettings.easing);
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('pwa-installed', {
      detail: { timestamp: Date.now() }
    }));
  }

  /**
   * Set up PWA-specific transition behaviors
   */
  private setupPWATransitionBehaviors(): void {
    // Hook into Astro transition events
    document.addEventListener('astro:before-preparation', (event) => {
      this.handleTransitionStart(event as CustomEvent);
    });

    document.addEventListener('astro:after-swap', (event) => {
      this.handleTransitionComplete(event as CustomEvent);
    });

    // Set up PWA-specific transition optimizations
    if (this.pwaState.isInstalled) {
      this.applyPWATransitionOptimizations();
    }
  }

  /**
   * Handle transition start
   */
  private handleTransitionStart(event: CustomEvent): void {
    const fromUrl = window.location.href;
    const toUrl = event.detail?.to?.href || fromUrl;
    
    // Queue transition data for service worker
    const transitionData: ServiceWorkerTransitionData = {
      fromUrl,
      toUrl,
      transitionType: this.detectTransitionType(fromUrl, toUrl),
      timestamp: Date.now(),
      userAgent: navigator.userAgent
    };
    
    this.transitionQueue.push(transitionData);
    
    // Send to service worker if available
    if (this.serviceWorkerRegistration?.active) {
      this.serviceWorkerRegistration.active.postMessage({
        type: 'TRANSITION_START',
        data: transitionData
      });
    }
    
    // Apply PWA-specific optimizations
    this.applyTransitionOptimizations(transitionData);
  }

  /**
   * Handle transition complete
   */
  private handleTransitionComplete(event: CustomEvent): void {
    const transitionData = this.transitionQueue.pop();
    
    if (transitionData && this.serviceWorkerRegistration?.active) {
      this.serviceWorkerRegistration.active.postMessage({
        type: 'TRANSITION_COMPLETE',
        data: {
          ...transitionData,
          completedAt: Date.now(),
          duration: Date.now() - transitionData.timestamp
        }
      });
    }
  }

  /**
   * Detect transition type based on URLs
   */
  private detectTransitionType(fromUrl: string, toUrl: string): string {
    const fromPath = new URL(fromUrl).pathname;
    const toPath = new URL(toUrl).pathname;
    
    if (fromPath === toPath) return 'refresh';
    if (toPath.includes(fromPath)) return 'drill-down';
    if (fromPath.includes(toPath)) return 'drill-up';
    
    return 'navigation';
  }

  /**
   * Apply PWA transition optimizations
   */
  private applyPWATransitionOptimizations(): void {
    const root = document.documentElement;
    
    // Apply PWA-specific CSS properties
    root.setAttribute('data-pwa', 'true');
    
    // Get optimized settings
    const pwaSettings = mobileTransitionOptimizer.getPWATransitionSettings();
    root.style.setProperty('--transition-duration-pwa', `${pwaSettings.duration}ms`);
    root.style.setProperty('--transition-easing-pwa', pwaSettings.easing);
  }

  /**
   * Apply transition optimizations based on transition data
   */
  private applyTransitionOptimizations(transitionData: ServiceWorkerTransitionData): void {
    const root = document.documentElement;
    
    // Apply network-aware optimizations
    if (!this.pwaState.isOnline) {
      root.setAttribute('data-offline-transition', 'true');
    }
    
    // Apply service worker state optimizations
    if (this.pwaState.hasUpdate) {
      root.setAttribute('data-sw-update-pending', 'true');
    }
    
    // Apply app state optimizations
    if (this.pwaState.isBackground) {
      root.setAttribute('data-background-transition', 'true');
    }
  }

  /**
   * Handle transition cache ready
   */
  private handleTransitionCacheReady(data: any): void {
    // Optimize transitions when cache is ready
    const root = document.documentElement;
    root.setAttribute('data-cache-ready', 'true');
  }

  /**
   * Handle offline fallback
   */
  private handleOfflineFallback(data: any): void {
    // Apply offline-specific transition optimizations
    const root = document.documentElement;
    root.setAttribute('data-offline-fallback', 'true');
    
    // Simplify transitions for offline content
    root.style.setProperty('--transition-duration-fast', '50ms');
    root.style.setProperty('--transition-duration-normal', '100ms');
  }

  /**
   * Handle cache update
   */
  private handleCacheUpdate(data: any): void {
    // Temporarily optimize transitions during cache updates
    const root = document.documentElement;
    root.setAttribute('data-cache-updating', 'true');
    
    setTimeout(() => {
      root.removeAttribute('data-cache-updating');
    }, 1000);
  }

  /**
   * Process queued transitions
   */
  private processQueuedTransitions(): void {
    if (this.transitionQueue.length > 0 && this.serviceWorkerRegistration?.active) {
      this.transitionQueue.forEach(transitionData => {
        this.serviceWorkerRegistration!.active!.postMessage({
          type: 'QUEUED_TRANSITION',
          data: transitionData
        });
      });
      
      this.transitionQueue = [];
    }
  }

  /**
   * Get current PWA state
   */
  public getPWAState(): PWATransitionState {
    return { ...this.pwaState };
  }

  /**
   * Check if PWA optimizations should be applied
   */
  public shouldApplyPWAOptimizations(): boolean {
    return this.pwaState.isInstalled && this.pwaState.serviceWorkerReady;
  }

  /**
   * Get PWA-specific transition settings
   */
  public getPWATransitionSettings(): { duration: number; easing: string; shouldOptimize: boolean } {
    const baseSettings = mobileTransitionOptimizer.getPWATransitionSettings();
    
    return {
      ...baseSettings,
      shouldOptimize: this.shouldApplyPWAOptimizations()
    };
  }

  /**
   * Trigger PWA install prompt
   */
  public async triggerInstallPrompt(): Promise<boolean> {
    const deferredPrompt = (window as any).deferredPrompt;
    
    if (!deferredPrompt) {
      return false;
    }

    try {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        this.pwaState.isInstalled = true;
        this.applyPWATransitionOptimizations();
      }
      
      (window as any).deferredPrompt = null;
      return outcome === 'accepted';
    } catch (error) {
      console.warn('Failed to trigger install prompt:', error);
      return false;
    }
  }

  /**
   * Cleanup
   */
  public destroy(): void {
    this.transitionQueue = [];
    this.isInitialized = false;
  }
}

// Create and export singleton instance
export const pwaTransitionIntegration = new PWATransitionIntegration();

export default PWATransitionIntegration;