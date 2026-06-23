/**
 * Tests for ThemeToggle accessibility and behavior
 */

import { jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';
import { useTheme } from '../../hooks/useTheme';

// Mock the useTheme hook
jest.mock('../../hooks/useTheme');

const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

const mockThemeHook = {
  theme: 'light' as const,
  toggleTheme: jest.fn(),
  setTheme: jest.fn(),
};

beforeEach(() => {
  jest.clearAllMocks();
  mockUseTheme.mockReturnValue(mockThemeHook);
});

describe('ThemeToggle Accessibility', () => {
  it('should have a descriptive aria-label', () => {
    render(<ThemeToggle />);

    // The component is hydrated in useEffect, so we wait for the next tick
    // In JSDOM, useEffect runs synchronously unless specified otherwise
    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });

  it('should update aria-label when theme changes', () => {
    mockUseTheme.mockReturnValue({
      ...mockThemeHook,
      theme: 'dark',
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to system mode');
  });

  it('should update aria-label for system theme', () => {
    mockUseTheme.mockReturnValue({
      ...mockThemeHook,
      theme: 'system',
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
  });

  it('should be keyboard focusable', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');

    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('should trigger theme toggle on click', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');

    fireEvent.click(button);
    expect(mockThemeHook.toggleTheme).toHaveBeenCalled();
  });
});
