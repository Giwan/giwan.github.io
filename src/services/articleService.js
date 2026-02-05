import { 
  $articleStore, 
  appendArticles, 
  setLoading, 
  setError, 
  setHasMore, 
  setPage 
} from '../stores/articleStore';
import { devConsole } from '../utils/isDev';

const POSTS_PER_PAGE = 10;
const MAX_RETRY_ATTEMPTS = 3;

/**
 * Load initial articles from the client-side cache
 * This is typically called when the component mounts
 * The initial articles are already rendered by Astro
 */
export function loadInitialArticles() {
  // We don't need to fetch anything here since the initial articles
  // are already rendered by Astro and passed to the client
  // The store is hydrated with these articles in the ArticlesListWrapper component
}

/**
 * Load more articles from the client-side cache
 * This is called when the user clicks the "Load More" button
 * @param {number} retryAttempt - The current retry attempt (used internally)
 */
export async function loadMoreArticles(retryAttempt = 0) {
  const { page, isLoading, hasMore } = $articleStore.get();
  
  // Don't do anything if we're already loading or there are no more articles
  if (isLoading || !hasMore) return;
  
  try {
    setLoading(true);
    setError(null);
    
    const nextPage = page + 1;
    const newArticles = await fetchArticles(nextPage, POSTS_PER_PAGE);
    
    appendArticles(newArticles);
    setPage(nextPage);
    setHasMore(newArticles.length === POSTS_PER_PAGE);
    
    // Update the loaded count in the article data
    if (window.__ARTICLE_DATA__) {
      window.__ARTICLE_DATA__.loadedCount = (window.__ARTICLE_DATA__.loadedCount || 0) + newArticles.length;
    }
  } catch (error) {
    // Only log errors in development mode
    devConsole('error', ['Error loading more articles:', error]);
    
    // Retry logic
    if (retryAttempt < MAX_RETRY_ATTEMPTS) {
      // Only log retry attempts in development mode
      devConsole('log', [`Retrying (${retryAttempt + 1}/${MAX_RETRY_ATTEMPTS})...`]);
      // Wait a bit before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryAttempt)));
      return loadMoreArticles(retryAttempt + 1);
    }
    
    // If we've exhausted our retry attempts, show an error
    setError('Failed to load more articles. Please try again.');
  } finally {
    setLoading(false);
  }
}

/**
 * Retry loading articles after an error
 */
export function retryLoadingArticles() {
  const { error } = $articleStore.get();
  
  // Only retry if there was an error
  if (error) {
    loadMoreArticles();
  }
}

/**
 * Fetch articles from the client-side cache
 * This uses the data hydrated from SSR to avoid re-fetching from the server
 * 
 * @param {number} page - The page number to fetch
 * @param {number} limit - The number of articles per page
 * @returns {Promise<Array>} - A promise that resolves to an array of articles
 */
async function fetchArticles(page, limit) {
  // Use the data hydrated from SSR
  const { allArticles, totalArticles } = window.__ARTICLE_DATA__ || { allArticles: [], totalArticles: 0 };
  
  // Calculate start and end indices for pagination
  const startIndex = (page - 1) * limit;
  const endIndex = Math.min(startIndex + limit, totalArticles);
  
  // Simulate network delay for a more realistic experience
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Return the paginated articles
  return allArticles.slice(startIndex, endIndex);
}