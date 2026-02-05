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
