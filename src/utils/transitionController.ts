/**
 * TransitionController - Manages view transitions with navigation context detection
 * 
 * This controller provides:
 * - Navigation context detection (forward/backward/refresh)
 * - Page relationship analysis (parent-child, sibling, unrelated)
 * - Integration with Astro's transition events
 * - Performance monitoring and fallback mechanisms
 * - Mobile and PWA optimizations
 */

import { mobileTransitionOptimizer } from './mobileTransitionOptimizer';
import { pwaTransitionIntegration } from './pwaTransitionIntegration';
import { performanceMonitor } from './performanceMonitor';
import type { PerformanceMetrics, TransitionPerformanceData } from './performanceMonitor';
import { transitionPreferences } from './transitionPreferences';
import { transitionErrorHandler } from './transitionErrorHandler';

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
  UNKNOWN = 'unknown'
}

export enum NavigationDirection {
  FORWARD = 'forward',
  BACKWARD = 'backward',
  REFRESH = 'refresh'
}

export enum PageRelationship {
  SIBLING = 'sibling',        // Same level (blog post to blog post)
  PARENT_CHILD = 'parent-child', // List to detail
  CHILD_PARENT = 'child-parent', // Detail to list
  UNRELATED = 'unrelated',    // Different sections
  CONTEXTUAL = 'contextual'   // Related but different type
}

export interface NavigationContext {
  direction: NavigationDirection;
  fromPageType: PageType;
  toPageType: PageType;
  relationship: PageRelationship;
  fromPath: string;
  toPath: string;
  timestamp: number;
}

export interface TransitionOptions {
  duration?: number;
  easing?: string;
  respectReducedMotion?: boolean;
  fallbackEnabled?: boolean;
}

export interface TransitionMetrics {
  averageDuration: number;
  failureRate: number;
  totalTransitions: number;
  lastTransitionTime: number;
}

export interface UserAgentInfo {
  isMobile: boolean;
  isLowPowerMode: boolean;
  prefersReducedMotion: boolean;
  connectionType?: string;
}

export class TransitionController {
  private navigationHistory: string[] = [];
  private currentPath: string = '';
  private metrics: TransitionMetrics = {
    averageDuration: 0,
    failureRate: 0,
    totalTransitions: 0,
    lastTransitionTime: 0
  };
  private isInitialized: boolean = false;
  private transitionInProgress: boolean = false;

  constructor() {
    this.initialize();
  }

  /**
   * Initialize the transition controller and set up event listeners
   */
  private initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) {
      return;
    }

    this.currentPath = window.location.pathname;
    this.navigationHistory = [this.currentPath];

    // Hook into Astro's transition events
    document.addEventListener('astro:before-preparation', this.handleBeforePreparation.bind(this));
    document.addEventListener('astro:after-swap', this.handleAfterSwap.bind(this));
    document.addEventListener('astro:page-load', this.handlePageLoad.bind(this));

    // Listen for browser navigation events
    window.addEventListener('popstate', this.handlePopState.bind(this));

    this.isInitialized = true;
  }

  /**
   * Detect navigation context based on current and target paths
   */
  public detectNavigationContext(fromPath: string, toPath: string): NavigationContext {
    const direction = this.detectNavigationDirection(fromPath, toPath);
    const fromPageType = this.classifyPageType(fromPath);
    const toPageType = this.classifyPageType(toPath);
    const relationship = this.analyzePageRelationship(fromPageType, toPageType, fromPath, toPath);

    return {
      direction,
      fromPageType,
      toPageType,
      relationship,
      fromPath,
      toPath,
      timestamp: Date.now()
    };
  }

  /**
   * Detect navigation direction based on browser history and path analysis
   */
  private detectNavigationDirection(fromPath: string, toPath: string): NavigationDirection {
    // Check if this is a refresh (same path)
    if (fromPath === toPath) {
      return NavigationDirection.REFRESH;
    }

    // Check navigation history to determine direction
    const fromIndex = this.navigationHistory.lastIndexOf(fromPath);
    const toIndex = this.navigationHistory.lastIndexOf(toPath);

    // If target path exists in history after current path, it's likely backward navigation
    if (toIndex !== -1 && toIndex < fromIndex) {
      return NavigationDirection.BACKWARD;
    }

    // Check for typical backward navigation patterns
    if (this.isBackwardNavigation(fromPath, toPath)) {
      return NavigationDirection.BACKWARD;
    }

    // Default to forward navigation
    return NavigationDirection.FORWARD;
  }

  /**
   * Determine if navigation is backward based on path patterns
   */
  private isBackwardNavigation(fromPath: string, toPath: string): boolean {
    // Detail to list navigation (e.g., /blog/post-title -> /blog)
    if (fromPath.includes(toPath) && fromPath !== toPath) {
      return true;
    }

    // Category to main navigation (e.g., /tools/category -> /tools)
    if (fromPath.startsWith(toPath) && fromPath.split('/').length > toPath.split('/').length) {
      return true;
    }

    // Common backward patterns
    const backwardPatterns = [
      { from: /^\/blog\/[\w-]+/, to: /^\/blog\/?$/ },
      { from: /^\/tools\/[\w-]+/, to: /^\/tools\/?$/ },
      { from: /^\/search\/results/, to: /^\/search\/?$/ }
    ];

    return backwardPatterns.some(pattern => 
      pattern.from.test(fromPath) && pattern.to.test(toPath)
    );
  }

  /**
   * Classify page type based on URL path
   */
  private classifyPageType(path: string): PageType {
    // Remove trailing slash and query parameters
    const cleanPath = path.replace(/\/$/, '') || '/';

    // Home page
    if (cleanPath === '' || cleanPath === '/') {
      return PageType.HOME;
    }

    // Blog pages
    if (cleanPath === '/blog') {
      return PageType.BLOG_LIST;
    }
    if (cleanPath.startsWith('/blog/') && cleanPath !== '/blog') {
      return PageType.BLOG_POST;
    }

    // Tools pages
    if (cleanPath === '/tools') {
      return PageType.TOOLS_LIST;
    }
    if (cleanPath.startsWith('/tools/') && cleanPath !== '/tools') {
      return PageType.TOOLS_CATEGORY;
    }

    // Search pages
    if (cleanPath.startsWith('/search')) {
      return PageType.SEARCH;
    }

    // Static pages
    if (cleanPath === '/about') {
      return PageType.ABOUT;
    }
    if (cleanPath === '/contact') {
      return PageType.CONTACT;
    }
    if (cleanPath === '/offline') {
      return PageType.OFFLINE;
    }

    return PageType.UNKNOWN;
  }

  /**
   * Analyze relationship between two page types
   */
  private analyzePageRelationship(
    fromType: PageType, 
    toType: PageType, 
    fromPath: string, 
    toPath: string
  ): PageRelationship {
    // Same page type - sibling relationship
    if (fromType === toType) {
      return PageRelationship.SIBLING;
    }

    // Parent-child relationships
    const parentChildPairs = [
      [PageType.BLOG_LIST, PageType.BLOG_POST],
      [PageType.TOOLS_LIST, PageType.TOOLS_CATEGORY],
      [PageType.HOME, PageType.BLOG_LIST],
      [PageType.HOME, PageType.TOOLS_LIST]
    ];

    // Check for parent to child
    if (parentChildPairs.some(([parent, child]) => fromType === parent && toType === child)) {
      return PageRelationship.PARENT_CHILD;
    }

    // Check for child to parent
    if (parentChildPairs.some(([parent, child]) => fromType === child && toType === parent)) {
      return PageRelationship.CHILD_PARENT;
    }

    // Contextual relationships (related sections)
    const contextualPairs = [
      [PageType.BLOG_LIST, PageType.SEARCH],
      [PageType.TOOLS_LIST, PageType.SEARCH],
      [PageType.HOME, PageType.ABOUT],
      [PageType.HOME, PageType.CONTACT]
    ];

    if (contextualPairs.some(([type1, type2]) => 
      (fromType === type1 && toType === type2) || (fromType === type2 && toType === type1)
    )) {
      return PageRelationship.CONTEXTUAL;
    }

    // Default to unrelated
    return PageRelationship.UNRELATED;
  }

  /**
   * Get user agent information for transition optimization
   */
  private getUserAgentInfo(): UserAgentInfo {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    // Check for low power mode (approximation)
    const isLowPowerMode = navigator.hardwareConcurrency <= 2 || prefersReducedMotion;
    
    // Get connection type if available
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const connectionType = connection?.effectiveType || 'unknown';

    return {
      isMobile,
      isLowPowerMode,
      prefersReducedMotion,
      connectionType
    };
  }

  /**
   * Handle Astro's before-preparation event
   */
  private handleBeforePreparation(event: Event): void {
    const customEvent = event as CustomEvent;
    const toPath = customEvent.detail?.to?.pathname || window.location.pathname;
    
    if (this.transitionInProgress) {
      return;
    }

    this.transitionInProgress = true;
    const fromPath = this.currentPath;

    // Check for View Transition API support and handle gracefully
    try {
      if (!this.isTransitionSupported()) {
        // Let error handler manage fallback
        console.warn('View Transition API not supported, using fallback');
      }
    
    // Detect navigation context
    const context = this.detectNavigationContext(fromPath, toPath);
    
    // Start performance monitoring
    performanceMonitor.startMonitoring(this.getTransitionContextName(context));
    
    // Apply mobile and PWA optimizations
    this.applyMobileOptimizations(context);
    
    // Apply transition context to document
    this.applyTransitionContext(context);
    
    // Apply user preferences
    this.applyUserPreferences();
    
    // Apply performance-based optimizations
    this.applyPerformanceOptimizations();
    
    // Update metrics
    this.updateMetrics(context);
    } catch (error) {
      // Handle preparation errors gracefully
      console.error('Error during transition preparation:', error);
      this.transitionInProgress = false;
    }
  }

  /**
   * Handle Astro's after-swap event
   */
  private handleAfterSwap(event: Event): void {
    try {
      const customEvent = event as CustomEvent;
      const newPath = customEvent.detail?.newDocument?.location?.pathname || window.location.pathname;
      
      // Stop performance monitoring and get results
      const performanceData = performanceMonitor.stopMonitoring();
      
      // Update navigation history
      this.updateNavigationHistory(newPath);
      this.currentPath = newPath;
      this.transitionInProgress = false;
      
      // Update performance metrics if available
      if (performanceData) {
        this.updatePerformanceMetrics(performanceData);
      }
    } catch (error) {
      // Handle after-swap errors gracefully
      console.error('Error during transition after-swap:', error);
      this.transitionInProgress = false;
    }
  }

  /**
   * Handle Astro's page-load event
   */
  private handlePageLoad(event: Event): void {
    // Reset transition state on page load
    this.transitionInProgress = false;
  }

  /**
   * Handle browser popstate event (back/forward buttons)
   */
  private handlePopState(event: PopStateEvent): void {
    const newPath = window.location.pathname;
    
    // This is definitely backward navigation
    const context = this.detectNavigationContext(this.currentPath, newPath);
    context.direction = NavigationDirection.BACKWARD;
    
    this.applyTransitionContext(context);
    this.updateNavigationHistory(newPath);
    this.currentPath = newPath;
  }

  /**
   * Apply mobile and PWA optimizations
   */
  private applyMobileOptimizations(context: NavigationContext): void {
    // Get mobile optimization recommendations
    const optimization = mobileTransitionOptimizer.getTransitionOptimization();
    const pwaSettings = pwaTransitionIntegration.getPWATransitionSettings();
    
    const root = document.documentElement;
    
    // Apply optimization recommendations
    if (optimization.shouldOptimize) {
      root.style.setProperty('--transition-duration-optimized', `${optimization.recommendedDuration}ms`);
      root.style.setProperty('--transition-easing-optimized', optimization.recommendedEasing);
      root.setAttribute('data-transition-optimized', optimization.optimizationType);
    }
    
    // Apply PWA-specific settings
    if (pwaSettings.shouldOptimize) {
      root.style.setProperty('--transition-duration-pwa', `${pwaSettings.duration}ms`);
      root.style.setProperty('--transition-easing-pwa', pwaSettings.easing);
    }
    
    // Apply device capabilities
    const deviceCapabilities = mobileTransitionOptimizer.getDeviceCapabilities();
    const networkCondition = mobileTransitionOptimizer.getNetworkCondition();
    
    // Set device-specific attributes
    root.setAttribute('data-device-mobile', deviceCapabilities.isMobile.toString());
    root.setAttribute('data-device-tablet', deviceCapabilities.isTablet.toString());
    root.setAttribute('data-device-pwa', deviceCapabilities.isPWA.toString());
    root.setAttribute('data-device-orientation', deviceCapabilities.orientation);
    
    // Set network-specific attributes
    root.setAttribute('data-network-type', networkCondition.effectiveType);
    root.setAttribute('data-network-save-data', networkCondition.saveData.toString());
    
    // Set battery-specific attributes
    if (deviceCapabilities.batteryLevel !== undefined) {
      root.setAttribute('data-battery-level', Math.round(deviceCapabilities.batteryLevel * 100).toString());
    }
    root.setAttribute('data-battery-low', deviceCapabilities.isLowBattery.toString());
  }

  /**
   * Apply transition context to the document for CSS targeting
   */
  private applyTransitionContext(context: NavigationContext): void {
    const root = document.documentElement;
    
    // Set data attributes for CSS targeting
    root.setAttribute('data-transition-direction', context.direction);
    root.setAttribute('data-transition-from-type', context.fromPageType);
    root.setAttribute('data-transition-to-type', context.toPageType);
    root.setAttribute('data-transition-relationship', context.relationship);
    
    // Set transition context for backward compatibility
    root.setAttribute('data-transition-context', this.getTransitionContextName(context));
    
    // Apply user agent optimizations
    const userAgent = this.getUserAgentInfo();
    if (userAgent.prefersReducedMotion) {
      root.setAttribute('data-reduced-motion', 'true');
    }
    if (userAgent.isLowPowerMode) {
      root.setAttribute('data-low-power', 'true');
    }
  }

  /**
   * Get a simplified transition context name for CSS targeting
   */
  private getTransitionContextName(context: NavigationContext): string {
    if (context.direction === NavigationDirection.BACKWARD) {
      return 'backward';
    }
    
    switch (context.relationship) {
      case PageRelationship.PARENT_CHILD:
        return 'drill-down';
      case PageRelationship.CHILD_PARENT:
        return 'drill-up';
      case PageRelationship.SIBLING:
        return 'sibling';
      case PageRelationship.CONTEXTUAL:
        return 'contextual';
      default:
        return 'forward';
    }
  }

  /**
   * Update navigation history
   */
  private updateNavigationHistory(path: string): void {
    // Limit history size to prevent memory issues
    const MAX_HISTORY_SIZE = 50;
    
    this.navigationHistory.push(path);
    
    if (this.navigationHistory.length > MAX_HISTORY_SIZE) {
      this.navigationHistory = this.navigationHistory.slice(-MAX_HISTORY_SIZE);
    }
  }

  /**
   * Update transition metrics
   */
  private updateMetrics(context: NavigationContext): void {
    this.metrics.totalTransitions++;
    this.metrics.lastTransitionTime = context.timestamp;
    
    // Calculate average duration (simplified - would need actual timing in real implementation)
    const estimatedDuration = this.estimateTransitionDuration(context);
    this.metrics.averageDuration = 
      (this.metrics.averageDuration * (this.metrics.totalTransitions - 1) + estimatedDuration) / 
      this.metrics.totalTransitions;
  }

  /**
   * Estimate transition duration based on context
   */
  private estimateTransitionDuration(context: NavigationContext): number {
    const userAgent = this.getUserAgentInfo();
    
    // Base duration
    let duration = 300;
    
    // Adjust for device capabilities
    if (userAgent.isLowPowerMode) {
      duration *= 0.7;
    }
    
    // Adjust for relationship complexity
    switch (context.relationship) {
      case PageRelationship.SIBLING:
        duration *= 0.8;
        break;
      case PageRelationship.PARENT_CHILD:
      case PageRelationship.CHILD_PARENT:
        duration *= 1.2;
        break;
      default:
        break;
    }
    
    return duration;
  }

  /**
   * Get current transition metrics
   */
  public getMetrics(): TransitionMetrics {
    return { ...this.metrics };
  }

  /**
   * Get current navigation context
   */
  public getCurrentContext(): NavigationContext | null {
    if (this.navigationHistory.length < 2) {
      return null;
    }
    
    const currentPath = this.navigationHistory[this.navigationHistory.length - 1];
    const previousPath = this.navigationHistory[this.navigationHistory.length - 2];
    
    return this.detectNavigationContext(previousPath, currentPath);
  }

  /**
   * Check if transitions are supported
   */
  public isTransitionSupported(): boolean {
    return typeof document !== 'undefined' && 'startViewTransition' in document;
  }

  /**
   * Apply user preferences to transitions
   */
  private applyUserPreferences(): void {
    const preferences = transitionPreferences.getPreferences();
    const effectiveIntensity = transitionPreferences.getEffectiveIntensity();
    const root = document.documentElement;
    
    // Apply transition intensity
    root.setAttribute('data-transition-intensity', effectiveIntensity);
    
    // Apply custom duration if set
    if (preferences.customDuration) {
      root.style.setProperty('--transition-duration-custom', `${preferences.customDuration}ms`);
    }
    
    // Apply debug mode
    if (preferences.debugMode) {
      root.setAttribute('data-debug-transitions', 'true');
    }
    
    // Apply sound effects and haptic feedback indicators
    root.setAttribute('data-sound-effects', preferences.enableSoundEffects.toString());
    root.setAttribute('data-haptic-feedback', preferences.enableHapticFeedback.toString());
    
    // Trigger sound effect if enabled
    if (preferences.enableSoundEffects) {
      this.triggerSoundEffect();
    }
    
    // Trigger haptic feedback if enabled
    if (preferences.enableHapticFeedback) {
      this.triggerHapticFeedback();
    }
  }

  /**
   * Apply performance-based optimizations
   */
  private applyPerformanceOptimizations(): void {
    const currentMetrics = performanceMonitor.getCurrentMetrics();
    const root = document.documentElement;
    
    // Set performance monitoring attributes
    root.setAttribute('data-performance-monitoring', 'true');
    root.setAttribute('data-current-fps', currentMetrics.frameRate.toString());
    
    // Apply device capability attributes
    const deviceCapabilities = this.getUserAgentInfo();
    root.setAttribute('data-cpu-cores', navigator.hardwareConcurrency.toString());
    
    if (deviceCapabilities.isLowPowerMode) {
      root.setAttribute('data-performance-mode', 'low');
    } else if (currentMetrics.frameRate >= 55 && navigator.hardwareConcurrency >= 8) {
      root.setAttribute('data-performance-mode', 'high');
    } else {
      root.setAttribute('data-performance-mode', 'normal');
    }
    
    // Apply memory usage if available
    if (currentMetrics.memoryUsage !== undefined) {
      const memoryLevel = currentMetrics.memoryUsage > 0.8 ? 'high' : 
                         currentMetrics.memoryUsage > 0.6 ? 'medium' : 'low';
      root.setAttribute('data-memory-usage', memoryLevel);
      
      if (currentMetrics.memoryUsage > 0.8) {
        root.setAttribute('data-low-memory', 'true');
      }
    }
    
    // Apply battery level if available
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        root.setAttribute('data-battery-level', Math.round(battery.level * 100).toString());
        root.setAttribute('data-battery-low', (battery.level < 0.2).toString());
      }).catch(() => {
        // Battery API not available or failed
      });
    }
  }

  /**
   * Update performance metrics from monitoring data
   */
  private updatePerformanceMetrics(performanceData: TransitionPerformanceData): void {
    // Update internal metrics with actual performance data
    this.metrics.averageDuration = 
      (this.metrics.averageDuration * (this.metrics.totalTransitions - 1) + 
       (performanceData.endTime - performanceData.startTime)) / 
      this.metrics.totalTransitions;
    
    // Calculate failure rate based on performance thresholds
    const isFailure = performanceData.averageFrameRate < 30 || 
                     performanceData.droppedFrames > 5;
    
    if (isFailure) {
      this.metrics.failureRate = 
        (this.metrics.failureRate * (this.metrics.totalTransitions - 1) + 1) / 
        this.metrics.totalTransitions;
    } else {
      this.metrics.failureRate = 
        (this.metrics.failureRate * (this.metrics.totalTransitions - 1)) / 
        this.metrics.totalTransitions;
    }
  }

  /**
   * Trigger sound effect for transition
   */
  private triggerSoundEffect(): void {
    // Simple sound effect using Web Audio API or HTML5 Audio
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
    } catch (error) {
      // Fallback or ignore if Web Audio API is not available
      console.debug('Sound effect not available:', error);
    }
  }

  /**
   * Trigger haptic feedback for transition
   */
  private triggerHapticFeedback(): void {
    // Use Vibration API if available
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([10, 5, 10]); // Short vibration pattern
      } catch (error) {
        console.debug('Haptic feedback not available:', error);
      }
    }
  }

  /**
   * Get enhanced performance metrics
   */
  public getEnhancedMetrics(): TransitionMetrics & { performanceData?: PerformanceMetrics } {
    const baseMetrics = this.getMetrics();
    const performanceData = performanceMonitor.getCurrentMetrics();
    
    return {
      ...baseMetrics,
      performanceData
    };
  }

  /**
   * Cleanup event listeners
   */
  public destroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('astro:before-preparation', this.handleBeforePreparation.bind(this));
      document.removeEventListener('astro:after-swap', this.handleAfterSwap.bind(this));
      document.removeEventListener('astro:page-load', this.handlePageLoad.bind(this));
    }
    
    if (typeof window !== 'undefined') {
      window.removeEventListener('popstate', this.handlePopState.bind(this));
    }
    
    // Cleanup performance monitoring
    performanceMonitor.destroy();
    transitionPreferences.destroy();
    
    this.isInitialized = false;
  }
}

// Create and export a singleton instance
export const transitionController = new TransitionController();

// Export for testing and advanced usage
export default TransitionController;
