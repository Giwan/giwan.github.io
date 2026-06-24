import type { ArticleData } from '../types/article';
import { TIME_CONSTANTS } from '../constants/storage';

function supportsSmoothScroll(): boolean {
  return typeof document !== 'undefined' && 'scrollBehavior' in document.documentElement.style;
}

export function articleDataHandler() {
  return {
    get(): ArticleData | undefined { return window.__ARTICLE_DATA__; },
    set(data: ArticleData): ArticleData { return window.__ARTICLE_DATA__ = data; }
  };
}

export function isBlogPage(): boolean {
  return window.location.pathname.startsWith("/blog");
}

export function isLessThanFiveMinutes(timestamp: number): boolean {
  return (Date.now() - timestamp) < TIME_CONSTANTS.FIVE_MINUTES_MS;
}

const getScrollAction = () => supportsSmoothScroll() ? windowScrollTo : legacyBrowserWindowScroll;

export function windowScrollTo(top = 0) {
  window.scrollTo({ top, behavior: 'smooth' });
}

export function legacyBrowserWindowScroll(top = 0) {
  window.scrollTo(0, top);
}

export function restoreToScrollPosition(pos: number, delay = 150) {
  setTimeout(() => getScrollAction()(pos), delay);
}

export function smoothScrollToTop() {
  getScrollAction()(0);
}

export function scrollToTopOfShell() {
  smoothScrollToTop();
}
