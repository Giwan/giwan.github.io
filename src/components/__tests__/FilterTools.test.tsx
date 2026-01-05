import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FilterTools from '../ToolsList/FilterTools';
import { subCategories } from '../../data/categories';

describe('FilterTools Component', () => {
  const mockSetCategory = jest.fn();
  const defaultProps = {
    setCategory: mockSetCategory,
    category: undefined,
  };

  beforeEach(() => {
    mockSetCategory.mockClear();
  });

  it('renders all category filter buttons including new categories', () => {
    render(<FilterTools {...defaultProps} />);
    
    // Check that "All" button is rendered
    expect(screen.getByRole('button', { name: /all/i })).toBeInTheDocument();
    
    // Check that all new categories are rendered
    expect(screen.getByRole('button', { name: /ai & ml/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /hosting/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /frameworks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /testing/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /monitoring/i })).toBeInTheDocument();
    
    // Check existing categories are still there
    expect(screen.getByRole('button', { name: /design/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /developer/i })).toBeInTheDocument();
  });

  it('shows correct visual feedback for selected category', () => {
    render(<FilterTools {...defaultProps} category="AI & ML" />);
    
    const aiMlButton = screen.getByRole('button', { name: /ai & ml/i });
    const designButton = screen.getByRole('button', { name: /design/i });
    const allButton = screen.getByRole('button', { name: /all/i });
    
    // Selected category should have default variant (active state)
    expect(aiMlButton).toHaveClass('bg-primary');
    
    // Non-selected categories should have outline variant
    expect(designButton).toHaveClass('border-input');
    expect(allButton).toHaveClass('border-input');
  });

  it('shows "All" button as selected when no category is active', () => {
    render(<FilterTools {...defaultProps} category={undefined} />);
    
    const allButton = screen.getByRole('button', { name: /all/i });
    const designButton = screen.getByRole('button', { name: /design/i });
    
    // All button should be active when no category is selected
    expect(allButton).toHaveClass('bg-primary');
    expect(designButton).toHaveClass('border-input');
  });

  it('calls setCategory with correct value when category button is clicked', () => {
    render(<FilterTools {...defaultProps} />);
    
    const hostingButton = screen.getByRole('button', { name: /hosting/i });
    fireEvent.click(hostingButton);
    
    expect(mockSetCategory).toHaveBeenCalledWith('Hosting');
  });

  it('calls setCategory with undefined when "All" button is clicked', () => {
    render(<FilterTools {...defaultProps} category="Testing" />);
    
    const allButton = screen.getByRole('button', { name: /all/i });
    fireEvent.click(allButton);
    
    expect(mockSetCategory).toHaveBeenCalledWith(undefined);
  });

  it('handles all new categories correctly', () => {
    render(<FilterTools {...defaultProps} />);
    
    // Test each new category
    const newCategories = ['AI & ML', 'Hosting', 'Frameworks', 'Testing', 'Monitoring'];
    
    newCategories.forEach(category => {
      const button = screen.getByRole('button', { name: new RegExp(category, 'i') });
      fireEvent.click(button);
      expect(mockSetCategory).toHaveBeenCalledWith(category);
    });
    
    expect(mockSetCategory).toHaveBeenCalledTimes(newCategories.length);
  });

  it('renders correct number of filter buttons', () => {
    render(<FilterTools {...defaultProps} />);
    
    // Should have "All" button + all subcategories
    const expectedButtonCount = 1 + Object.keys(subCategories).length;
    const buttons = screen.getAllByRole('button');
    
    expect(buttons).toHaveLength(expectedButtonCount);
  });
});