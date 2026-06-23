import type { Article } from '../../types/article';

export const POSTS_PER_PAGE = 10;

export function calculateStartIndex(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function calculateEndIndex(startIndex: number, limit: number, total: number): number {
  return Math.min(startIndex + limit, total);
}

export function getArticleSlice(allArticles: Article[], page: number, limit: number): Article[] {
  const start = calculateStartIndex(page, limit);
  const end = calculateEndIndex(start, limit, allArticles.length);
  return allArticles.slice(start, end);
}

export function hasMoreArticles(total: number, currentCount: number): boolean {
  return currentCount < total;
}

export function isEligibleForNextPage(newArticlesCount: number, limit: number): boolean {
  return newArticlesCount === limit;
}

export function getNextPageNumber(currentPage: number): number {
  return currentPage + 1;
}
