/**
 * Tests for AccessibilityControls component
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { AccessibilityControls } from '../AccessibilityControls';
import { useAccessibility } from '../../hooks/useAccessibility';

// Mock the useAccessibility hook
jest.mock('../../hooks/useAccessibility');

const mockUseAccessibility = useAccessibility as jest.MockedFunction<typeof useAccessibility>;

const mockAccessibilityHook = {
  preferences: {
    reducedMotion: false,
    screenReaderAnnouncements: true,
    focusManagement: true,
    keyboardNavigation: true,
  },
  updatePreferences: jest.fn(),
  announce: jest.fn(),
  isReducedMotion: false,
  toggleReducedMotion: jest.fn(),
  toggleScreenReaderAnnouncements: jest.fn(),
  toggleFocusManagement: jest.fn(),
  toggleKeyboardNavigation: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseAccessibility.mockReturnValue(mockAccessibilityHook);
});

describe('AccessibilityControls', () => {
  it('should render the toggle button', () => {
    render(<AccessibilityControls />);
    
    const toggleButton = screen.getByRole('button', { name: /open accessibility controls/i });
    expect(toggleButton).toBeInTheDocument();
  });

  it('should open the controls panel when toggle button is clicked', () => {
    render(<AccessibilityControls />);
    
    const toggleButton = screen.getByRole('button', { name: /open accessibility controls/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Accessibility Settings')).toBeInTheDocument();
  });

  it('should announce panel opening', () => {
    render(<AccessibilityControls />);
    
    const toggleButton = screen.getByRole('button', { name: /open accessibility controls/i });
    fireEvent.click(toggleButton);
    
    expect(mockAccessibilityHook.announce).toHaveBeenCalledWith({
      message: 'Accessibility controls panel opened',
      priority: 'polite'
    });
  });

  it('should display all accessibility controls', () => {
    render(<AccessibilityControls />);
    
    const toggleButton = screen.getByRole('button', { name: /open accessibility controls/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Reduced Motion')).toBeInTheDocument();
    expect(screen.getByText('Screen Reader Announcements')).toBeInTheDocument();
    expect(screen.getByText('Focus Management')).toBeInTheDocument();
    expect(screen.getByText('Keyboard Navigation')).toBeInTheDocument();
  });

  it('should toggle reduced motion when button is clicked', () => {
    render(<AccessibilityControls />);
    
    const toggleButton = screen.getByRole('button', { name: /open accessibility controls/i });
    fireEvent.click(toggleButton);
    
    const reducedMotionButton = screen.getByRole('button', { name: /enable reduced motion/i });
    fireEvent.click(reducedMotionButton);
    
    expect(mockAccessibilityHook.toggleReducedMotion).toHaveBeenCalled();
    expect(mockAccessibilityHook.announce).toHaveBeenCalledWith({
      message: 'Reduced motion enabled',
      priority: 'polite'
    });
  });

  it('should toggle screen reader announcements when button is clicked', () => {
    render(<AccessibilityControls />);
    
    const toggleButton = screen.getByRole('button', { name: /open accessibility controls/i });
    fireEvent.click(toggleButton);
    
    const screenReaderButton = screen.getByRole('button', { name: /disable screen reader announcements/i });
    fireEvent.click(screenReaderButton);
    
    expect(mockAccessibilityHook.toggleScreenReaderAnnouncements).toHaveBeenCalled();
    expect(mockAccessibilityHook.announce).toHaveBeenCalledWith({
      message: 'Screen reader announcements disabled',
      priority: 'polite'
    });
  });

  it('should toggle focus management when button is clicked', () => {
    render(<AccessibilityControls />);
    
    const toggleButton = screen.getByRole('button', { name: /open accessibility controls/i });
    fireEvent.click(toggleButton);
    
    const focusManagementButton = screen.getByRole('button', { name: /disable focus management/i });
    fireEvent.click(focusManagementButton);
    
    expect(mockAccessibilityHook.toggleFocusManagement).toHaveBeenCalled();
    expect(mockAccessibilityHook.announce).toHaveBeenCalledWith({
      message: 'Focus management disabled',
      priority: 'polite'
    });
  });

  it('should toggle keyboard navigation when button is clicked', () => {
    render(<AccessibilityControls />);
    
    const toggleButton = screen.getByRole('button', { name: /open accessibility controls/i });
    fireEvent.click(toggleButton);
    
    const keyboardNavButton = screen.getByRole('button', { name: /disable keyboard navigation enhancements/i });
    fireEvent.click(keyboardNavButton);
    
    expect(mockAccessibilityHook.toggleKeyboardNavigation).toHaveBeenCalled();
    expect(mockAccessibilityHook.announce).toHaveBeenCalledWith({
      message: 'Keyboard navigation enhancements disabled',
      priority: 'polite'
    });
  });

  it('should display keyboard shortcuts information', () => {
    render(<AccessibilityControls />);
    
    const toggleButton = screen.getByRole('button', { name: /open accessibility controls/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByText('Keyboard Shortcuts:')).toBeInTheDocument();
    expect(screen.getByText('Skip to main content')).toBeInTheDocument();
    expect(screen.getByText('Navigate back')).toBeInTheDocument();
    expect(screen.getByText('Navigate forward')).toBeInTheDocument();
  });

  it('should close the panel when close button is clicked', () => {
    render(<AccessibilityControls />);
    
    const toggleButton = screen.getByRole('button', { name: /open accessibility controls/i });
    fireEvent.click(toggleButton);
    
    // Get the close button inside the dialog (the × button)
    const dialog = screen.getByRole('dialog');
    const closeButton = dialog.querySelector('button[aria-label="Close accessibility controls"]');
    fireEvent.click(closeButton!);
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(mockAccessibilityHook.announce).toHaveBeenCalledWith({
      message: 'Accessibility controls panel closed',
      priority: 'polite'
    });
  });

  it('should reflect current preference states in button labels', () => {
    mockUseAccessibility.mockReturnValue({
      ...mockAccessibilityHook,
      preferences: {
        reducedMotion: true,
        screenReaderAnnouncements: false,
        focusManagement: true,
        keyboardNavigation: false,
      },
    });

    render(<AccessibilityControls />);
    
    const toggleButton = screen.getByRole('button', { name: /open accessibility controls/i });
    fireEvent.click(toggleButton);
    
    expect(screen.getByRole('button', { name: /disable reduced motion/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enable screen reader announcements/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /disable focus management/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enable keyboard navigation enhancements/i })).toBeInTheDocument();
  });
});