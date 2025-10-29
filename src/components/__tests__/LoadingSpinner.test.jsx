import React from 'react';
import { render } from '@testing-library/react';
import { LoadingSpinner } from '../LoadingSpinner';
import { UI_TEXT } from '@/constants/uiTexts';

describe('LoadingSpinner', () => {
  it('should render with default props', () => {
    const { container } = render(<LoadingSpinner />);
    
    // The component should render the spinner
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg.classList.contains('w-6')).toBe(true); // medium size
    expect(svg.classList.contains('h-6')).toBe(true); // medium size
    expect(svg.classList.contains('text-primary')).toBe(true); // primary color
  });

  it('should render with custom size', () => {
    const { container } = render(<LoadingSpinner size="large" />);
    
    // The component should render the spinner with large size
    const svg = container.querySelector('svg');
    expect(svg.classList.contains('w-8')).toBe(true); // large size
    expect(svg.classList.contains('h-8')).toBe(true); // large size
  });

  it('should render with custom color', () => {
    const { container } = render(<LoadingSpinner color="secondary" />);
    
    // The component should render the spinner with secondary color
    const svg = container.querySelector('svg');
    expect(svg.classList.contains('text-secondary')).toBe(true); // secondary color
  });

  it('should have proper accessibility attributes', () => {
    const { container } = render(<LoadingSpinner />);
    
    // The component should have proper accessibility attributes
    const svg = container.querySelector('svg');
    expect(svg.getAttribute('aria-label')).toBe('Loading');
    
    // Should have a screen reader only text
    const srOnly = container.querySelector('.sr-only');
    expect(srOnly).toBeInTheDocument();
    expect(srOnly.textContent).toBe(UI_TEXT.loading);
  });
});