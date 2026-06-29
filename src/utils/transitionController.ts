/**
 * TransitionController - Manages view transitions with navigation context detection
 * Refactored to use Narrative Domain logic.
 */

import { mobileTransitionOptimizer } from './mobileTransitionOptimizer';
import { pwaTransitionIntegration } from './pwaTransitionIntegration';
import { performanceMonitor } from './performanceMonitor';
import type { TransitionPerformanceData, PerformanceMetrics } from './performanceMonitor';
import { transitionPreferences } from './transitionPreferences';
import { PageType, NavigationDirection } from '../domain/transitions/navigation.domain';
import { PageRelationship } from '../domain/transitions/relationship.domain';
import { createNavigationContext, type NavigationContext } from '../domain/transitions/context.domain';
import { getTransitionContextName, estimateTransitionDuration } from '../domain/transitions/optimization.domain';
import { calculateTransitionAttributes, calculateOptimizationStyles } from '../domain/transitions/attribute.domain';
import { parseEnvironment, calculateMemoryLevel, PerformanceTier } from '../domain/common/environment.domain';

export { PageType, NavigationDirection, PageRelationship };
export type { NavigationContext };

export interface TransitionMetrics {
  averageDuration: number;
  failureRate: number;
  totalTransitions: number;
  lastTransitionTime: number;
}

export class TransitionController {
  private navigationHistory: string[] = [];
  private currentPath: string = '';
  private metrics: TransitionMetrics = { averageDuration: 0, failureRate: 0, totalTransitions: 0, lastTransitionTime: 0 };
  private isInitialized: boolean = false;
  private transitionInProgress: boolean = false;

  constructor() { this.initialize(); }

  private initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) return;
    this.currentPath = window.location.pathname;
    this.navigationHistory = [this.currentPath];
    this.bindEvents();
    this.isInitialized = true;
  }

  private bindEvents(): void {
    document.addEventListener('astro:before-preparation', this.handleBeforePreparation.bind(this));
    document.addEventListener('astro:after-swap', this.handleAfterSwap.bind(this));
    document.addEventListener('astro:page-load', this.handlePageLoad.bind(this));
    window.addEventListener('popstate', this.handlePopState.bind(this));
  }

  private handleBeforePreparation(event: Event): void {
    const customEvent = event as CustomEvent;
    const toPath = customEvent.detail?.to?.pathname || window.location.pathname;
    if (this.transitionInProgress) return;
    this.transitionInProgress = true;
    this.startTransitionPreparation(createNavigationContext(this.currentPath, toPath, this.navigationHistory));
  }

  private startTransitionPreparation(context: NavigationContext): void {
    performanceMonitor.startMonitoring(getTransitionContextName(context.direction, context.relationship));
    this.applyMobileOptimizations(context);
    this.applyDomainAttributes(context);
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

  private handlePageLoad(): void { this.transitionInProgress = false; }

  private handlePopState(): void {
    const newPath = window.location.pathname;
    const context = createNavigationContext(this.currentPath, newPath, this.navigationHistory);
    context.direction = NavigationDirection.BACKWARD;
    this.applyDomainAttributes(context);
    this.updateNavigationHistory(newPath);
    this.currentPath = newPath;
  }

  private applyMobileOptimizations(context: NavigationContext): void {
    const opt = mobileTransitionOptimizer.getTransitionOptimization();
    const pwa = pwaTransitionIntegration.getPWATransitionSettings();
    if (opt.shouldOptimize) this.applyStyles(calculateOptimizationStyles(opt.recommendedDuration, opt.recommendedEasing, opt.optimizationType));
    if (pwa.shouldOptimize) this.applyStyles({ attributes: {}, cssVariables: { '--transition-duration-pwa': `${pwa.duration}ms`, '--transition-easing-pwa': pwa.easing } });
    this.applyDeviceStateAttributes();
  }

  private applyDeviceStateAttributes(): void {
    const caps = mobileTransitionOptimizer.getDeviceCapabilities();
    const net = mobileTransitionOptimizer.getNetworkCondition();
    const root = document.documentElement;
    root.setAttribute('data-device-mobile', caps.isMobile.toString());
    root.setAttribute('data-device-tablet', caps.isTablet.toString());
    root.setAttribute('data-device-pwa', caps.isPWA.toString());
    root.setAttribute('data-network-type', net.effectiveType);
    if (caps.batteryLevel !== undefined) root.setAttribute('data-battery-level', Math.round(caps.batteryLevel * 100).toString());
  }

  private applyDomainAttributes(context: NavigationContext): void {
    const env = this.getEnvironment();
    const blueprint = calculateTransitionAttributes(context, env.prefersReducedMotion, env.isLowPower);
    this.applyStyles(blueprint);
  }

  private applyUserPreferences(): void {
    const preferences = transitionPreferences.getPreferences();
    const root = document.documentElement;
    root.setAttribute('data-transition-intensity', transitionPreferences.getEffectiveIntensity());
    root.setAttribute('data-debug-transitions', preferences.debugMode.toString());
    if (preferences.enableSoundEffects) this.triggerSoundEffect();
    if (preferences.enableHapticFeedback) this.triggerHapticFeedback();
  }

  private applyPerformanceOptimizations(): void {
    const metrics = performanceMonitor.getCurrentMetrics();
    const env = this.getEnvironment();
    const root = document.documentElement;
    root.setAttribute('data-performance-mode', env.tier);
    root.setAttribute('data-current-fps', metrics.frameRate.toString());
    if (metrics.memoryUsage !== undefined) root.setAttribute('data-memory-usage', calculateMemoryLevel(metrics.memoryUsage));
  }

  private applyStyles(blueprint: { attributes: Record<string, string>; cssVariables: Record<string, string> }): void {
    const root = document.documentElement;
    Object.entries(blueprint.attributes).forEach(([k, v]) => root.setAttribute(k, v));
    Object.entries(blueprint.cssVariables).forEach(([k, v]) => root.style.setProperty(k, v));
  }

  private updateMetrics(context: NavigationContext): void {
    const env = this.getEnvironment();
    this.metrics.totalTransitions++;
    this.metrics.lastTransitionTime = context.timestamp;
    const estimated = estimateTransitionDuration(context.relationship, env.isLowPower);
    this.metrics.averageDuration = (this.metrics.averageDuration * (this.metrics.totalTransitions - 1) + estimated) / this.metrics.totalTransitions;
  }

  private updatePerformanceMetrics(data: TransitionPerformanceData): void {
    this.metrics.averageDuration = (this.metrics.averageDuration * (this.metrics.totalTransitions - 1) + (data.endTime - data.startTime)) / this.metrics.totalTransitions;
    const isFailure = data.averageFrameRate < 30 || data.droppedFrames > 5;
    this.metrics.failureRate = (this.metrics.failureRate * (this.metrics.totalTransitions - 1) + (isFailure ? 1 : 0)) / this.metrics.totalTransitions;
  }

  private updateNavigationHistory(path: string): void {
    this.navigationHistory.push(path);
    if (this.navigationHistory.length > 50) this.navigationHistory = this.navigationHistory.slice(-50);
  }

  private getEnvironment() {
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    return parseEnvironment(
      navigator.userAgent,
      navigator.hardwareConcurrency,
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      connection?.effectiveType || 'unknown'
    );
  }

  private triggerSoundEffect(): void {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }

  private triggerHapticFeedback(): void {
    if ('vibrate' in navigator) try { navigator.vibrate([10, 5, 10]); } catch (e) {}
  }

  public detectNavigationContext(from: string, to: string) { return createNavigationContext(from, to, this.navigationHistory); }

  public getEnhancedMetrics() { return { ...this.metrics, performanceData: performanceMonitor.getCurrentMetrics() }; }

  public getMetrics(): TransitionMetrics { return { ...this.metrics }; }

  public getCurrentContext(): NavigationContext | null {
    if (this.navigationHistory.length < 2) return null;
    return createNavigationContext(
      this.navigationHistory[this.navigationHistory.length - 2],
      this.navigationHistory[this.navigationHistory.length - 1],
      this.navigationHistory
    );
  }

  public isTransitionSupported() { return typeof document !== 'undefined' && 'startViewTransition' in document; }

  public destroy(): void {
    if (typeof document !== 'undefined') {
      document.removeEventListener('astro:before-preparation', this.handleBeforePreparation.bind(this));
      document.removeEventListener('astro:after-swap', this.handleAfterSwap.bind(this));
      document.removeEventListener('astro:page-load', this.handlePageLoad.bind(this));
    }
    if (typeof window !== 'undefined') window.removeEventListener('popstate', this.handlePopState.bind(this));
    performanceMonitor.destroy();
    transitionPreferences.destroy();
    this.isInitialized = false;
  }
}

export const transitionController = new TransitionController();
export default TransitionController;
