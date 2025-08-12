/**
 * Tests for useAccessibility hook
 */

import { renderHook, act } from '@testing-library/react';
import { useAccessibility } from '../useAccessibility';
import { accessibilityManager } from '../../utils/accessibilityManager';

// Mock the accessibility manager
jest.mock('../../utils/accessibilityManager', () => ({
  accessibilityManager: {
    getPreferences: jest.fn(),
    updatePreferences: jest.fn(),
    announce: jest.fn(),
  },
}));

const mockAccessibilityManager = accessibilityManager as jest.Mocked<typeof accessibilityManager>;

// Mock window.matchMedia
const mockMatchMedia = jest.fn();
Object.defineProperty(window, 'matchMedia', {
  value: mockMatchMedia,
});

beforeEach(() => {
  jest.clearAllMocks();
  
  // Default preferences
  mockAccessibilityManager.getPreferences.mockReturnValue({
    reducedMotion: false,
    screenReaderAnnouncements: true,
    focusManagement: true,
    keyboardNavigation: true,
  });

  // Mock media query
  mockMatchMedia.mockReturnValue({
    matches: false,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  });
});

describe('useAccessibility', () => {
  it('should return initial preferences', () => {
    const { result } = renderHook(() => useAccessibility());

    expect(result.current.preferences).toEqual({
      reducedMotion: false,
      screenReaderAnnouncements: true,
      focusManagement: true,
      keyboardNavigation: true,
    });
  });

  it('should update preferences', () => {
    const { result } = renderHook(() => useAccessibility());

    act(() => {
      result.current.updatePreferences({ reducedMotion: true });
    });

    expect(mockAccessibilityManager.updatePreferences).toHaveBeenCalledWith({
      reducedMotion: true,
    });
  });

  it('should toggle reduced motion', () => {
    const { result } = renderHook(() => useAccessibility());

    act(() => {
      result.current.toggleReducedMotion();
    });

    expect(mockAccessibilityManager.updatePreferences).toHaveBeenCalledWith({
      reducedMotion: true,
    });
  });

  it('should toggle screen reader announcements', () => {
    const { result } = renderHook(() => useAccessibility());

    act(() => {
      result.current.toggleScreenReaderAnnouncements();
    });

    expect(mockAccessibilityManager.updatePreferences).toHaveBeenCalledWith({
      screenReaderAnnouncements: false,
    });
  });

  it('should toggle focus management', () => {
    const { result } = renderHook(() => useAccessibility());

    act(() => {
      result.current.toggleFocusManagement();
    });

    expect(mockAccessibilityManager.updatePreferences).toHaveBeenCalledWith({
      focusManagement: false,
    });
  });

  it('should toggle keyboard navigation', () => {
    const { result } = renderHook(() => useAccessibility());

    act(() => {
      result.current.toggleKeyboardNavigation();
    });

    expect(mockAccessibilityManager.updatePreferences).toHaveBeenCalledWith({
      keyboardNavigation: false,
    });
  });

  it('should announce messages', () => {
    const { result } = renderHook(() => useAccessibility());

    const announcement = {
      message: 'Test announcement',
      priority: 'polite' as const,
    };

    act(() => {
      result.current.announce(announcement);
    });

    expect(mockAccessibilityManager.announce).toHaveBeenCalledWith(announcement);
  });

  it('should return isReducedMotion based on preferences', () => {
    mockAccessibilityManager.getPreferences.mockReturnValue({
      reducedMotion: true,
      screenReaderAnnouncements: true,
      focusManagement: true,
      keyboardNavigation: true,
    });

    const { result } = renderHook(() => useAccessibility());

    expect(result.current.isReducedMotion).toBe(true);
  });

  it('should listen for media query changes', () => {
    const mockAddEventListener = jest.fn();
    const mockRemoveEventListener = jest.fn();

    mockMatchMedia.mockReturnValue({
      matches: false,
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener,
    });

    const { unmount } = renderHook(() => useAccessibility());

    expect(mockAddEventListener).toHaveBeenCalledWith('change', expect.any(Function));

    unmount();

    expect(mockRemoveEventListener).toHaveBeenCalledWith('change', expect.any(Function));
  });
});