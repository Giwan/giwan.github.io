/**
 * Mobile Transition Initialization
 * 
 * This module initializes all mobile and PWA transition optimizations
 * and coordinates between different optimization systems.
 */

import { mobileTransitionOptimizer } from './mobileTransitionOptimizer';
import { pwaTransitionIntegration } from './pwaTransitionIntegration';
import { transitionController } from './transitionController';
import { devConsole } from '../utils/isDev';

export interface MobileTransitionConfig {
  enableMobileOptimizations: boolean;
  enablePWAIntegration: boolean;
  enableNetworkAwareness: boolean;
  enableBatteryOptimizations: boolean;
  enableOrientationHandling: boolean;
  debugMode: boolean;
}

export class MobileTransitionInitializer {
  private config: MobileTransitionConfig;
  private isInitialized = false;
  private cleanupFunctions: (() => void)[] = [];

  constructor(config: Partial<MobileTransitionConfig> = {}) {
    this.config = {
      enableMobileOptimizations: true,
      enablePWAIntegration: true,
      enableNetworkAwareness: true,
      enableBatteryOptimizations: true,
      enableOrientationHandling: true,
      debugMode: false,
      ...config
    };
  }

  /**
   * Initialize all mobile transition optimizations
   */
  public async initialize(): Promise<void> {
    if (typeof window === 'undefined' || this.isInitialized) {
      return;
    }

    try {
      this.log('Initializing mobile transition optimizations...');

      // Initialize mobile optimizer
      if (this.config.enableMobileOptimizations) {
        await this.initializeMobileOptimizer();
      }

      // Initialize PWA integration
      if (this.config.enablePWAIntegration) {
        await this.initializePWAIntegration();
      }

      // Set up coordination between systems
      this.setupSystemCoordination();

      // Set up debug logging if enabled
      if (this.config.debugMode) {
        this.setupDebugLogging();
      }

      this.isInitialized = true;
      this.log('Mobile transition optimizations initialized successfully');

    } catch (error) {
      devConsole('error', ['Failed to initialize mobile transition optimizations:', error]);
    }
  }

  /**
   * Initialize mobile optimizer
   */
  private async initializeMobileOptimizer(): Promise<void> {
    this.log('Setting up mobile optimizer...');

    // Set up orientation change handling
    if (this.config.enableOrientationHandling) {
      const unsubscribeOrientation = mobileTransitionOptimizer.onOrientationChange(() => {
        this.log('Orientation changed, updating transition optimizations');
        this.updateTransitionOptimizations();
      });
      this.cleanupFunctions.push(unsubscribeOrientation);
    }

    // Set up network awareness
    if (this.config.enableNetworkAwareness) {
      const unsubscribeNetwork = mobileTransitionOptimizer.onNetworkChange((condition) => {
        this.log(`Network condition changed: ${condition.effectiveType}`);
        this.updateTransitionOptimizations();
      });
      this.cleanupFunctions.push(unsubscribeNetwork);
    }

    // Set up battery optimizations
    if (this.config.enableBatteryOptimizations) {
      const unsubscribeBattery = mobileTransitionOptimizer.onBatteryChange((isLow) => {
        this.log(`Battery state changed: ${isLow ? 'low' : 'normal'}`);
        this.updateTransitionOptimizations();
      });
      this.cleanupFunctions.push(unsubscribeBattery);
    }
  }

  /**
   * Initialize PWA integration
   */
  private async initializePWAIntegration(): Promise<void> {
    this.log('Setting up PWA integration...');

    // Listen for PWA events
    window.addEventListener('pwa-update-available', (event) => {
      this.log('PWA update available');
      this.handlePWAUpdate(event as CustomEvent);
    });

    window.addEventListener('pwa-network-change', (event) => {
      this.log(`PWA network state changed: ${(event as CustomEvent).detail.isOnline ? 'online' : 'offline'}`);
      this.updateTransitionOptimizations();
    });

    window.addEventListener('pwa-installed', (event) => {
      this.log('PWA installed');
      this.handlePWAInstalled(event as CustomEvent);
    });
  }

  /**
   * Set up coordination between different optimization systems
   */
  private setupSystemCoordination(): void {
    this.log('Setting up system coordination...');

    // Coordinate mobile optimizer with transition controller
    const originalApplyTransitionContext = (transitionController as any).applyTransitionContext;
    if (originalApplyTransitionContext) {
      (transitionController as any).applyTransitionContext = (context: any) => {
        // Apply mobile optimizations first
        this.applyCoordinatedOptimizations(context);
        
        // Then apply original transition context
        originalApplyTransitionContext.call(transitionController, context);
      };
    }

    // Set up periodic optimization updates
    setInterval(() => {
      this.updateTransitionOptimizations();
    }, 30000); // Update every 30 seconds
  }

  /**
   * Apply coordinated optimizations across all systems
   */
  private applyCoordinatedOptimizations(context: any): void {
    const mobileOptimization = mobileTransitionOptimizer.getTransitionOptimization();
    const pwaSettings = pwaTransitionIntegration.getPWATransitionSettings();
    const deviceCapabilities = mobileTransitionOptimizer.getDeviceCapabilities();
    
    const root = document.documentElement;
    
    // Determine the most restrictive optimization
    let finalDuration = 300; // Default
    let finalEasing = 'cubic-bezier(0.4, 0.0, 0.2, 1)'; // Default
    
    // Apply mobile optimizations
    if (mobileOptimization.shouldOptimize) {
      finalDuration = Math.min(finalDuration, mobileOptimization.recommendedDuration);
      finalEasing = mobileOptimization.recommendedEasing;
    }
    
    // Apply PWA optimizations
    if (pwaSettings.shouldOptimize) {
      finalDuration = Math.min(finalDuration, pwaSettings.duration);
      finalEasing = pwaSettings.easing;
    }
    
    // Apply device-specific constraints
    if (deviceCapabilities.isLowBattery) {
      finalDuration = Math.min(finalDuration, 150);
    }
    
    if (!mobileTransitionOptimizer.canHandleComplexTransitions()) {
      finalDuration = Math.min(finalDuration, 200);
      finalEasing = 'ease-out';
    }
    
    // Apply final optimizations
    root.style.setProperty('--transition-duration-coordinated', `${finalDuration}ms`);
    root.style.setProperty('--transition-easing-coordinated', finalEasing);
    
    this.log(`Applied coordinated optimizations: ${finalDuration}ms, ${finalEasing}`);
  }

  /**
   * Update transition optimizations based on current conditions
   */
  private updateTransitionOptimizations(): void {
    const deviceCapabilities = mobileTransitionOptimizer.getDeviceCapabilities();
    const networkCondition = mobileTransitionOptimizer.getNetworkCondition();
    const pwaState = pwaTransitionIntegration.getPWAState();
    
    const root = document.documentElement;
    
    // Update device attributes
    root.setAttribute('data-device-mobile', deviceCapabilities.isMobile.toString());
    root.setAttribute('data-device-tablet', deviceCapabilities.isTablet.toString());
    root.setAttribute('data-device-pwa', deviceCapabilities.isPWA.toString());
    root.setAttribute('data-device-orientation', deviceCapabilities.orientation);
    
    // Update network attributes
    root.setAttribute('data-network-type', networkCondition.effectiveType);
    root.setAttribute('data-network-save-data', networkCondition.saveData.toString());
    
    // Update battery attributes
    if (deviceCapabilities.batteryLevel !== undefined) {
      root.setAttribute('data-battery-level', Math.round(deviceCapabilities.batteryLevel * 100).toString());
    }
    root.setAttribute('data-battery-low', deviceCapabilities.isLowBattery.toString());
    
    // Update PWA attributes
    root.setAttribute('data-pwa-online', pwaState.isOnline.toString());
    root.setAttribute('data-pwa-installed', pwaState.isInstalled.toString());
    root.setAttribute('data-pwa-sw-ready', pwaState.serviceWorkerReady.toString());
    
    this.log('Updated transition optimizations');
  }

  /**
   * Handle PWA update
   */
  private handlePWAUpdate(event: CustomEvent): void {
    const root = document.documentElement;
    root.setAttribute('data-pwa-update-available', 'true');
    
    // Temporarily optimize transitions during update
    root.style.setProperty('--transition-duration-update', '150ms');
    
    setTimeout(() => {
      root.removeAttribute('data-pwa-update-available');
      root.style.removeProperty('--transition-duration-update');
    }, 5000);
  }

  /**
   * Handle PWA installation
   */
  private handlePWAInstalled(event: CustomEvent): void {
    const root = document.documentElement;
    root.setAttribute('data-pwa-newly-installed', 'true');
    
    // Apply PWA-specific optimizations
    const pwaSettings = pwaTransitionIntegration.getPWATransitionSettings();
    root.style.setProperty('--transition-duration-pwa-installed', `${pwaSettings.duration}ms`);
    root.style.setProperty('--transition-easing-pwa-installed', pwaSettings.easing);
    
    // Remove temporary attribute after a delay
    setTimeout(() => {
      root.removeAttribute('data-pwa-newly-installed');
    }, 10000);
  }

  /**
   * Set up debug logging
   */
  private setupDebugLogging(): void {
    this.log('Debug mode enabled');
    
    // Log transition events
    document.addEventListener('astro:before-preparation', (event) => {
      const customEvent = event as CustomEvent;
      this.log('Transition starting:', {
        from: window.location.pathname,
        to: customEvent.detail?.to?.pathname,
        deviceCapabilities: mobileTransitionOptimizer.getDeviceCapabilities(),
        networkCondition: mobileTransitionOptimizer.getNetworkCondition(),
        pwaState: pwaTransitionIntegration.getPWAState()
      });
    });
    
    document.addEventListener('astro:after-swap', () => {
      this.log('Transition completed');
    });
    
    // Log optimization changes
    const originalUpdateOptimizations = this.updateTransitionOptimizations.bind(this);
    this.updateTransitionOptimizations = () => {
      this.log('Updating optimizations...');
      originalUpdateOptimizations();
    };
  }

  /**
   * Log messages if debug mode is enabled
   */
  private log(message: string, data?: any): void {
    if (this.config.debugMode) {
      if (data) {
        console.log(`[MobileTransitions] ${message}`, data);
      } else {
        console.log(`[MobileTransitions] ${message}`);
      }
    }
  }

  /**
   * Get current optimization status
   */
  public getOptimizationStatus(): {
    isInitialized: boolean;
    mobileOptimization: any;
    pwaSettings: any;
    deviceCapabilities: any;
    networkCondition: any;
  } {
    return {
      isInitialized: this.isInitialized,
      mobileOptimization: mobileTransitionOptimizer.getTransitionOptimization(),
      pwaSettings: pwaTransitionIntegration.getPWATransitionSettings(),
      deviceCapabilities: mobileTransitionOptimizer.getDeviceCapabilities(),
      networkCondition: mobileTransitionOptimizer.getNetworkCondition()
    };
  }

  /**
   * Cleanup all optimizations
   */
  public destroy(): void {
    this.cleanupFunctions.forEach(cleanup => cleanup());
    this.cleanupFunctions = [];
    this.isInitialized = false;
    
    this.log('Mobile transition optimizations destroyed');
  }
}

// Create and export singleton instance
export const mobileTransitionInitializer = new MobileTransitionInitializer();

// Auto-initialize when module is loaded
if (typeof window !== 'undefined') {
  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      mobileTransitionInitializer.initialize();
    });
  } else {
    mobileTransitionInitializer.initialize();
  }
}

export default MobileTransitionInitializer;