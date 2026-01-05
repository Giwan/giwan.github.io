import React from 'react';
import { render, screen } from '@testing-library/react';
import Categories from '../Categories/Categories';
import { categoriesList } from '../../data/categories';

describe('Categories Component', () => {
  const defaultProps = {
    category: 'all',
  };

  it('renders all categories including new ones', () => {
    render(<Categories {...defaultProps} />);
    
    // Check that all categories from categoriesList are rendered
    categoriesList.forEach(category => {
      const link = screen.getByRole('link', { name: new RegExp(category, 'i') });
      expect(link).toBeInTheDocument();
    });
  });

  it('renders new categories with correct links', () => {
    render(<Categories {...defaultProps} />);
    
    // Test new categories specifically
    const newCategories = ['AI & ML', 'Hosting', 'Frameworks', 'Testing', 'Monitoring'];
    
    newCategories.forEach(category => {
      const link = screen.getByRole('link', { name: new RegExp(category, 'i') });
      expect(link).toHaveAttribute('href', `/tools/${category}`);
    });
  });

  it('shows correct visual feedback for selected category', () => {
    render(<Categories category="Frameworks" />);
    
    const frameworksLink = screen.getByRole('link', { name: /frameworks/i });
    const designLink = screen.getByRole('link', { name: /design/i });
    
    // Selected category should have active styling (the link itself has the button classes)
    expect(frameworksLink).toHaveClass('bg-primary');
    
    // Non-selected category should have outline styling
    expect(designLink).toHaveClass('border-input');
  });

  it('renders proper navigation structure', () => {
    render(<Categories {...defaultProps} />);
    
    const nav = screen.getByRole('navigation', { name: /tool categories/i });
    expect(nav).toBeInTheDocument();
    
    const heading = screen.getByRole('heading', { name: /categories/i });
    expect(heading).toBeInTheDocument();
    
    const description = screen.getByText(/filter tools by category/i);
    expect(description).toBeInTheDocument();
  });

  it('renders all categories as list items', () => {
    render(<Categories {...defaultProps} />);
    
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(categoriesList.length);
  });

  it('handles expanded tool dataset categories', () => {
    render(<Categories {...defaultProps} />);
    
    // Verify that the component can handle the expanded set of categories
    // without breaking and that all expected categories are present
    const expectedCategories = [
      'all', 'Design', 'Writing', 'Reading', 'Developer', 'Wireframe',
      'Project Management', 'Software', 'Social', 'Data', 'Search',
      'AI & ML', 'Hosting', 'Frameworks', 'Testing', 'Monitoring'
    ];
    
    expectedCategories.forEach(category => {
      const link = screen.getByRole('link', { name: new RegExp(category, 'i') });
      expect(link).toBeInTheDocument();
    });
  });
});