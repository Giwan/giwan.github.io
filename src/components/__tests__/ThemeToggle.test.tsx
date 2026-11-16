/**
 * Tests for ThemeToggle accessibility and behavior
 */

import { jest } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock useTheme with a simple mock
jest.mock('@/hooks/useTheme', () => ({
  useTheme: jest.fn(() => ({
    theme: 'light' as const,
    resolvedTheme: 'light' as const,
    toggleTheme: jest.fn(),
    setTheme: jest.fn(),
  }))
}));

import { ThemeToggle } from '../ThemeToggle';

beforeEach(() => {
  jest.clearAllMocks();
  localStorage.clear();
});

describe('ThemeToggle Accessibility', () => {
  it('should be keyboard focusable', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');

    button.focus();
    expect(document.activeElement).toBe(button);
  });

  it('should have a button element', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
  });
});
