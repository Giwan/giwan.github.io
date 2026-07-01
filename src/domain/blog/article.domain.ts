import type { Article } from '../../types/article';

export const POSTS_PER_PAGE = 10;

export const calculateStartIndex = (page: number, limit: number): number =>
  (page - 1) * limit;

export const calculateEndIndex = (startIndex: number, limit: number, total: number): number =>
  Math.min(startIndex + limit, total);

export function getArticleSlice(allArticles: Article[], page: number, limit: number): Article[] {
  const start = calculateStartIndex(page, limit);
  const end = calculateEndIndex(start, limit, allArticles.length);
  return allArticles.slice(start, end);
}

export const hasMoreArticles = (total: number, currentCount: number): boolean =>
  currentCount < total;

export const isEligibleForNextPage = (newArticlesCount: number, limit: number): boolean =>
  newArticlesCount === limit;

export const getNextPageNumber = (currentPage: number): number =>
  currentPage + 1;
