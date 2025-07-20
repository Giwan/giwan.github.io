import { map } from 'nanostores';

/**
 * Store for managing article state
 * - articles: Array of loaded articles
 * - page: Current page number
 * - hasMore: Whether more articles are available
 * - isLoading: Loading state
 * - error: Error state
 */
export const $articleStore = map({
  articles: [],
  page: 1,
  hasMore: true,
  isLoading: false,
  error: null
});

/**
 * Set the articles in the store
 * @param {Array} articles - The articles to set
 */
export function setArticles(articles) {
  $articleStore.setKey('articles', articles);
}

/**
 * Append articles to the existing articles in the store
 * @param {Array} newArticles - The articles to append
 */
export function appendArticles(newArticles) {
  const currentArticles = $articleStore.get().articles;
  $articleStore.setKey('articles', [...currentArticles, ...newArticles]);
}

/**
 * Set the current page number
 * @param {number} page - The page number
 */
export function setPage(page) {
  $articleStore.setKey('page', page);
}

/**
 * Set whether more articles are available
 * @param {boolean} hasMore - Whether more articles are available
 */
export function setHasMore(hasMore) {
  $articleStore.setKey('hasMore', hasMore);
}

/**
 * Set the loading state
 * @param {boolean} isLoading - Whether articles are being loaded
 */
export function setLoading(isLoading) {
  $articleStore.setKey('isLoading', isLoading);
}

/**
 * Set the error state
 * @param {string|null} error - The error message or null if no error
 */
export function setError(error) {
  $articleStore.setKey('error', error);
}

/**
 * Reset the store to its initial state
 */
export function resetStore() {
  $articleStore.set({
    articles: [],
    page: 1,
    hasMore: true,
    isLoading: false,
    error: null
  });
}