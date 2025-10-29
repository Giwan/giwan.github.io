import React from 'react';
import { render, screen } from '@testing-library/react';
import { ArticlesList } from '../ArticlesList';
import { useStore } from '@nanostores/react';
import { UI_TEXT } from '@/constants/uiTexts';

// Mock the nanostores/react module
jest.mock('@nanostores/react');

describe('ArticlesList', () => {
  beforeEach(() => {
    // Mock the window.__ARTICLE_DATA__ object
    Object.defineProperty(window, '__ARTICLE_DATA__', {
      value: {
        initialCount: 2
      },
      writable: true,
      configurable: true
    });
  });

  it('should render nothing when there are no client-side articles', () => {
    // Mock the useStore hook to return only initial articles
    useStore.mockReturnValue({
      articles: [
        { url: '/blog/1', title: 'Article 1', description: 'Description 1', formattedDate: '2023-01-01' },
        { url: '/blog/2', title: 'Article 2', description: 'Description 2', formattedDate: '2023-01-02' }
      ],
      isLoading: false
    });
    
    const { container } = render(<ArticlesList />);
    
    // The component should render nothing
    expect(container.firstChild).toBeNull();
  });

  it('should render client-side articles', () => {
    // Mock the useStore hook to return initial and client-side articles
    useStore.mockReturnValue({
      articles: [
        { url: '/blog/1', title: 'Article 1', description: 'Description 1', formattedDate: '2023-01-01' },
        { url: '/blog/2', title: 'Article 2', description: 'Description 2', formattedDate: '2023-01-02' },
        { url: '/blog/3', title: 'Article 3', description: 'Description 3', formattedDate: '2023-01-03' },
        { url: '/blog/4', title: 'Article 4', description: 'Description 4', formattedDate: '2023-01-04' }
      ],
      isLoading: false
    });
    
    render(<ArticlesList />);
    
    // The component should render the client-side articles (after initial 2)
    expect(screen.getByText('Article 3')).toBeInTheDocument();
    expect(screen.getByText('Article 4')).toBeInTheDocument();
    expect(screen.queryByText('Article 1')).not.toBeInTheDocument();
    expect(screen.queryByText('Article 2')).not.toBeInTheDocument();
  });

  it('should render loading state', () => {
    // Mock the useStore hook to return loading state
    useStore.mockReturnValue({
      articles: [
        { url: '/blog/1', title: 'Article 1', description: 'Description 1', formattedDate: '2023-01-01' },
        { url: '/blog/2', title: 'Article 2', description: 'Description 2', formattedDate: '2023-01-02' }
      ],
      isLoading: true
    });
    
    render(<ArticlesList />);
    
    // The component should render the loading state
    expect(screen.getByText(UI_TEXT.loadingMoreArticles)).toBeInTheDocument();
  });
});