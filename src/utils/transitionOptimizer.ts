/**
 * Transition Optimizer - Final performance optimizations for 60fps transitions
 * 
 * This module provides runtime optimization of transitions based on device
 * capabilities, network conditions, and performance metrics.
 */

import { performanceMonitor } from './performanceMonitor';
import { transitionPreferences } from './transitionPreferences';
import { devConsole } from './isDev';
import {
  detectDeviceCapabilities
} from './transition/deviceDetector';
import {
  setupBatteryMonitoring,
  setupNetworkMonitoring,
  isBatteryLow,
  isSlowNetwork
} from './transition/monitoring';
import type {
  OptimizationSettings,
  DeviceCapabilities,
  OptimizationRecommendations
} from './transition/types';

// Re-export types for backward compatibility
export type {
  OptimizationSettings,
  DeviceCapabilities,
  OptimizationRecommendations
};

/**
 * PURE FUNCTIONS
 * These functions are deterministic and have no side effects.
 */

/**
 * Calculates transition recommendations based on provided system state.
 * This is a pure function.
 */
export function calculateRecommendations(
  capabilities: DeviceCapabilities,
  metrics: { frameRate: number, memoryUsage?: number },
  preferences: { reducedMotion: boolean },
  isLowBattery: boolean,
  isSlowNetwork: boolean
): OptimizationRecommendations {
  // Base recommendations on device capabilities
  let shouldSimplifyAnimations = false;
  let recommendedDuration = 300;
  let recommendedEasing = 'cubic-bezier(0.4, 0.0, 0.2, 1)';
  let shouldUseHardwareAcceleration = true;
  let shouldEnablePreloading = true;
  let maxAnimationComplexity: 'low' | 'medium' | 'high' = 'high';

  // Adjust based on device capabilities
  if (capabilities.cpuCores <= 2 || capabilities.memoryGB <= 2) {
    shouldSimplifyAnimations = true;
    recommendedDuration = 200;
    maxAnimationComplexity = 'low';
  } else if (capabilities.cpuCores <= 4 || capabilities.memoryGB <= 4) {
    maxAnimationComplexity = 'medium';
  }

  // Adjust based on GPU tier
  if (capabilities.gpuTier === 'low') {
    shouldSimplifyAnimations = true;
    shouldUseHardwareAcceleration = false;
    maxAnimationComplexity = 'low';
  }

  // Adjust based on current performance
  if (metrics.frameRate < 45) {
    shouldSimplifyAnimations = true;
    recommendedDuration = Math.max(150, recommendedDuration * 0.7);
    recommendedEasing = 'ease-out';
  }

  // Adjust based on memory usage
  if (metrics.memoryUsage && metrics.memoryUsage > 0.8) {
    shouldSimplifyAnimations = true;
    shouldEnablePreloading = false;
    maxAnimationComplexity = 'low';
  }

  // Adjust based on battery level
  if (isLowBattery) {
    shouldSimplifyAnimations = true;
    recommendedDuration = Math.max(100, recommendedDuration * 0.5);
    shouldEnablePreloading = false;
    maxAnimationComplexity = 'low';
  }

  // Adjust based on network conditions
  if (isSlowNetwork) {
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
 * STATEFUL MODULE
 * Manages side effects and maintains runtime state.
 */

let stateSettings: OptimizationSettings = {
  enableHardwareAcceleration: true,
  maxConcurrentTransitions: 3,
  adaptiveDuration: true,
  batteryAwareOptimization: true,
  networkAwareOptimization: true,
  frameRateTarget: 60
};

let stateDeviceCapabilities: DeviceCapabilities = detectDeviceCapabilities();
let stateIsOptimizing: boolean = false;
let stateOptimizationInterval: number | undefined;

/**
 * Get optimization recommendations based on current state.
 * This function wraps the pure calculateRecommendations.
 */
export function getOptimizationRecommendations(): OptimizationRecommendations {
  return calculateRecommendations(
    stateDeviceCapabilities,
    performanceMonitor.getCurrentMetrics(),
    transitionPreferences.getPreferences(),
    isBatteryLow(),
    isSlowNetwork()
  );
}

/**
 * Apply optimizations to the DOM
 */
export function applyOptimizationsToDOM(
  recommendations: OptimizationRecommendations,
  settings: OptimizationSettings,
  capabilities: DeviceCapabilities
): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Apply duration optimization
  if (settings.adaptiveDuration) {
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
  root.setAttribute('data-cpu-cores', capabilities.cpuCores.toString());
  root.setAttribute('data-memory-gb', capabilities.memoryGB.toString());
  root.setAttribute('data-gpu-tier', capabilities.gpuTier);
  root.setAttribute('data-refresh-rate', capabilities.screenRefreshRate.toString());

  // Apply performance metrics
  const currentMetrics = performanceMonitor.getCurrentMetrics();
  root.setAttribute('data-current-fps', Math.round(currentMetrics.frameRate).toString());

  if (currentMetrics.memoryUsage !== undefined) {
    root.setAttribute('data-memory-usage', Math.round(currentMetrics.memoryUsage * 100).toString());
  }
}

/**
 * Optimize transitions based on current conditions
 */
export function optimizeTransitions(): void {
  const recommendations = getOptimizationRecommendations();
  applyOptimizationsToDOM(recommendations, stateSettings, stateDeviceCapabilities);
}

/**
 * Apply emergency optimizations for very poor performance
 */
export function applyEmergencyOptimizations(): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  // Disable all complex animations
  root.setAttribute('data-emergency-mode', 'true');
  root.style.setProperty('--transition-duration-optimized', '100ms');
  root.style.setProperty('--transition-easing-optimized', 'ease-out');

  // Force simple fade transitions
  root.setAttribute('data-force-simple-transitions', 'true');

  // Only warn in development mode
  devConsole('warn', ['Emergency transition optimizations applied due to poor performance']);
}

/**
 * Continuous optimization cycle management
 */

export function stopOptimization(): void {
  if (stateOptimizationInterval) {
    clearInterval(stateOptimizationInterval);
    stateOptimizationInterval = undefined;
  }
  stateIsOptimizing = false;
}

export function startOptimization(): void {
  if (typeof window === 'undefined' || stateIsOptimizing) return;

  stateIsOptimizing = true;

  // Run initial optimization
  optimizeTransitions();

  // Run optimization every 5 seconds
  stateOptimizationInterval = window.setInterval(optimizeTransitions, 5000);
}

function handleVisibilityChange(): void {
  if (typeof document === 'undefined') return;

  if (document.hidden) {
    stopOptimization();
  } else {
    startOptimization();
  }
}

/**
 * Lifecycle Management
 */

export function initializeOptimizer(): void {
  if (typeof window === 'undefined') return;

  startOptimization();

  performanceMonitor.onPerformanceChange((metrics) => {
    if (metrics.frameRate < 30) {
      applyEmergencyOptimizations();
    }
  });

  setupBatteryMonitoring();
  setupNetworkMonitoring();
  document.addEventListener('visibilitychange', handleVisibilityChange);
}

export function resetOptimizations(): void {
  if (typeof document === 'undefined') return;

  const root = document.documentElement;

  const attributes = [
    'data-animation-complexity',
    'data-hardware-acceleration',
    'data-simplified-animations',
    'data-preloading-enabled',
    'data-emergency-mode',
    'data-force-simple-transitions'
  ];

  attributes.forEach(attr => root.removeAttribute(attr));
  root.style.removeProperty('--transition-duration-optimized');
  root.style.removeProperty('--transition-easing-optimized');
}

export function destroyOptimizer(): void {
  stopOptimization();

  if (typeof document !== 'undefined') {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  }

  resetOptimizations();
}

/**
 * Compat Interface (Functional Singleton)
 */
export const transitionOptimizer = {
  getSettings: () => ({ ...stateSettings }),
  updateSettings: (newSettings: Partial<OptimizationSettings>) => {
    stateSettings = { ...stateSettings, ...newSettings };
    optimizeTransitions();
  },
  getDeviceCapabilities: () => ({ ...stateDeviceCapabilities }),
  forceOptimization: () => optimizeTransitions(),
  resetOptimizations,
  destroy: destroyOptimizer,
  initialize: initializeOptimizer,
  getOptimizationRecommendations
};

// Side effect: Auto-initialize if running in browser
if (typeof window !== 'undefined') {
  initializeOptimizer();
}