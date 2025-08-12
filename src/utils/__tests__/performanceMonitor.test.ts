/**
 * Performance Monitor Tests
 * 
 * Tests for the performance monitoring and fallback system
 */

import { PerformanceMonitor, TransitionIntensity } from '../performanceMonitor';

// Mock browser APIs
const mockPerformance = {
  now: jest.fn(() => Date.now()),
  memory: {
    usedJSHeapSize: 50000000,
    jsHeapSizeLimit: 100000000
  }
};

const mockNavigator = {
  hardwareConcurrency: 4,
  deviceMemory: 8,
  connection: {
    effectiveType: '4g'
  },
  vibrate: jest.fn()
};

const mockMatchMedia = jest.fn((query: string) => ({
  matches: query.includes('reduce'),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn()
}));

const mockRequestAnimationFrame = jest.fn((callback: FrameRequestCallback) => {
  setTimeout(() => callback(performance.now()), 16);
  return 1;
});

// Setup global mocks
Object.defineProperty(global, 'performance', {
  value: mockPerformance,
  writable: true
});

Object.defineProperty(global, 'navigator', {
  value: mockNavigator,
  writable: true
});

Object.defineProperty(global, 'window', {
  value: {
    matchMedia: mockMatchMedia,
    requestAnimationFrame: mockRequestAnimationFrame,
    AudioContext: jest.fn(),
    webkitAudioContext: jest.fn()
  },
  writable: true
});

Object.defineProperty(global, 'document', {
  value: {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    documentElement: {
      setAttribute: jest.fn(),
      removeAttribute: jest.fn(),
      style: {
        setProperty: jest.fn(),
        removeProperty: jest.fn()
      }
    },
    dispatchEvent: jest.fn()
  },
  writable: true
});

describe('PerformanceMonitor', () => {
  let monitor: PerformanceMonitor;

  beforeEach(() => {
    jest.clearAllMocks();
    monitor = new PerformanceMonitor();
  });

  afterEach(() => {
    monitor.destroy();
  });

  describe('initialization', () => {
    it('should initialize without errors', () => {
      expect(monitor).toBeInstanceOf(PerformanceMonitor);
    });

    it('should set up event listeners', () => {
      expect(document.addEventListener).toHaveBeenCalledWith(
        'astro:before-preparation',
        expect.any(Function)
      );
      expect(document.addEventListener).toHaveBeenCalledWith(
        'astro:after-swap',
        expect.any(Function)
      );
    });
  });

  describe('monitoring lifecycle', () => {
    it('should start monitoring', () => {
      monitor.startMonitoring('test-transition');
      const metrics = monitor.getCurrentMetrics();
      
      expect(metrics.transitionDuration).toBeGreaterThanOrEqual(0);
    });

    it('should stop monitoring and return data', async () => {
      monitor.startMonitoring('test-transition');
      
      // Simulate some time passing
      await new Promise(resolve => setTimeout(resolve, 10));
      
      const result = monitor.stopMonitoring();
      
      expect(result).toBeDefined();
      expect(result?.transitionType).toBe('test-transition');
      expect(result?.endTime).toBeGreaterThanOrEqual(result?.startTime || 0);
    });

    it('should handle multiple start/stop cycles', () => {
      monitor.startMonitoring('transition-1');
      const result1 = monitor.stopMonitoring();
      
      monitor.startMonitoring('transition-2');
      const result2 = monitor.stopMonitoring();
      
      expect(result1?.transitionType).toBe('transition-1');
      expect(result2?.transitionType).toBe('transition-2');
    });
  });

  describe('performance metrics', () => {
    it('should provide current metrics', () => {
      const metrics = monitor.getCurrentMetrics();
      
      expect(metrics).toHaveProperty('frameRate');
      expect(metrics).toHaveProperty('averageFrameTime');
      expect(metrics).toHaveProperty('droppedFrames');
      expect(metrics).toHaveProperty('transitionDuration');
      expect(metrics.frameRate).toBeGreaterThan(0);
    });

    it('should calculate memory usage when available', () => {
      const metrics = monitor.getCurrentMetrics();
      
      expect(metrics.memoryUsage).toBeDefined();
      expect(metrics.memoryUsage).toBe(0.5); // 50MB / 100MB
    });

    it('should estimate CPU usage', () => {
      // Add some frame rate history to enable CPU usage calculation
      for (let i = 0; i < 15; i++) {
        (monitor as any).frameRateHistory.push(45 + Math.random() * 10);
      }
      
      const metrics = monitor.getCurrentMetrics();
      
      expect(metrics.cpuUsage).toBeDefined();
      expect(typeof metrics.cpuUsage).toBe('number');
    });
  });

  describe('device capabilities', () => {
    it('should detect device capabilities', () => {
      monitor.startMonitoring('test');
      const result = monitor.stopMonitoring();
      
      expect(result?.deviceInfo).toBeDefined();
      expect(result?.deviceInfo.hardwareConcurrency).toBe(4);
      expect(result?.deviceInfo.deviceMemory).toBe(8);
      expect(result?.deviceInfo.connectionType).toBe('4g');
    });

    it('should detect low power mode', () => {
      // Mock low power indicators
      Object.defineProperty(global, 'navigator', {
        value: {
          ...mockNavigator,
          hardwareConcurrency: 2,
          deviceMemory: 2
        },
        writable: true
      });

      const newMonitor = new PerformanceMonitor();
      newMonitor.startMonitoring('test');
      const result = newMonitor.stopMonitoring();
      
      expect(result?.deviceInfo.isLowPowerMode).toBe(true);
      newMonitor.destroy();
    });

    it('should respect reduced motion preference', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });

      const newMonitor = new PerformanceMonitor();
      newMonitor.startMonitoring('test');
      const result = newMonitor.stopMonitoring();
      
      expect(result?.deviceInfo.prefersReducedMotion).toBe(true);
      newMonitor.destroy();
    });
  });

  describe('performance recommendations', () => {
    it('should recommend minimal intensity for reduced motion', () => {
      mockMatchMedia.mockReturnValue({
        matches: true,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });

      const newMonitor = new PerformanceMonitor();
      const intensity = newMonitor.getRecommendedIntensity();
      
      expect(intensity).toBe(TransitionIntensity.MINIMAL);
      newMonitor.destroy();
    });

    it('should recommend reduced intensity for low-end devices', () => {
      // Reset mockMatchMedia to not match reduced motion
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });

      Object.defineProperty(global, 'navigator', {
        value: {
          ...mockNavigator,
          hardwareConcurrency: 2,
          deviceMemory: 2
        },
        writable: true
      });

      const newMonitor = new PerformanceMonitor();
      const intensity = newMonitor.getRecommendedIntensity();
      
      expect(intensity).toBe(TransitionIntensity.REDUCED);
      newMonitor.destroy();
    });

    it('should recommend enhanced intensity for high-end devices', () => {
      // Reset mockMatchMedia to not match reduced motion
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });

      Object.defineProperty(global, 'navigator', {
        value: {
          ...mockNavigator,
          hardwareConcurrency: 8,
          deviceMemory: 16
        },
        writable: true
      });

      const newMonitor = new PerformanceMonitor();
      
      // Mock high frame rate
      const metrics = {
        frameRate: 60,
        averageFrameTime: 16.67,
        droppedFrames: 0,
        transitionDuration: 0
      };
      
      const intensity = newMonitor.getRecommendedIntensity(metrics as any);
      
      expect(intensity).toBe(TransitionIntensity.ENHANCED);
      newMonitor.destroy();
    });

    it('should recommend normal intensity for average performance', () => {
      // Reset mockMatchMedia to not match reduced motion
      mockMatchMedia.mockReturnValue({
        matches: false,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn()
      });

      const metrics = {
        frameRate: 50,
        averageFrameTime: 20,
        droppedFrames: 1,
        transitionDuration: 0
      };
      
      const intensity = monitor.getRecommendedIntensity(metrics as any);
      
      expect(intensity).toBe(TransitionIntensity.NORMAL);
    });
  });

  describe('performance fallback', () => {
    it('should trigger fallback for poor performance', () => {
      const mockDispatchEvent = jest.spyOn(document, 'dispatchEvent');
      
      monitor.startMonitoring('test');
      
      // Simulate poor performance data
      const poorPerformanceData = {
        startTime: 0,
        endTime: 1000,
        frameCount: 15, // Low frame count
        droppedFrames: 10, // High dropped frames
        averageFrameRate: 15, // Low FPS
        worstFrameTime: 100,
        transitionType: 'test',
        deviceInfo: {
          hardwareConcurrency: 4,
          connectionType: '4g',
          isLowPowerMode: false,
          prefersReducedMotion: false
        }
      };
      
      // Manually trigger the performance check
      (monitor as any).checkPerformanceAndTriggerFallback(poorPerformanceData);
      
      expect(mockDispatchEvent).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'transition-performance-fallback'
        })
      );
    });
  });

  describe('history management', () => {
    it('should maintain performance history', () => {
      monitor.startMonitoring('test-1');
      monitor.stopMonitoring();
      
      monitor.startMonitoring('test-2');
      monitor.stopMonitoring();
      
      const history = monitor.getPerformanceHistory();
      
      expect(history).toHaveLength(2);
      expect(history[0].transitionType).toBe('test-1');
      expect(history[1].transitionType).toBe('test-2');
    });

    it('should limit history size', () => {
      // Add more than the limit (50)
      for (let i = 0; i < 55; i++) {
        monitor.startMonitoring(`test-${i}`);
        monitor.stopMonitoring();
      }
      
      const history = monitor.getPerformanceHistory();
      
      expect(history).toHaveLength(50);
      expect(history[0].transitionType).toBe('test-5'); // First 5 should be removed
    });

    it('should clear history', () => {
      monitor.startMonitoring('test');
      monitor.stopMonitoring();
      
      expect(monitor.getPerformanceHistory()).toHaveLength(1);
      
      monitor.clearHistory();
      
      expect(monitor.getPerformanceHistory()).toHaveLength(0);
    });
  });

  describe('cleanup', () => {
    it('should cleanup resources on destroy', () => {
      const mockRemoveEventListener = jest.spyOn(document, 'removeEventListener');
      
      monitor.destroy();
      
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'astro:before-preparation',
        expect.any(Function)
      );
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'astro:after-swap',
        expect.any(Function)
      );
    });
  });
});