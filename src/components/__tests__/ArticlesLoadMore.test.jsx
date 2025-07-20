import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ArticlesLoadMore } from '../ArticlesLoadMore';
import { useStore } from '@nanostores/react';

// Mock the nanostores/react module
jest.mock('@nanostores/react');

// Mock the articleService module
jest.mock('../../services/articleService', () => ({
  loadMoreArticles: jest.fn(),
  retryLoadingArticles: jest.fn()
}));

// Import after mocking
const { loadMoreArticles, retryLoadingArticles } = require('../../services/articleService');

describe('ArticlesLoadMore', () => {
  beforeEach(() => {
    // Default mock for useStore
    useStore.mockReturnValue({
      articles: [
        { url: '/blog/1', title: 'Article 1', description: 'Description 1', formattedDate: '2023-01-01' },
        { url: '/blog/2', title: 'Article 2', description: 'Description 2', formattedDate: '2023-01-02' }
      ],
      page: 1,
      hasMore: true,
      isLoading: false,
      error: null
    });
    
    // Reset the mocks
    jest.clearAllMocks();
  });

  it('should render the load more button', () => {
    render(<ArticlesLoadMore />);
    
    // The component should render the load more button
    expect(screen.getByRole('button', { name: /load more articles/i })).toBeInTheDocument();
  });

  it('should call loadMoreArticles when the button is clicked', () => {
    render(<ArticlesLoadMore />);
    
    // Click the load more button
    fireEvent.click(screen.getByRole('button', { name: /load more articles/i }));
    
    // The loadMoreArticles function should be called
    expect(loadMoreArticles).toHaveBeenCalled();
  });

  it('should render loading state', () => {
    // Mock the useStore hook to return loading state
    useStore.mockReturnValue({
      articles: [
        { url: '/blog/1', title: 'Article 1', description: 'Description 1', formattedDate: '2023-01-01' },
        { url: '/blog/2', title: 'Article 2', description: 'Description 2', formattedDate: '2023-01-02' }
      ],
      page: 1,
      hasMore: true,
      isLoading: true,
      error: null
    });
    
    render(<ArticlesLoadMore />);
    
    // The component should render the loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    
    // The button should be disabled
    expect(screen.getByRole('button', { name: /load more articles/i })).toBeDisabled();
  });

  it('should render error state', () => {
    // Mock the useStore hook to return error state
    useStore.mockReturnValue({
      articles: [
        { url: '/blog/1', title: 'Article 1', description: 'Description 1', formattedDate: '2023-01-01' },
        { url: '/blog/2', title: 'Article 2', description: 'Description 2', formattedDate: '2023-01-02' }
      ],
      page: 1,
      hasMore: true,
      isLoading: false,
      error: 'Failed to load more articles'
    });
    
    render(<ArticlesLoadMore />);
    
    // The component should render the error state
    expect(screen.getByText('Failed to load more articles')).toBeInTheDocument();
    expect(screen.getByText('Try again')).toBeInTheDocument();
  });

  it('should call retryLoadingArticles when the try again button is clicked', () => {
    // Mock the useStore hook to return error state
    useStore.mockReturnValue({
      articles: [
        { url: '/blog/1', title: 'Article 1', description: 'Description 1', formattedDate: '2023-01-01' },
        { url: '/blog/2', title: 'Article 2', description: 'Description 2', formattedDate: '2023-01-02' }
      ],
      page: 1,
      hasMore: true,
      isLoading: false,
      error: 'Failed to load more articles'
    });
    
    render(<ArticlesLoadMore />);
    
    // Click the try again button
    fireEvent.click(screen.getByText('Try again'));
    
    // The retryLoadingArticles function should be called
    expect(retryLoadingArticles).toHaveBeenCalled();
  });

  it('should render nothing when there are no more articles', () => {
    // Mock the useStore hook to return no more articles
    useStore.mockReturnValue({
      articles: [
        { url: '/blog/1', title: 'Article 1', description: 'Description 1', formattedDate: '2023-01-01' },
        { url: '/blog/2', title: 'Article 2', description: 'Description 2', formattedDate: '2023-01-02' }
      ],
      page: 1,
      hasMore: false,
      isLoading: false,
      error: null
    });
    
    render(<ArticlesLoadMore />);
    
    // The component should render the end message
    expect(screen.getByText("You've reached the end of the articles.")).toBeInTheDocument();
    
    // The load more button should not be rendered
    expect(screen.queryByRole('button', { name: /load more articles/i })).not.toBeInTheDocument();
  });
});