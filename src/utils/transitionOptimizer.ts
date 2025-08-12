/**
 * Transition Optimizer - Final performance optimizations for 60fps transitions
 * 
 * This module provides runtime optimization of transitions based on device
 * capabilities, network conditions, and performance metrics.
 */

import { performanceMonitor } from './performanceMonitor';
import { transitionPreferences } from './transitionPreferences';

export interface OptimizationSettings {
  enableHardwareAcceleration: boolean;
  maxConcurrentTransitions: number;
  adaptiveDuration: boolean;
  batteryAwareOptimization: boolean;
  networkAwareOptimization: boolean;
  frameRateTarget: number;
}

export interface DeviceCapabilities {
  cpuCores: number;
  memoryGB: number;
  gpuTier: 'low' | 'medium' | 'high';
  screenRefreshRate: number;
  supportedFeatures: string[];
}

export interface OptimizationRecommendations {
  shouldSimplifyAnimations: boolean;
  recommendedDuration: number;
  recommendedEasing: string;
  shouldUseHardwareAcceleration: boolean;
  shouldEnablePreloading: boolean;
  maxAnimationComplexity: 'low' | 'medium' | 'high';
}

export class TransitionOptimizer {
  private settings: OptimizationSettings;
  private deviceCapabilities: DeviceCapabilities;
  private isOptimizing: boolean = false;
  private optimizationInterval?: number;

  constructor() {
    this.settings = this.getDefaultSettings();
    this.deviceCapabilities = this.detectDeviceCapabilities();
    this.initialize();
  }

  /**
   * Initialize the optimizer
   */
  private initialize(): void {
    if (typeof window === 'undefined') return;

    // Start continuous optimization
    this.startOptimization();

    // Listen for performance changes
    performanceMonitor.onPerformanceChange((metrics) => {
      this.handlePerformanceChange(metrics);
    });

    // Listen for battery changes
    this.setupBatteryMonitoring();

    // Listen for network changes
    this.setupNetworkMonitoring();

    // Listen for visibility changes
    document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
  }

  /**
   * Get default optimization settings
   */
  private getDefaultSettings(): OptimizationSettings {
    return {
      enableHardwareAcceleration: true,
      maxConcurrentTransitions: 3,
      adaptiveDuration: true,
      batteryAwareOptimization: true,
      networkAwareOptimization: true,
      frameRateTarget: 60
    };
  }

  /**
   * Detect device capabilities
   */
  private detectDeviceCapabilities(): DeviceCapabilities {
    const cpuCores = navigator.hardwareConcurrency || 4;
    const memoryGB = (navigator as any).deviceMemory || 4;
    
    // Estimate GPU tier based on available information
    const gpuTier = this.estimateGPUTier();
    
    // Detect screen refresh rate
    const screenRefreshRate = this.detectRefreshRate();
    
    // Detect supported features
    const supportedFeatures = this.detectSupportedFeatures();

    return {
      cpuCores,
      memoryGB,
      gpuTier,
      screenRefreshRate,
      supportedFeatures
    };
  }

  /**
   * Estimate GPU tier based on available information
   */
  private estimateGPUTier(): 'low' | 'medium' | 'high' {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    
    if (!gl) return 'low';
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (!debugInfo) return 'medium';
    
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL).toLowerCase();
    
    // High-end GPUs
    if (renderer.includes('nvidia') && (renderer.includes('rtx') || renderer.includes('gtx'))) {
      return 'high';
    }
    if (renderer.includes('amd') && renderer.includes('radeon')) {
      return 'high';
    }
    if (renderer.includes('apple') && renderer.includes('m1')) {
      return 'high';
    }
    
    // Low-end indicators
    if (renderer.includes('intel') && renderer.includes('hd')) {
      return 'low';
    }
    if (renderer.includes('mali') || renderer.includes('adreno')) {
      return 'low';
    }
    
    return 'medium';
  }

  /**
   * Detect screen refresh rate
   */
  private detectRefreshRate(): number {
    // Default to 60Hz, could be enhanced with more sophisticated detection
    return 60;
  }

  /**
   * Detect supported features
   */
  private detectSupportedFeatures(): string[] {
    const features: string[] = [];
    
    // Check for View Transition API
    if ('startViewTransition' in document) {
      features.push('view-transitions');
    }
    
    // Check for Web Animations API
    if ('animate' in Element.prototype) {
      features.push('web-animations');
    }
    
    // Check for CSS containment
    if (CSS.supports('contain', 'layout')) {
      features.push('css-containment');
    }
    
    // Check for will-change support
    if (CSS.supports('will-change', 'transform')) {
      features.push('will-change');
    }
    
    // Check for transform3d support
    if (CSS.supports('transform', 'translate3d(0, 0, 0)')) {
      features.push('transform3d');
    }
    
    return features;
  }

  /**
   * Start continuous optimization
   */
  private startOptimization(): void {
    if (this.isOptimizing) return;
    
    this.isOptimizing = true;
    
    // Run optimization every 5 seconds
    this.optimizationInterval = window.setInterval(() => {
      this.optimizeTransitions();
    }, 5000);
    
    // Run initial optimization
    this.optimizeTransitions();
  }

  /**
   * Stop continuous optimization
   */
  private stopOptimization(): void {
    if (this.optimizationInterval) {
      clearInterval(this.optimizationInterval);
      this.optimizationInterval = undefined;
    }
    this.isOptimizing = false;
  }

  /**
   * Optimize transitions based on current conditions
   */
  private optimizeTransitions(): void {
    const recommendations = this.getOptimizationRecommendations();
    this.applyOptimizations(recommendations);
  }

  /**
   * Get optimization recommendations based on current state
   */
  public getOptimizationRecommendations(): OptimizationRecommendations {
    const currentMetrics = performanceMonitor.getCurrentMetrics();
    const preferences = transitionPreferences.getPreferences();
    
    // Base recommendations on device capabilities
    let shouldSimplifyAnimations = false;
    let recommendedDuration = 300;
    let recommendedEasing = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
    let shouldUseHardwareAcceleration = true;
    let shouldEnablePreloading = true;
    let maxAnimationComplexity: 'low' | 'medium' | 'high' = 'high';

    // Adjust based on device capabilities
    if (this.deviceCapabilities.cpuCores <= 2 || this.deviceCapabilities.memoryGB <= 2) {
      shouldSimplifyAnimations = true;
      recommendedDuration = 200;
      maxAnimationComplexity = 'low';
    } else if (this.deviceCapabilities.cpuCores <= 4 || this.deviceCapabilities.memoryGB <= 4) {
      maxAnimationComplexity = 'medium';
    }

    // Adjust based on GPU tier
    if (this.deviceCapabilities.gpuTier === 'low') {
      shouldSimplifyAnimations = true;
      shouldUseHardwareAcceleration = false;
      maxAnimationComplexity = 'low';
    }

    // Adjust based on current performance
    if (currentMetrics.frameRate < 45) {
      shouldSimplifyAnimations = true;
      recommendedDuration = Math.max(150, recommendedDuration * 0.7);
      recommendedEasing = 'ease-out';
    }

    // Adjust based on memory usage
    if (currentMetrics.memoryUsage && currentMetrics.memoryUsage > 0.8) {
      shouldSimplifyAnimations = true;
      shouldEnablePreloading = false;
      maxAnimationComplexity = 'low';
    }

    // Adjust based on battery level
    if (this.isBatteryLow()) {
      shouldSimplifyAnimations = true;
      recommendedDuration = Math.max(100, recommendedDuration * 0.5);
      shouldEnablePreloading = false;
      maxAnimationComplexity = 'low';
    }

    // Adjust based on network conditions
    if (this.isSlowNetwork()) {
      shouldEnablePreloading = false;
      recommendedDuration = Math.max(150, recommendedDuration * 0.8);
    }

    // Respect user preferences
    if (preferences.reducedMotion) {
      shouldSimplifyAnimations = true;
      recommendedDuration = 0;
      maxAnimationComplexity = 'low';
    }

    return {
      shouldSimplifyAnimations,
      recommendedDuration,
      recommendedEasing,
      shouldUseHardwareAcceleration,
      shouldEnablePreloading,
      maxAnimationComplexity
    };
  }

  /**
   * Apply optimizations to the DOM
   */
  private applyOptimizations(recommendations: OptimizationRecommendations): void {
    const root = document.documentElement;
    
    // Apply duration optimization
    if (this.settings.adaptiveDuration) {
      root.style.setProperty('--transition-duration-optimized', `${recommendations.recommendedDuration}ms`);
      root.style.setProperty('--transition-easing-optimized', recommendations.recommendedEasing);
    }
    
    // Apply complexity optimization
    root.setAttribute('data-animation-complexity', recommendations.maxAnimationComplexity);
    
    // Apply hardware acceleration setting
    root.setAttribute('data-hardware-acceleration', recommendations.shouldUseHardwareAcceleration.toString());
    
    // Apply simplification setting
    root.setAttribute('data-simplified-animations', recommendations.shouldSimplifyAnimations.toString());
    
    // Apply preloading setting
    root.setAttribute('data-preloading-enabled', recommendations.shouldEnablePreloading.toString());
    
    // Apply device-specific optimizations
    root.setAttribute('data-cpu-cores', this.deviceCapabilities.cpuCores.toString());
    root.setAttribute('data-memory-gb', this.deviceCapabilities.memoryGB.toString());
    root.setAttribute('data-gpu-tier', this.deviceCapabilities.gpuTier);
    root.setAttribute('data-refresh-rate', this.deviceCapabilities.screenRefreshRate.toString());
    
    // Apply performance metrics
    const currentMetrics = performanceMonitor.getCurrentMetrics();
    root.setAttribute('data-current-fps', Math.round(currentMetrics.frameRate).toString());
    
    if (currentMetrics.memoryUsage !== undefined) {
      root.setAttribute('data-memory-usage', Math.round(currentMetrics.memoryUsage * 100).toString());
    }
  }

  /**
   * Handle performance changes
   */
  private handlePerformanceChange(metrics: any): void {
    // If performance drops significantly, apply emergency optimizations
    if (metrics.frameRate < 30) {
      this.applyEmergencyOptimizations();
    }
  }

  /**
   * Apply emergency optimizations for very poor performance
   */
  private applyEmergencyOptimizations(): void {
    const root = document.documentElement;
    
    // Disable all complex animations
    root.setAttribute('data-emergency-mode', 'true');
    root.style.setProperty('--transition-duration-optimized', '100ms');
    root.style.setProperty('--transition-easing-optimized', 'ease-out');
    
    // Force simple fade transitions
    root.setAttribute('data-force-simple-transitions', 'true');
    
    console.warn('Emergency transition optimizations applied due to poor performance');
  }

  /**
   * Setup battery monitoring
   */
  private setupBatteryMonitoring(): void {
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          const root = document.documentElement;
          root.setAttribute('data-battery-level', Math.round(battery.level * 100).toString());
          root.setAttribute('data-battery-charging', battery.charging.toString());
          root.setAttribute('data-battery-low', (battery.level < 0.2).toString());
        };
        
        updateBatteryStatus();
        
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
      }).catch(() => {
        // Battery API not available
      });
    }
  }

  /**
   * Setup network monitoring
   */
  private setupNetworkMonitoring(): void {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    
    if (connection) {
      const updateNetworkStatus = () => {
        const root = document.documentElement;
        root.setAttribute('data-connection-type', connection.effectiveType || 'unknown');
        root.setAttribute('data-connection-downlink', connection.downlink?.toString() || 'unknown');
        root.setAttribute('data-save-data', connection.saveData?.toString() || 'false');
      };
      
      updateNetworkStatus();
      connection.addEventListener('change', updateNetworkStatus);
    }
  }

  /**
   * Handle visibility changes
   */
  private handleVisibilityChange(): void {
    if (document.hidden) {
      // Page is hidden, pause optimizations
      this.stopOptimization();
    } else {
      // Page is visible, resume optimizations
      this.startOptimization();
    }
  }

  /**
   * Check if battery is low
   */
  private isBatteryLow(): boolean {
    const batteryLevel = document.documentElement.getAttribute('data-battery-level');
    return batteryLevel ? parseInt(batteryLevel) < 20 : false;
  }

  /**
   * Check if network is slow
   */
  private isSlowNetwork(): boolean {
    const connectionType = document.documentElement.getAttribute('data-connection-type');
    return connectionType === 'slow-2g' || connectionType === '2g';
  }

  /**
   * Get current optimization settings
   */
  public getSettings(): OptimizationSettings {
    return { ...this.settings };
  }

  /**
   * Update optimization settings
   */
  public updateSettings(newSettings: Partial<OptimizationSettings>): void {
    this.settings = { ...this.settings, ...newSettings };
    
    // Re-optimize with new settings
    this.optimizeTransitions();
  }

  /**
   * Get device capabilities
   */
  public getDeviceCapabilities(): DeviceCapabilities {
    return { ...this.deviceCapabilities };
  }

  /**
   * Force optimization run
   */
  public forceOptimization(): void {
    this.optimizeTransitions();
  }

  /**
   * Reset to default optimizations
   */
  public resetOptimizations(): void {
    const root = document.documentElement;
    
    // Remove optimization attributes
    root.removeAttribute('data-animation-complexity');
    root.removeAttribute('data-hardware-acceleration');
    root.removeAttribute('data-simplified-animations');
    root.removeAttribute('data-preloading-enabled');
    root.removeAttribute('data-emergency-mode');
    root.removeAttribute('data-force-simple-transitions');
    
    // Reset CSS properties
    root.style.removeProperty('--transition-duration-optimized');
    root.style.removeProperty('--transition-easing-optimized');
  }

  /**
   * Destroy the optimizer
   */
  public destroy(): void {
    this.stopOptimization();
    
    document.removeEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
    
    this.resetOptimizations();
  }
}

// Export singleton instance
export const transitionOptimizer = new TransitionOptimizer();