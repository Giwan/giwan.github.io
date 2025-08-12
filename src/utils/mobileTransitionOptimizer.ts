/**
 * Mobile and PWA Transition Optimizer
 * 
 * This utility provides mobile-specific optimizations for view transitions:
 * - Device orientation change handling
 * - Network condition awareness
 * - Battery level monitoring
 * - PWA-specific behaviors
 */

export interface DeviceCapabilities {
  isMobile: boolean;
  isTablet: boolean;
  isPWA: boolean;
  orientation: 'portrait' | 'landscape';
  connectionType: string;
  batteryLevel?: number;
  isLowBattery: boolean;
  hardwareConcurrency: number;
  deviceMemory?: number;
}

export interface NetworkCondition {
  effectiveType: '2g' | '3g' | '4g' | 'slow-2g' | 'unknown';
  downlink: number;
  rtt: number;
  saveData: boolean;
}

export interface TransitionOptimization {
  shouldOptimize: boolean;
  optimizationType: 'reduce' | 'simplify' | 'disable';
  recommendedDuration: number;
  recommendedEasing: string;
}

export class MobileTransitionOptimizer {
  private deviceCapabilities: DeviceCapabilities;
  private networkCondition: NetworkCondition;
  private orientationChangeListeners: Set<() => void> = new Set();
  private networkChangeListeners: Set<(condition: NetworkCondition) => void> = new Set();
  private batteryChangeListeners: Set<(isLow: boolean) => void> = new Set();
  private isInitialized = false;

  constructor() {
    this.deviceCapabilities = this.detectDeviceCapabilities();
    this.networkCondition = this.detectNetworkCondition();
    this.initialize();
  }

  /**
   * Initialize the optimizer and set up event listeners
   */
  private initialize(): void {
    if (typeof window === 'undefined' || this.isInitialized) {
      return;
    }

    // Set up orientation change handling
    this.setupOrientationChangeHandling();
    
    // Set up network condition monitoring
    this.setupNetworkMonitoring();
    
    // Set up battery monitoring
    this.setupBatteryMonitoring();
    
    // Apply initial optimizations
    this.applyOptimizations();
    
    this.isInitialized = true;
  }

  /**
   * Detect device capabilities
   */
  private detectDeviceCapabilities(): DeviceCapabilities {
    // Handle server-side rendering
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        isMobile: false,
        isTablet: false,
        isPWA: false,
        orientation: 'portrait',
        connectionType: 'unknown',
        isLowBattery: false,
        hardwareConcurrency: 4,
        deviceMemory: undefined
      };
    }

    const userAgent = (typeof navigator !== 'undefined') ? navigator.userAgent.toLowerCase() : '';
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);
    const isTablet = /ipad|android(?!.*mobile)/i.test(userAgent);
    const isPWA = (typeof window !== 'undefined' && window.matchMedia) 
      ? window.matchMedia('(display-mode: standalone)').matches || 
        (window.navigator as any).standalone === true
      : false;
    
    const orientation = (typeof window !== 'undefined') 
      ? (window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
      : 'portrait';
    const hardwareConcurrency = (typeof navigator !== 'undefined') ? (navigator.hardwareConcurrency || 4) : 4;
    const deviceMemory = (typeof navigator !== 'undefined') ? (navigator as any).deviceMemory : undefined;
    
    // Get connection info
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;
    const connectionType = connection?.effectiveType || 'unknown';

    return {
      isMobile,
      isTablet,
      isPWA,
      orientation,
      connectionType,
      isLowBattery: false, // Will be updated by battery monitoring
      hardwareConcurrency,
      deviceMemory
    };
  }

  /**
   * Detect network condition
   */
  private detectNetworkCondition(): NetworkCondition {
    // Handle server-side rendering
    if (typeof window === 'undefined' || typeof navigator === 'undefined') {
      return {
        effectiveType: 'unknown',
        downlink: 10,
        rtt: 100,
        saveData: false
      };
    }

    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    if (!connection) {
      return {
        effectiveType: 'unknown',
        downlink: 10,
        rtt: 100,
        saveData: false
      };
    }

    return {
      effectiveType: connection.effectiveType || 'unknown',
      downlink: connection.downlink || 10,
      rtt: connection.rtt || 100,
      saveData: connection.saveData || false
    };
  }

  /**
   * Set up orientation change handling
   */
  private setupOrientationChangeHandling(): void {
    const handleOrientationChange = () => {
      const newOrientation = (typeof window !== 'undefined') 
        ? (window.innerHeight > window.innerWidth ? 'portrait' : 'landscape')
        : 'portrait';
      
      if (newOrientation !== this.deviceCapabilities.orientation) {
        this.deviceCapabilities.orientation = newOrientation;
        
        // Apply orientation-specific optimizations
        this.applyOrientationOptimizations(newOrientation);
        
        // Notify listeners
        this.orientationChangeListeners.forEach(listener => listener());
      }
    };

    // Use both orientationchange and resize for better compatibility
    if (typeof window !== 'undefined') {
      window.addEventListener('orientationchange', handleOrientationChange);
      window.addEventListener('resize', handleOrientationChange);
    }
    
    // Handle Astro transition events during orientation changes
    document.addEventListener('astro:before-preparation', (event) => {
      if (this.isOrientationChanging()) {
        this.optimizeForOrientationChange();
      }
    });
  }

  /**
   * Set up network condition monitoring
   */
  private setupNetworkMonitoring(): void {
    const connection = (navigator as any).connection || 
                      (navigator as any).mozConnection || 
                      (navigator as any).webkitConnection;

    if (!connection) {
      return;
    }

    const handleNetworkChange = () => {
      const newCondition = this.detectNetworkCondition();
      
      if (newCondition.effectiveType !== this.networkCondition.effectiveType) {
        this.networkCondition = newCondition;
        
        // Apply network-specific optimizations
        this.applyNetworkOptimizations(newCondition);
        
        // Notify listeners
        this.networkChangeListeners.forEach(listener => listener(newCondition));
      }
    };

    if (connection && typeof connection.addEventListener === 'function') {
      connection.addEventListener('change', handleNetworkChange);
    }
  }

  /**
   * Set up battery monitoring
   */
  private setupBatteryMonitoring(): void {
    if (typeof navigator !== 'undefined' && 'getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          const isLowBattery = battery.level < 0.2 || battery.charging === false && battery.level < 0.3;
          
          if (isLowBattery !== this.deviceCapabilities.isLowBattery) {
            this.deviceCapabilities.isLowBattery = isLowBattery;
            this.deviceCapabilities.batteryLevel = battery.level;
            
            // Apply battery-specific optimizations
            this.applyBatteryOptimizations(isLowBattery);
            
            // Notify listeners
            this.batteryChangeListeners.forEach(listener => listener(isLowBattery));
          }
        };

        // Initial check
        updateBatteryStatus();

        // Listen for battery changes
        if (battery && typeof battery.addEventListener === 'function') {
          battery.addEventListener('levelchange', updateBatteryStatus);
          battery.addEventListener('chargingchange', updateBatteryStatus);
        }
      }).catch((error: Error) => {
        console.warn('Battery API not available:', error);
      });
    }
  }

  /**
   * Check if orientation is currently changing
   */
  private isOrientationChanging(): boolean {
    // Simple heuristic: if the aspect ratio is close to square, we might be mid-rotation
    const aspectRatio = (typeof window !== 'undefined') 
      ? window.innerWidth / window.innerHeight 
      : 1;
    return Math.abs(aspectRatio - 1) < 0.2;
  }

  /**
   * Apply orientation-specific optimizations
   */
  private applyOrientationOptimizations(orientation: 'portrait' | 'landscape'): void {
    const root = document.documentElement;
    
    root.setAttribute('data-orientation', orientation);
    
    // Apply CSS custom properties for orientation
    if (orientation === 'landscape') {
      root.style.setProperty('--transition-scale-factor', '0.8');
    } else {
      root.style.setProperty('--transition-scale-factor', '1');
    }
  }

  /**
   * Apply network-specific optimizations
   */
  private applyNetworkOptimizations(condition: NetworkCondition): void {
    const root = document.documentElement;
    
    root.setAttribute('data-connection', condition.effectiveType);
    root.setAttribute('data-save-data', condition.saveData.toString());
    
    // Apply network-aware CSS properties
    if (condition.effectiveType === 'slow-2g' || condition.effectiveType === '2g') {
      root.style.setProperty('--transition-duration-fast', '100ms');
      root.style.setProperty('--transition-duration-normal', '150ms');
      root.style.setProperty('--transition-duration-slow', '200ms');
    } else if (condition.effectiveType === '3g') {
      root.style.setProperty('--transition-duration-fast', '120ms');
      root.style.setProperty('--transition-duration-normal', '200ms');
      root.style.setProperty('--transition-duration-slow', '300ms');
    }
  }

  /**
   * Apply battery-specific optimizations
   */
  private applyBatteryOptimizations(isLowBattery: boolean): void {
    const root = document.documentElement;
    
    root.setAttribute('data-battery-low', isLowBattery.toString());
    
    if (isLowBattery) {
      // Reduce transition durations to save battery
      root.style.setProperty('--transition-duration-fast', '100ms');
      root.style.setProperty('--transition-duration-normal', '150ms');
      root.style.setProperty('--transition-duration-slow', '200ms');
    }
  }

  /**
   * Optimize transitions for orientation changes
   */
  private optimizeForOrientationChange(): void {
    const root = document.documentElement;
    
    // Temporarily disable complex transitions during orientation change
    root.setAttribute('data-orientation-changing', 'true');
    
    // Re-enable after orientation change completes
    setTimeout(() => {
      root.removeAttribute('data-orientation-changing');
    }, 500);
  }

  /**
   * Apply all optimizations based on current conditions
   */
  private applyOptimizations(): void {
    this.applyOrientationOptimizations(this.deviceCapabilities.orientation);
    this.applyNetworkOptimizations(this.networkCondition);
    this.applyBatteryOptimizations(this.deviceCapabilities.isLowBattery);
    
    // Apply device-specific optimizations
    const root = document.documentElement;
    
    if (this.deviceCapabilities.isMobile) {
      root.setAttribute('data-device-type', 'mobile');
    } else if (this.deviceCapabilities.isTablet) {
      root.setAttribute('data-device-type', 'tablet');
    } else {
      root.setAttribute('data-device-type', 'desktop');
    }
    
    if (this.deviceCapabilities.isPWA) {
      root.setAttribute('data-pwa', 'true');
    }
    
    // Apply hardware-based optimizations
    if (this.deviceCapabilities.hardwareConcurrency <= 2) {
      root.setAttribute('data-low-power', 'true');
    }
    
    if (this.deviceCapabilities.deviceMemory && this.deviceCapabilities.deviceMemory <= 2) {
      root.setAttribute('data-low-memory', 'true');
    }
  }

  /**
   * Get transition optimization recommendations
   */
  public getTransitionOptimization(): TransitionOptimization {
    let shouldOptimize = false;
    let optimizationType: 'reduce' | 'simplify' | 'disable' = 'reduce';
    let recommendedDuration = 300;
    let recommendedEasing = 'cubic-bezier(0.4, 0.0, 0.2, 1)';

    // Check for conditions that require optimization
    if (this.deviceCapabilities.isLowBattery) {
      shouldOptimize = true;
      optimizationType = 'simplify';
      recommendedDuration = 150;
    }

    if (this.networkCondition.effectiveType === 'slow-2g' || this.networkCondition.effectiveType === '2g') {
      shouldOptimize = true;
      optimizationType = 'simplify';
      recommendedDuration = 100;
    }

    if (this.deviceCapabilities.hardwareConcurrency <= 2) {
      shouldOptimize = true;
      optimizationType = 'reduce';
      recommendedDuration = 200;
    }

    // PWA optimizations
    if (this.deviceCapabilities.isPWA) {
      recommendedDuration = Math.max(recommendedDuration * 0.9, 100);
      recommendedEasing = 'cubic-bezier(0.2, 0, 0, 1)';
    }

    // Mobile optimizations
    if (this.deviceCapabilities.isMobile) {
      recommendedEasing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    }

    return {
      shouldOptimize,
      optimizationType,
      recommendedDuration,
      recommendedEasing
    };
  }

  /**
   * Add orientation change listener
   */
  public onOrientationChange(listener: () => void): () => void {
    this.orientationChangeListeners.add(listener);
    
    return () => {
      this.orientationChangeListeners.delete(listener);
    };
  }

  /**
   * Add network change listener
   */
  public onNetworkChange(listener: (condition: NetworkCondition) => void): () => void {
    this.networkChangeListeners.add(listener);
    
    return () => {
      this.networkChangeListeners.delete(listener);
    };
  }

  /**
   * Add battery change listener
   */
  public onBatteryChange(listener: (isLow: boolean) => void): () => void {
    this.batteryChangeListeners.add(listener);
    
    return () => {
      this.batteryChangeListeners.delete(listener);
    };
  }

  /**
   * Get current device capabilities
   */
  public getDeviceCapabilities(): DeviceCapabilities {
    return { ...this.deviceCapabilities };
  }

  /**
   * Get current network condition
   */
  public getNetworkCondition(): NetworkCondition {
    return { ...this.networkCondition };
  }

  /**
   * Check if device is suitable for complex transitions
   */
  public canHandleComplexTransitions(): boolean {
    return !this.deviceCapabilities.isLowBattery &&
           this.networkCondition.effectiveType !== 'slow-2g' &&
           this.networkCondition.effectiveType !== '2g' &&
           this.deviceCapabilities.hardwareConcurrency > 2;
  }

  /**
   * Get PWA-specific transition settings
   */
  public getPWATransitionSettings(): { duration: number; easing: string } {
    if (!this.deviceCapabilities.isPWA) {
      return { duration: 300, easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)' };
    }

    const optimization = this.getTransitionOptimization();
    
    return {
      duration: optimization.recommendedDuration,
      easing: 'cubic-bezier(0.2, 0, 0, 1)' // Native app-like easing
    };
  }

  /**
   * Cleanup event listeners
   */
  public destroy(): void {
    this.orientationChangeListeners.clear();
    this.networkChangeListeners.clear();
    this.batteryChangeListeners.clear();
    this.isInitialized = false;
  }
}

// Create and export singleton instance
export const mobileTransitionOptimizer = new MobileTransitionOptimizer();

export default MobileTransitionOptimizer;