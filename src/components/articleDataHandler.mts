import type { ArticleData } from '../types/article';

export function articleDataHandler() {
  return {
    get(): ArticleData | undefined {
      return window.__ARTICLE_DATA__;
    },
    set(data: ArticleData): ArticleData {
      return window.__ARTICLE_DATA__ = data;
    }
  };
}

export function isBlogPage(): boolean {
  return !!window.location.pathname.includes("/blog");
}

export function isLessThanFiveMinutes(timestamp: number): boolean {
  const fiveMinutes = 5 * 60 * 1000;
  return !!(Date.now() - timestamp < fiveMinutes);
}

export function restoreToScrollPosition(scrollPosition: number) {
  // Restore the scroll position after a short delay
  setTimeout(() => {
      window.scrollTo(0, scrollPosition);
  }, 100);
}