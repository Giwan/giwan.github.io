/**
 * TransitionController - Manages view transitions with navigation context detection
 * Refactored to use Narrative Domain logic.
 */

import { mobileTransitionOptimizer } from './mobileTransitionOptimizer';
import { pwaTransitionIntegration } from './pwaTransitionIntegration';
import { performanceMonitor } from './performanceMonitor';
import type { TransitionPerformanceData, PerformanceMetrics } from './performanceMonitor';
import { transitionPreferences } from './transitionPreferences';
import {
  PageType,
  NavigationDirection
} from '../domain/transitions/navigation.domain';
import { PageRelationship } from '../domain/transitions/relationship.domain';
import {
  createNavigationContext,
  NavigationContext
} from '../domain/transitions/context.domain';
import {
  getTransitionContextName,
  estimateTransitionDuration
} from '../domain/transitions/optimization.domain';

export { PageType, NavigationDirection, PageRelationship };
export type { NavigationContext };

export interface UserAgentInfo {
  isMobile: boolean;
  isLowPowerMode: boolean;
  prefersReducedMotion: boolean;
  connectionType?: string;
}

export interface TransitionMetrics {
  averageDuration: number;
  failureRate: number;
  totalTransitions: number;
  lastTransitionTime: number;
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

  private initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;

    this.currentPath = window.location.pathname;
    this.navigationHistory = [this.currentPath];

    document.addEventListener('astro:before-preparation', this.handleBeforePreparation.bind(this));
    document.addEventListener('astro:after-swap', this.handleAfterSwap.bind(this));
    document.addEventListener('astro:page-load', this.handlePageLoad.bind(this));
    window.addEventListener('popstate', this.handlePopState.bind(this));

    this.isInitialized = true;
  }

  private handleBeforePreparation(event: Event): void {
    const customEvent = event as CustomEvent;
    const toPath = customEvent.detail?.to?.pathname || window.location.pathname;

    if (this.transitionInProgress) return;
    this.transitionInProgress = true;

    const context = createNavigationContext(this.currentPath, toPath, this.navigationHistory);

    this.startTransitionPreparation(context);
  }

  private startTransitionPreparation(context: NavigationContext): void {
    performanceMonitor.startMonitoring(getTransitionContextName(context.direction, context.relationship));
    this.applyMobileOptimizations(context);
    this.applyTransitionContext(context);
    this.applyUserPreferences();
    this.applyPerformanceOptimizations();
    this.updateMetrics(context);
  }

  private handleAfterSwap(event: Event): void {
    const customEvent = event as CustomEvent;
    const newPath = customEvent.detail?.newDocument?.location?.pathname || window.location.pathname;
    const performanceData = performanceMonitor.stopMonitoring();

    this.updateNavigationHistory(newPath);
    this.currentPath = newPath;
    this.transitionInProgress = false;

    if (performanceData) this.updatePerformanceMetrics(performanceData);
  }

  private handlePageLoad(): void {
    this.transitionInProgress = false;
  }

  private handlePopState(): void {
    const newPath = window.location.pathname;
    const context = createNavigationContext(this.currentPath, newPath, this.navigationHistory);
    context.direction = NavigationDirection.BACKWARD;

    this.applyTransitionContext(context);
    this.updateNavigationHistory(newPath);
    this.currentPath = newPath;
  }

  private applyMobileOptimizations(context: NavigationContext): void {
    const optimization = mobileTransitionOptimizer.getTransitionOptimization();
    const pwaSettings = pwaTransitionIntegration.getPWATransitionSettings();
    const root = document.documentElement;

    if (optimization.shouldOptimize) {
      root.style.setProperty('--transition-duration-optimized', `${optimization.recommendedDuration}ms`);
      root.style.setProperty('--transition-easing-optimized', optimization.recommendedEasing);
      root.setAttribute('data-transition-optimized', optimization.optimizationType);
    }

    if (pwaSettings.shouldOptimize) {
      root.style.setProperty('--transition-duration-pwa', `${pwaSettings.duration}ms`);
      root.style.setProperty('--transition-easing-pwa', pwaSettings.easing);
    }

    this.applyDeviceStateAttributes(root);
  }

  private applyDeviceStateAttributes(root: HTMLElement): void {
    const caps = mobileTransitionOptimizer.getDeviceCapabilities();
    const net = mobileTransitionOptimizer.getNetworkCondition();

    root.setAttribute('data-device-mobile', caps.isMobile.toString());
    root.setAttribute('data-device-tablet', caps.isTablet.toString());
    root.setAttribute('data-device-pwa', caps.isPWA.toString());
    root.setAttribute('data-device-orientation', caps.orientation);
    root.setAttribute('data-network-type', net.effectiveType);
    root.setAttribute('data-network-save-data', net.saveData.toString());

    if (caps.batteryLevel !== undefined) {
      root.setAttribute('data-battery-level', Math.round(caps.batteryLevel * 100).toString());
    }
    root.setAttribute('data-battery-low', caps.isLowBattery.toString());
  }

  private applyTransitionContext(context: NavigationContext): void {
    const root = document.documentElement;
    root.setAttribute('data-transition-direction', context.direction);
    root.setAttribute('data-transition-from-type', context.fromPageType);
    root.setAttribute('data-transition-to-type', context.toPageType);
    root.setAttribute('data-transition-relationship', context.relationship);
    root.setAttribute('data-transition-context', getTransitionContextName(context.direction, context.relationship));

    const ua = this.getUserAgentInfo();
    if (ua.prefersReducedMotion) root.setAttribute('data-reduced-motion', 'true');
    if (ua.isLowPowerMode) root.setAttribute('data-low-power', 'true');
  }

  private applyUserPreferences(): void {
    const preferences = transitionPreferences.getPreferences();
    const intensity = transitionPreferences.getEffectiveIntensity();
    const root = document.documentElement;

    root.setAttribute('data-transition-intensity', intensity);
    if (preferences.customDuration) {
      root.style.setProperty('--transition-duration-custom', `${preferences.customDuration}ms`);
    }
    root.setAttribute('data-debug-transitions', preferences.debugMode.toString());
    root.setAttribute('data-sound-effects', preferences.enableSoundEffects.toString());
    root.setAttribute('data-haptic-feedback', preferences.enableHapticFeedback.toString());

    if (preferences.enableSoundEffects) this.triggerSoundEffect();
    if (preferences.enableHapticFeedback) this.triggerHapticFeedback();
  }

  private applyPerformanceOptimizations(): void {
    const metrics = performanceMonitor.getCurrentMetrics();
    const root = document.documentElement;
    const ua = this.getUserAgentInfo();

    root.setAttribute('data-performance-monitoring', 'true');
    root.setAttribute('data-current-fps', metrics.frameRate.toString());
    root.setAttribute('data-cpu-cores', navigator.hardwareConcurrency.toString());

    this.setPerformanceMode(root, metrics, ua);
    this.setMemoryStatus(root, metrics);
  }

  private setPerformanceMode(root: HTMLElement, metrics: any, ua: UserAgentInfo): void {
    if (ua.isLowPowerMode) {
      root.setAttribute('data-performance-mode', 'low');
    } else if (metrics.frameRate >= 55 && navigator.hardwareConcurrency >= 8) {
      root.setAttribute('data-performance-mode', 'high');
    } else {
      root.setAttribute('data-performance-mode', 'normal');
    }
  }

  private setMemoryStatus(root: HTMLElement, metrics: any): void {
    if (metrics.memoryUsage !== undefined) {
      const level = metrics.memoryUsage > 0.8 ? 'high' : metrics.memoryUsage > 0.6 ? 'medium' : 'low';
      root.setAttribute('data-memory-usage', level);
      if (metrics.memoryUsage > 0.8) root.setAttribute('data-low-memory', 'true');
    }
  }

  private updateMetrics(context: NavigationContext): void {
    const ua = this.getUserAgentInfo();
    this.metrics.totalTransitions++;
    this.metrics.lastTransitionTime = context.timestamp;

    const estimated = estimateTransitionDuration(context.relationship, ua.isLowPowerMode);
    this.metrics.averageDuration = (this.metrics.averageDuration * (this.metrics.totalTransitions - 1) + estimated) / this.metrics.totalTransitions;
  }

  private updatePerformanceMetrics(data: TransitionPerformanceData): void {
    this.metrics.averageDuration = (this.metrics.averageDuration * (this.metrics.totalTransitions - 1) + (data.endTime - data.startTime)) / this.metrics.totalTransitions;

    const isFailure = data.averageFrameRate < 30 || data.droppedFrames > 5;
    const failureCount = isFailure ? 1 : 0;
    this.metrics.failureRate = (this.metrics.failureRate * (this.metrics.totalTransitions - 1) + failureCount) / this.metrics.totalTransitions;
  }

  private updateNavigationHistory(path: string): void {
    this.navigationHistory.push(path);
    if (this.navigationHistory.length > 50) this.navigationHistory = this.navigationHistory.slice(-50);
  }

  private getUserAgentInfo(): UserAgentInfo {
    const ua = navigator.userAgent.toLowerCase();
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(ua);
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;

    return {
      isMobile,
      isLowPowerMode: navigator.hardwareConcurrency <= 2 || prefersReducedMotion,
      prefersReducedMotion,
      connectionType: connection?.effectiveType || 'unknown'
    };
  }

  private triggerSoundEffect(): void {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  private triggerHapticFeedback(): void {
    if ('vibrate' in navigator) {
      try { navigator.vibrate([10, 5, 10]); } catch (e) {}
    }
  }

  public detectNavigationContext(fromPath: string, toPath: string): NavigationContext {
    return createNavigationContext(fromPath, toPath, this.navigationHistory);
  }

  public getCurrentContext(): NavigationContext | null {
    if (this.navigationHistory.length < 2) return null;
    return createNavigationContext(
      this.navigationHistory[this.navigationHistory.length - 2],
      this.navigationHistory[this.navigationHistory.length - 1],
      this.navigationHistory
    );
  }

  public getEnhancedMetrics(): TransitionMetrics & { performanceData?: PerformanceMetrics } {
    return { ...this.getMetrics(), performanceData: performanceMonitor.getCurrentMetrics() };
  }

  public isTransitionSupported(): boolean {
    return typeof document !== 'undefined' && 'startViewTransition' in document;
  }

  public getMetrics(): TransitionMetrics { return { ...this.metrics }; }

  public destroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('astro:before-preparation', this.handleBeforePreparation.bind(this));
      document.removeEventListener('astro:after-swap', this.handleAfterSwap.bind(this));
      document.removeEventListener('astro:page-load', this.handlePageLoad.bind(this));
    }
    if (typeof window !== 'undefined') {
      window.removeEventListener('popstate', this.handlePopState.bind(this));
    }
    performanceMonitor.destroy();
    transitionPreferences.destroy();
    this.isInitialized = false;
  }
}

export const transitionController = new TransitionController();
export default TransitionController;
