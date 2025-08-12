import type { ArticleData } from '../types/article';
import { TIME_CONSTANTS } from '../constants/storage';

function supportsSmoothScroll(): boolean {
  return 'scrollBehavior' in document.documentElement.style;
}

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
  return !!window.location.pathname.startsWith("/blog");
}

export function isLessThanFiveMinutes(timestamp: number): boolean {
  return !!(Date.now() - timestamp < TIME_CONSTANTS.FIVE_MINUTES_MS);
}

export function windowScrollTo(scrollPosition = 0) {
  window.scrollTo({
    top: scrollPosition ?? 0,
    behavior: 'smooth'
  })
}

export function legacyBrowserWindowScroll(scrollPosition = 0) {
  window.scrollTo(0, scrollPosition);
}

const getScrollAction = () => supportsSmoothScroll() ? windowScrollTo : legacyBrowserWindowScroll;

export function restoreToScrollPosition(scrollPosition: number, delay = 150) {
  // Restore the scroll position with smooth transition
  setTimeout(() => getScrollAction()(scrollPosition), delay); // Slightly longer delay to allow for page transition to complete
}

export function smoothScrollToTop() {
  getScrollAction()();
}

export function scrollToTopOfShell() {
  smoothScrollToTop();
}