import {
  $articleStore,
  appendArticles,
  setLoading,
  setError,
  setHasMore,
  setPage
} from '../stores/articleStore';
import type { Article } from '../types/article';
import { devConsole } from '../utils/isDev';
import {
  POSTS_PER_PAGE,
  getArticleSlice,
  isEligibleForNextPage,
  getNextPageNumber
} from '../domain/blog/article.domain';
import type { ArticleRepository } from '../domain/blog/ports';

const MAX_RETRY_ATTEMPTS = 3;

/**
 * Browser-based implementation of the ArticleRepository
 */
const browserArticleRepository: ArticleRepository = {
  async fetchArticles(page: number, limit: number): Promise<Article[]> {
    const { allArticles } = window.__ARTICLE_DATA__ || { allArticles: [] };

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return getArticleSlice(allArticles, page, limit);
  },

  getTotalCount(): number {
    return window.__ARTICLE_DATA__?.totalArticles || 0;
  },

  getAllArticles(): Article[] {
    return window.__ARTICLE_DATA__?.allArticles || [];
  }
};

export async function loadMoreArticles(retryAttempt = 0): Promise<void> {
  const { page, isLoading, hasMore } = $articleStore.get();

  if (shouldSkipLoading(isLoading, hasMore)) return;

  try {
    await performLoadAction(page);
  } catch (error) {
    await handleLoadError(error, retryAttempt);
  } finally {
    setLoading(false);
  }
}

function shouldSkipLoading(isLoading: boolean, hasMore: boolean): boolean {
  return isLoading || !hasMore;
}

async function performLoadAction(currentPage: number): Promise<void> {
  setLoading(true);
  setError(null);

  const nextPage = getNextPageNumber(currentPage);
  const newArticles = await browserArticleRepository.fetchArticles(nextPage, POSTS_PER_PAGE);

  updateStoreWithNewArticles(newArticles, nextPage);
  updateGlobalMetadata(newArticles.length);
}

function updateStoreWithNewArticles(newArticles: Article[], nextPage: number): void {
  appendArticles(newArticles);
  setPage(nextPage);
  setHasMore(isEligibleForNextPage(newArticles.length, POSTS_PER_PAGE));
}

function updateGlobalMetadata(count: number): void {
  if (window.__ARTICLE_DATA__) {
    window.__ARTICLE_DATA__.loadedCount = (window.__ARTICLE_DATA__.loadedCount || 0) + count;
  }
}

async function handleLoadError(error: unknown, retryAttempt: number): Promise<void> {
  devConsole('error', ['Error loading more articles:', error]);

  if (retryAttempt < MAX_RETRY_ATTEMPTS) {
    return retryWithBackoff(retryAttempt);
  }

  setError('Failed to load more articles. Please try again.');
}

async function retryWithBackoff(retryAttempt: number): Promise<void> {
  devConsole('log', [`Retrying (${retryAttempt + 1}/${MAX_RETRY_ATTEMPTS})...`]);
  await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, retryAttempt)));
  return loadMoreArticles(retryAttempt + 1);
}

export function retryLoadingArticles(): void {
  if ($articleStore.get().error) {
    loadMoreArticles();
  }
}

export function loadInitialArticles(): void {
  // SSR handled
}
