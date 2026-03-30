import {setTimeout} from 'node:timers/promises';

/**
 * Tests for TransitionErrorHandler
 * Simplified tests focusing on core functionality
 */
import {TransitionErrorHandler} from '../transitionErrorHandler';

// Mock DOM environment
const noop = () => {};

// Mock DOM environment
const mockDocument = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    documentElement: {
        setAttribute: jest.fn(),
        removeAttribute: jest.fn(),
        style: {
            setProperty: jest.fn(),
            removeProperty: jest.fn(),
        },
    },
    querySelector: jest.fn(),
    head: {
        appendChild: jest.fn(),
    },
    createElement: jest.fn(() => ({
        setAttribute: jest.fn(),
        style: {},
        onerror: null,
    })),
    dispatchEvent: jest.fn(),
};

const mockWindow = {
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    location: {
        pathname: '/test',
    },
    matchMedia: jest.fn(() => ({
        matches: false,
    })),
    performance: {
        now: jest.fn(() => Date.now()),
    },
    navigator: {
        userAgent: 'test-agent',
        hardwareConcurrency: 4,
    },
    requestAnimationFrame: jest.fn((cb) => setTimeout(cb, 16)),
    innerWidth: 1024,
    innerHeight: 768,
};

describe('TransitionErrorHandler', () => {
    let errorHandler: TransitionErrorHandler;
    let consoleSpy: {
        log: jest.SpyInstance;
        warn: jest.SpyInstance;
        error: jest.SpyInstance;
    };
    
    beforeAll(() => {
        // Mock global objects before any tests run
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        globalThis.document = mockDocument as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        globalThis.window = mockWindow as any;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        globalThis.navigator = mockWindow.navigator as any;
        // Mock console methods to suppress output during tests
        consoleSpy = {
            log: jest
                .spyOn(console, 'log')
                .mockImplementation(noop),
            warn: jest
                .spyOn(console, 'warn')
                .mockImplementation(noop),
            error: jest
                .spyOn(console, 'error')
                .mockImplementation(noop),
        };
    });

    afterAll(() => {
        // Restore console methods
        consoleSpy.log.mockRestore();
        consoleSpy.warn.mockRestore();
        consoleSpy.error.mockRestore();
    });

    beforeEach(() => {
        // Reset mocks
        jest.clearAllMocks();
        // Create new instance
        errorHandler = new TransitionErrorHandler();
    });

    afterEach(() => {
        if (errorHandler)
            errorHandler.destroy();
    });

    describe('basic functionality', () => {
        it('should initialize without errors', () => {
            expect(errorHandler).toBeDefined();
            expect(typeof errorHandler.getDebugInfo).toBe('function');
            expect(typeof errorHandler.getErrorHistory).toBe('function');
        });

        it('should provide debug information', () => {
            const debugInfo = errorHandler.getDebugInfo();

            expect(debugInfo).toHaveProperty('apiSupported');
            expect(debugInfo).toHaveProperty('currentPath');
            expect(debugInfo).toHaveProperty('transitionInProgress');
            expect(debugInfo).toHaveProperty('errorHistory');
            expect(debugInfo).toHaveProperty('deviceCapabilities');
        });

        it('should detect API support correctly', () => {
            // Default should be false (no startViewTransition)
            let debugInfo = errorHandler.getDebugInfo();
            expect(debugInfo.apiSupported).toBe(false);
            // Add startViewTransition and check again
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (globalThis.document as any).startViewTransition = jest.fn();
            debugInfo = errorHandler.getDebugInfo();
            expect(debugInfo.apiSupported).toBe(true);
            // Clean up
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            delete (globalThis.document as any).startViewTransition;
        });
    });

    describe('error tracking', () => {
        it('should track error history', () => {
            const initialHistory = errorHandler.getErrorHistory();
            expect(Array.isArray(initialHistory)).toBe(true);
            expect(initialHistory).toHaveLength(0);
                        // Force an error
            errorHandler.forceFallback('test-error');

            const updatedHistory = errorHandler.getErrorHistory();
            expect(updatedHistory.length).toBeGreaterThan(0);
            expect(updatedHistory[0].message).toContain('test-error');
        });

        it('should clear error history', () => {
            // Add an error
            errorHandler.forceFallback('test-error');
            expect(errorHandler.getErrorHistory()).toHaveLength(1);
                        // Clear history
            errorHandler.clearErrorHistory();
            expect(errorHandler.getErrorHistory()).toHaveLength(0);
        });

        it('should limit error history size', () => {
            // Add many errors
            for (let i = 0; i < 60; i++) {
                errorHandler.forceFallback(`test-error-${i}`);
            }

            const history = errorHandler.getErrorHistory();
            expect(history.length).toBeLessThanOrEqual(50);
        });
    });

    describe('debug mode', () => {
        it('should enable and disable debug mode without errors', () => {
            expect(() => {
                errorHandler.enableDebugMode();
                errorHandler.disableDebugMode();
            }).not.toThrow();
        });

        it('should update fallback options', () => {
            const newOptions = {
                useAstroBuiltIn: false,
                disableAnimations: true,
                enableDebugMode: true,
                timeoutMs: 3000,
            };

            expect(() => {
                errorHandler.updateFallbackOptions(newOptions);
            }).not.toThrow();
        });
    });

    describe('device capabilities', () => {
        it('should collect device capabilities safely', () => {
            const debugInfo = errorHandler.getDebugInfo();

            expect(debugInfo.deviceCapabilities).toHaveProperty('userAgent');
            expect(debugInfo.deviceCapabilities).toHaveProperty('hardwareConcurrency');
            expect(debugInfo.deviceCapabilities).toHaveProperty('prefersReducedMotion');
            expect(debugInfo.deviceCapabilities).toHaveProperty('viewportSize');
        });
    });

    describe('test utilities', () => {
        it('should handle test mode correctly', () => {
            // Should not throw in any mode
            expect(() => {
                errorHandler.testErrorHandling();
            }).not.toThrow();

            // Should warn when not in debug mode
            expect(consoleSpy.warn).toHaveBeenCalledWith('[TransitionErrorHandler] Test methods only available in debug mode');
        });

        it('should work in debug mode', () => {
            // Enable debug mode first
            errorHandler.enableDebugMode();
                        // Should not throw and should not warn
            expect(() => {
                errorHandler.testErrorHandling();
            }).not.toThrow();

            // Should have logged debug info but not warned about debug mode
            expect(consoleSpy.log).toHaveBeenCalled();
        });
    });
});
