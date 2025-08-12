import type { ArticleData } from '../types/article';
import { TIME_CONSTANTS } from '../constants/storage';

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
  return !!(Date.now() - timestamp < TIME_CONSTANTS.FIVE_MINUTES_MS);
}

export function restoreToScrollPosition(scrollPosition: number) {
  // Restore the scroll position with smooth transition
  setTimeout(() => {
    // Use smooth scrolling if supported
    if ('scrollBehavior' in document.documentElement.style) {
      window.scrollTo({
        top: scrollPosition,
        behavior: 'smooth'
      });
    } else {
      // Fallback for browsers that don't support smooth scrolling
      window.scrollTo(0, scrollPosition);
    }
  }, 150); // Slightly longer delay to allow for page transition to complete
}

export function smoothScrollToTop() {
  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  } else {
    window.scrollTo(0, 0);
  }
}