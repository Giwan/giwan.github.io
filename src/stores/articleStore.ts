import { map } from 'nanostores';
import type { Article, ArticleStoreState } from '../types/article';

/**
 * Store for managing article state
 * - articles: Array of loaded articles
 * - page: Current page number
 * - hasMore: Whether more articles are available
 * - isLoading: Loading state
 * - error: Error state
 */
export const $articleStore = map<ArticleStoreState>({
  articles: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  error: null
});

/**
 * Set the articles in the store
 * @param articles - The articles to set
 */
export function setArticles(articles: Article[]): void {
  $articleStore.setKey('articles', articles);
}

/**
 * Append articles to the existing articles in the store
 * @param newArticles - The articles to append
 */
export function appendArticles(newArticles: Article[]): void {
  const currentArticles = $articleStore.get().articles;
  $articleStore.setKey('articles', [...currentArticles, ...newArticles]);
}

/**
 * Set the current page number
 * @param page - The page number
 */
export function setPage(page: number): void {
  $articleStore.setKey('page', page);
}

/**
 * Set whether more articles are available
 * @param hasMore - Whether more articles are available
 */
export function setHasMore(hasMore: boolean): void {
  $articleStore.setKey('hasMore', hasMore);
}

/**
 * Set the loading state
 * @param isLoading - Whether articles are being loaded
 */
export function setLoading(isLoading: boolean): void {
  $articleStore.setKey('isLoading', isLoading);
}

/**
 * Set the error state
 * @param error - The error message or null if no error
 */
export function setError(error: string | null): void {
  $articleStore.setKey('error', error);
}

/**
 * Reset the store to its initial state
 */
export function resetStore(): void {
  $articleStore.set({
    articles: [],
    page: 1,
    hasMore: true,
    isLoading: false,
    error: null
  });
}