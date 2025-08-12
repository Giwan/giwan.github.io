/**
 * Performance Monitor - Tracks transition performance and provides fallback mechanisms
 * 
 * This module provides:
 * - Frame rate monitoring during transitions
 * - Performance metrics collection
 * - Automatic transition simplification
 * - User preference controls for transition intensity
 */

export interface PerformanceMetrics {
    frameRate: number;
    averageFrameTime: number;
    droppedFrames: number;
    transitionDuration: number;
    memoryUsage?: number;
    cpuUsage?: number;
}

export interface TransitionPerformanceData {
    startTime: number;
    endTime: number;
    frameCount: number;
    droppedFrames: number;
    averageFrameRate: number;
    worstFrameTime: number;
    transitionType: string;
    deviceInfo: DeviceCapabilities;
}

export interface DeviceCapabilities {
    hardwareConcurrency: number;
    deviceMemory?: number;
    connectionType: string;
    isLowPowerMode: boolean;
    prefersReducedMotion: boolean;
}

export enum TransitionIntensity {
    MINIMAL = 'minimal',
    REDUCED = 'reduced',
    NORMAL = 'normal',
    ENHANCED = 'enhanced'
}

export class PerformanceMonitor {
    private frameRateHistory: number[] = [];
    private transitionHistory: TransitionPerformanceData[] = [];
    private currentTransitionData: Partial<TransitionPerformanceData> | null = null;
    private frameRateObserver: any = null;
    private performanceObserver: PerformanceObserver | null = null;
    private isMonitoring: boolean = false;

    // Performance thresholds
    private readonly FRAME_RATE_THRESHOLD = 30; // FPS below which we consider performance poor
    private readonly DROPPED_FRAME_THRESHOLD = 5; // Number of dropped frames that triggers fallback
    private readonly MEMORY_THRESHOLD = 0.8; // 80% memory usage threshold

    constructor() {
        this.initialize();
    }

    /**
     * Initialize performance monitoring
     */
    private initialize(): void {
        if (typeof window === 'undefined') return;

        // Set up frame rate monitoring if supported
        this.setupFrameRateMonitoring();

        // Set up performance observer for transition timing
        this.setupPerformanceObserver();

        // Listen for Astro transition events
        this.setupTransitionEventListeners();
    }

    /**
     * Set up frame rate monitoring using requestAnimationFrame
     */
    private setupFrameRateMonitoring(): void {
        let lastTime = performance.now();
        let frameCount = 0;
        let frameRateSum = 0;

        const measureFrameRate = (currentTime: number) => {
            if (this.isMonitoring) {
                const deltaTime = currentTime - lastTime;
                const currentFrameRate = 1000 / deltaTime;

                frameCount++;
                frameRateSum += currentFrameRate;

                // Update current transition data
                if (this.currentTransitionData) {
                    this.currentTransitionData.frameCount = frameCount;

                    // Track dropped frames (frames taking longer than 16.67ms for 60fps)
                    if (deltaTime > 16.67) {
                        this.currentTransitionData.droppedFrames =
                            (this.currentTransitionData.droppedFrames || 0) + 1;
                    }

                    // Track worst frame time
                    if (!this.currentTransitionData.worstFrameTime ||
                        deltaTime > this.currentTransitionData.worstFrameTime) {
                        this.currentTransitionData.worstFrameTime = deltaTime;
                    }
                }

                // Store frame rate history (keep last 100 frames)
                this.frameRateHistory.push(currentFrameRate);
                if (this.frameRateHistory.length > 100) {
                    this.frameRateHistory.shift();
                }
            }

            lastTime = currentTime;
            requestAnimationFrame(measureFrameRate);
        };

        requestAnimationFrame(measureFrameRate);
    }

    /**
     * Set up performance observer for detailed metrics
     */
    private setupPerformanceObserver(): void {
        if (!('PerformanceObserver' in window)) return;

        try {
            this.performanceObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();

                entries.forEach((entry) => {
                    // Track navigation timing
                    if (entry.entryType === 'navigation') {
                        this.handleNavigationTiming(entry as PerformanceNavigationTiming);
                    }

                    // Track paint timing
                    if (entry.entryType === 'paint') {
                        this.handlePaintTiming(entry as PerformancePaintTiming);
                    }

                    // Track layout shift
                    if (entry.entryType === 'layout-shift') {
                        this.handleLayoutShift(entry as any);
                    }
                });
            });

            // Observe different types of performance entries
            this.performanceObserver.observe({
                entryTypes: ['navigation', 'paint', 'layout-shift']
            });
        } catch (error) {
            console.warn('Performance Observer not fully supported:', error);
        }
    }

    /**
     * Set up Astro transition event listeners
     */
    private setupTransitionEventListeners(): void {
        document.addEventListener('astro:before-preparation', this.handleTransitionStart.bind(this));
        document.addEventListener('astro:after-swap', this.handleTransitionEnd.bind(this));
        document.addEventListener('astro:page-load', this.handlePageLoad.bind(this));
    }

    /**
     * Handle transition start
     */
    private handleTransitionStart(event: Event): void {
        const customEvent = event as CustomEvent;
        const transitionType = this.getTransitionType(customEvent);

        this.startMonitoring(transitionType);
    }

    /**
     * Handle transition end
     */
    private handleTransitionEnd(event: Event): void {
        this.stopMonitoring();
    }

    /**
     * Handle page load completion
     */
    private handlePageLoad(_event: Event): void {
        // Ensure monitoring is stopped
        this.stopMonitoring();
    }

    /**
     * Start monitoring a transition
     */
    public startMonitoring(transitionType: string = 'unknown'): void {
        if (this.isMonitoring) {
            this.stopMonitoring(); // Stop previous monitoring
        }

        this.isMonitoring = true;
        this.currentTransitionData = {
            startTime: performance.now(),
            frameCount: 0,
            droppedFrames: 0,
            transitionType,
            deviceInfo: this.getDeviceCapabilities()
        };
    }

    /**
     * Stop monitoring and record results
     */
    public stopMonitoring(): TransitionPerformanceData | null {
        if (!this.isMonitoring || !this.currentTransitionData) {
            return null;
        }

        this.isMonitoring = false;

        const endTime = performance.now();
        const duration = endTime - (this.currentTransitionData.startTime ?? 0);
        const frameCount = this.currentTransitionData.frameCount || 0;
        const averageFrameRate = frameCount > 0 ? (frameCount / (duration / 1000)) : 0;

        const completedData: TransitionPerformanceData = {
            ...this.currentTransitionData,
            endTime,
            averageFrameRate
        } as TransitionPerformanceData;

        // Store in history
        this.transitionHistory.push(completedData);

        // Keep only last 50 transitions
        if (this.transitionHistory.length > 50) {
            this.transitionHistory.shift();
        }

        // Check if performance is poor and trigger fallback
        this.checkPerformanceAndTriggerFallback(completedData);

        this.currentTransitionData = null;
        return completedData;
    }

    /**
     * Get current performance metrics
     */
    public getCurrentMetrics(): PerformanceMetrics {
        const recentFrameRates = this.frameRateHistory.slice(-30); // Last 30 frames
        const averageFrameRate = recentFrameRates.length > 0
            ? recentFrameRates.reduce((sum, rate) => sum + rate, 0) / recentFrameRates.length
            : 60;

        const averageFrameTime = 1000 / averageFrameRate;
        const droppedFrames = this.currentTransitionData?.droppedFrames || 0;

        return {
            frameRate: Math.round(averageFrameRate),
            averageFrameTime: Math.round(averageFrameTime * 100) / 100,
            droppedFrames,
            transitionDuration: this.currentTransitionData
                ? performance.now() - (this.currentTransitionData.startTime ?? 0)
                : 0,
            memoryUsage: this.getMemoryUsage(),
            cpuUsage: this.getCPUUsage()
        };
    }

    /**
     * Get device capabilities
     */
    private getDeviceCapabilities(): DeviceCapabilities {
        const connection = (navigator as any).connection ||
            (navigator as any).mozConnection ||
            (navigator as any).webkitConnection;

        return {
            hardwareConcurrency: navigator.hardwareConcurrency || 4,
            deviceMemory: (navigator as any).deviceMemory,
            connectionType: connection?.effectiveType || 'unknown',
            isLowPowerMode: this.detectLowPowerMode(),
            prefersReducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
        };
    }

    /**
     * Detect low power mode
     */
    private detectLowPowerMode(): boolean {
        // Multiple indicators of low power mode
        const indicators = [
            navigator.hardwareConcurrency <= 2,
            (navigator as any).deviceMemory && (navigator as any).deviceMemory <= 2,
            window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            this.getAverageFrameRate() < 45
        ];

        return indicators.filter(Boolean).length >= 2;
    }

    /**
     * Get memory usage if available
     */
    private getMemoryUsage(): number | undefined {
        if ('memory' in performance) {
            const memory = (performance as any).memory;
            return memory.usedJSHeapSize / memory.jsHeapSizeLimit;
        }
        return undefined;
    }

    /**
     * Estimate CPU usage based on frame timing
     */
    private getCPUUsage(): number | undefined {
        if (this.frameRateHistory.length < 10) return undefined;

        const recentFrames = this.frameRateHistory.slice(-10);
        const averageFrameRate = recentFrames.reduce((sum, rate) => sum + rate, 0) / recentFrames.length;

        // Rough estimation: lower frame rate indicates higher CPU usage
        const cpuUsage = Math.max(0, Math.min(1, (60 - averageFrameRate) / 30));
        return Math.round(cpuUsage * 100) / 100;
    }

    /**
     * Get average frame rate from recent history
     */
    private getAverageFrameRate(): number {
        if (this.frameRateHistory.length === 0) return 60;

        const recent = this.frameRateHistory.slice(-20);
        return recent.reduce((sum, rate) => sum + rate, 0) / recent.length;
    }

    /**
     * Check performance and trigger fallback if needed
     */
    private checkPerformanceAndTriggerFallback(data: TransitionPerformanceData): void {
        const shouldTriggerFallback =
            data.averageFrameRate < this.FRAME_RATE_THRESHOLD ||
            data.droppedFrames > this.DROPPED_FRAME_THRESHOLD ||
            (this.getMemoryUsage() || 0) > this.MEMORY_THRESHOLD;

        if (shouldTriggerFallback) {
            this.triggerPerformanceFallback(data);
        }
    }

    /**
     * Trigger performance fallback
     */
    private triggerPerformanceFallback(data: TransitionPerformanceData): void {
        const root = document.documentElement;

        // Set performance mode attributes
        root.setAttribute('data-performance-mode', 'low');
        root.setAttribute('data-transition-fallback', 'true');

        // Dispatch custom event for other systems to react
        const fallbackEvent = new CustomEvent('transition-performance-fallback', {
            detail: {
                performanceData: data,
                recommendedIntensity: this.getRecommendedIntensity(data)
            }
        });

        document.dispatchEvent(fallbackEvent);

        // Auto-recover after some time
        setTimeout(() => {
            root.removeAttribute('data-transition-fallback');
            if (this.getAverageFrameRate() > this.FRAME_RATE_THRESHOLD + 10) {
                root.setAttribute('data-performance-mode', 'normal');
            }
        }, 5000);
    }

    /**
     * Get recommended transition intensity based on performance
     */
    public getRecommendedIntensity(data?: TransitionPerformanceData | PerformanceMetrics): TransitionIntensity {
        const currentData = data || this.getCurrentMetrics();
        const deviceCapabilities = this.getDeviceCapabilities();

        // Check for reduced motion preference first
        if (deviceCapabilities.prefersReducedMotion) {
            return TransitionIntensity.MINIMAL;
        }

        // Check device capabilities
        if (deviceCapabilities.isLowPowerMode ||
            deviceCapabilities.hardwareConcurrency <= 2 ||
            (deviceCapabilities.deviceMemory && deviceCapabilities.deviceMemory <= 2)) {
            return TransitionIntensity.REDUCED;
        }

        // Get frame rate from either data type
        const frameRate = 'frameRate' in currentData ? currentData.frameRate : currentData.averageFrameRate;
        const droppedFrames = 'droppedFrames' in currentData ? currentData.droppedFrames : 0;

        // Check current performance
        if (frameRate < 30 || droppedFrames > 5) {
            return TransitionIntensity.REDUCED;
        }

        if (frameRate < 45 || droppedFrames > 2) {
            return TransitionIntensity.NORMAL;
        }

        // High performance device
        if (frameRate >= 55 &&
            deviceCapabilities.hardwareConcurrency >= 8 &&
            (!deviceCapabilities.deviceMemory || deviceCapabilities.deviceMemory >= 8)) {
            return TransitionIntensity.ENHANCED;
        }

        return TransitionIntensity.NORMAL;
    }

    /**
     * Get transition type from event
     */
    private getTransitionType(event: CustomEvent): string {
        const fromPath = event.detail?.from?.pathname || '';
        const toPath = event.detail?.to?.pathname || '';

        // Simple classification based on paths
        if (fromPath.includes('/blog') && toPath.includes('/blog')) {
            return 'blog-navigation';
        }
        if (fromPath.includes('/tools') && toPath.includes('/tools')) {
            return 'tools-navigation';
        }
        if (fromPath === '/' || toPath === '/') {
            return 'home-navigation';
        }

        return 'general-navigation';
    }

    /**
     * Handle navigation timing
     */
    private handleNavigationTiming(entry: PerformanceNavigationTiming): void {
        // Store navigation performance data
        if (this.currentTransitionData && this.currentTransitionData.deviceInfo) {
            // Add navigation-specific metrics if needed
            // Currently no additional metrics to add
        }
    }

    /**
     * Handle paint timing
     */
    private handlePaintTiming(entry: PerformancePaintTiming): void {
        // Track paint events during transitions
        if (this.isMonitoring && entry.name === 'first-contentful-paint') {
            // Could be used to measure transition completion
            // Currently no specific handling needed
        }
    }

    /**
     * Handle layout shift
     */
    private handleLayoutShift(entry: any): void {
        // Track layout shifts during transitions
        if (this.isMonitoring && entry.value > 0.1) {
            // Significant layout shift detected during transition
            console.warn('Layout shift detected during transition:', entry.value);
        }
    }

    /**
     * Get performance history
     */
    public getPerformanceHistory(): TransitionPerformanceData[] {
        return [...this.transitionHistory];
    }

    /**
     * Clear performance history
     */
    public clearHistory(): void {
        this.transitionHistory = [];
        this.frameRateHistory = [];
    }

    /**
     * Cleanup resources
     */
    public destroy(): void {
        this.isMonitoring = false;

        if (this.performanceObserver) {
            this.performanceObserver.disconnect();
            this.performanceObserver = null;
        }

        // Remove event listeners
        document.removeEventListener('astro:before-preparation', this.handleTransitionStart.bind(this));
        document.removeEventListener('astro:after-swap', this.handleTransitionEnd.bind(this));
        document.removeEventListener('astro:page-load', this.handlePageLoad.bind(this));
    }
}

// Create and export singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Export for testing and advanced usage
export default PerformanceMonitor;