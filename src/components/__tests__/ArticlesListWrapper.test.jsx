import React from 'react';
import { render } from '@testing-library/react';
import ArticlesListWrapper from '../ArticlesListWrapper';
import { useStore } from '@nanostores/react';

// Mock the nanostores/react module
jest.mock('@nanostores/react');

// Mock the articleStore module
jest.mock('../../stores/articleStore', () => {
  const mockSetArticles = jest.fn();
  const mockSetHasMore = jest.fn();
  
  return {
    setArticles: mockSetArticles,
    setHasMore: mockSetHasMore
  };
});

// Import the mocked functions after mocking
const { setArticles: mockSetArticles, setHasMore: mockSetHasMore } = jest.requireMock('../../stores/articleStore');

// Mock the child components
jest.mock('../ArticlesList', () => ({
  ArticlesList: () => <div data-testid="articles-list">Articles List</div>
}));

jest.mock('../ArticlesLoadMore', () => ({
  ArticlesLoadMore: () => <div data-testid="articles-load-more">Load More</div>
}));

describe('ArticlesListWrapper', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Default mock for useStore (mobile menu closed)
    useStore.mockReturnValue(false);
    
    // Mock sessionStorage
    const mockSessionStorage = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn()
    };
    Object.defineProperty(window, 'sessionStorage', {
      value: mockSessionStorage
    });
    
    // Mock window.__ARTICLE_DATA__
    global.window.__ARTICLE_DATA__ = undefined;
  });

  it('should render the client-side components', () => {
    const initialArticles = [
      { url: '/blog/1', title: 'Article 1', description: 'Description 1', formattedDate: '2023-01-01' },
      { url: '/blog/2', title: 'Article 2', description: 'Description 2', formattedDate: '2023-01-02' }
    ];
    
    const { getByTestId } = render(
      <ArticlesListWrapper 
        initialArticles={initialArticles}
        hasMore={true}
        totalArticles={5}
        allArticles={[...initialArticles, { url: '/blog/3', title: 'Article 3' }]}
      />
    );
    
    // The component should render the client-side components
    expect(getByTestId('articles-list')).toBeInTheDocument();
    expect(getByTestId('articles-load-more')).toBeInTheDocument();
    
    // The store should be hydrated with the initial articles
    expect(mockSetArticles).toHaveBeenCalledWith(initialArticles);
    expect(mockSetHasMore).toHaveBeenCalledWith(true);
    
    // The window.__ARTICLE_DATA__ should be set
    expect(window.__ARTICLE_DATA__).toBeDefined();
    expect(window.__ARTICLE_DATA__.initialCount).toBe(2);
  });

  it('should not render when mobile menu is open', () => {
    // Mock the mobile menu being open
    useStore.mockReturnValue(true);
    
    const initialArticles = [
      { url: '/blog/1', title: 'Article 1', description: 'Description 1', formattedDate: '2023-01-01' }
    ];
    
    const { container } = render(
      <ArticlesListWrapper 
        initialArticles={initialArticles}
        hasMore={true}
        totalArticles={5}
        allArticles={[...initialArticles, { url: '/blog/3', title: 'Article 3' }]}
      />
    );
    
    // The component should not render anything
    expect(container.firstChild).toBeNull();
  });
});