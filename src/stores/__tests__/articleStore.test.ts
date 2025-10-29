import {
  $articleStore,
  setArticles,
  appendArticles,
  setPage,
  setHasMore,
  setLoading,
  setError,
  resetStore,
} from '../articleStore';
import type { Article, ArticleStoreState } from '@/types/article';

// We need to clear the mocks to test the actual implementation
jest.clearAllMocks();

describe('articleStore', () => {
  beforeEach(() => {
    // Reset the store to its initial state before each test
    resetStore();
  });

  it('should initialize with default values', () => {
    const state: ArticleStoreState = $articleStore.get();
    expect(state).toEqual({
      articles: [],
      page: 1,
      hasMore: true,
      isLoading: false,
      error: null,
    });
  });

  it('should set articles', () => {
    const articles: Article[] = [
      { url: '/blog/1', title: 'Article 1', description: 'Description 1', formattedDate: '2023-01-01' },
      { url: '/blog/2', title: 'Article 2', description: 'Description 2', formattedDate: '2023-01-02' },
    ];
    
    setArticles(articles);
    
    const state: ArticleStoreState = $articleStore.get();
    expect(state.articles).toEqual(articles);
  });

  it('should append articles', () => {
    const initialArticles: Article[] = [
      { url: '/blog/1', title: 'Article 1', description: 'Description 1', formattedDate: '2023-01-01' },
    ];
    
    const newArticles: Article[] = [
      { url: '/blog/2', title: 'Article 2', description: 'Description 2', formattedDate: '2023-01-02' },
    ];
    
    setArticles(initialArticles);
    appendArticles(newArticles);
    
    const state: ArticleStoreState = $articleStore.get();
    expect(state.articles).toEqual([...initialArticles, ...newArticles]);
  });

  it('should set page', () => {
    setPage(2);
    
    const state: ArticleStoreState = $articleStore.get();
    expect(state.page).toBe(2);
  });

  it('should set hasMore', () => {
    setHasMore(false);
    
    const state: ArticleStoreState = $articleStore.get();
    expect(state.hasMore).toBe(false);
  });

  it('should set loading state', () => {
    setLoading(true);
    
    const state: ArticleStoreState = $articleStore.get();
    expect(state.isLoading).toBe(true);
  });

  it('should set error state', () => {
    const errorMessage = 'Failed to load articles';
    setError(errorMessage);
    
    const state: ArticleStoreState = $articleStore.get();
    expect(state.error).toBe(errorMessage);
  });

  it('should reset the store', () => {
    // Set some values
    setArticles([{ url: '/blog/1', title: 'Article 1', description: 'Description 1', formattedDate: '2023-01-01' }]);
    setPage(2);
    setHasMore(false);
    setLoading(true);
    setError('Some error');
    
    // Reset the store
    resetStore();
    
    // Check that the store is reset
    const state: ArticleStoreState = $articleStore.get();
    expect(state).toEqual({
      articles: [],
      page: 1,
      hasMore: true,
      isLoading: false,
      error: null,
    });
  });
});