import type { DeviceCapabilities } from './types';

/**
 * Detect device capabilities for transition optimization
 */
export function detectDeviceCapabilities(): DeviceCapabilities {
    if (typeof window === 'undefined') {
        return {
            cpuCores: 4,
            memoryGB: 4,
            gpuTier: 'medium',
            screenRefreshRate: 60,
            supportedFeatures: []
        };
    }

    const cpuCores = navigator.hardwareConcurrency || 4;
    const memoryGB = (navigator as any).deviceMemory || 4;

    // Estimate GPU tier based on available information
    const gpuTier = estimateGPUTier();

    // Detect screen refresh rate
    const screenRefreshRate = detectRefreshRate();

    // Detect supported features
    const supportedFeatures = detectSupportedFeatures();

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
export function estimateGPUTier(): 'low' | 'medium' | 'high' {
    if (typeof document === 'undefined') return 'medium';

    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;

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
export function detectRefreshRate(): number {
    // Default to 60Hz, could be enhanced with more sophisticated detection
    return 60;
}

/**
 * Detect supported features
 */
export function detectSupportedFeatures(): string[] {
    if (typeof document === 'undefined') return [];

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
    if (typeof CSS !== 'undefined' && CSS.supports('contain', 'layout')) {
        features.push('css-containment');
    }

    // Check for will-change support
    if (typeof CSS !== 'undefined' && CSS.supports('will-change', 'transform')) {
        features.push('will-change');
    }

    // Check for transform3d support
    if (typeof CSS !== 'undefined' && CSS.supports('transform', 'translate3d(0, 0, 0)')) {
        features.push('transform3d');
    }

    return features;
}
