import type { ArticleData } from '../types/article';
import {
  isFresh,
  isBlogPath,
  getScrollToTopBlueprint,
  getRestoreScrollBlueprint,
  type ScrollBlueprint
} from '../domain/blog/scroll.domain';

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
  return isBlogPath(window.location.pathname);
}

export function isLessThanFiveMinutes(timestamp: number): boolean {
  return isFresh(timestamp, Date.now());
}

export function windowScrollTo(top = 0) {
  const blueprint = getScrollToTopBlueprint(supportsSmoothScroll());
  applyScroll(blueprint, top);
}

function applyScroll(blueprint: ScrollBlueprint, overrideTop?: number) {
  const top = overrideTop ?? blueprint.top;
  if (blueprint.isLegacy) {
    window.scrollTo(0, top);
  } else {
    window.scrollTo({ top, behavior: blueprint.behavior });
  }
}

export function restoreToScrollPosition(pos: number, delay = 150) {
  const blueprint = getRestoreScrollBlueprint(pos, supportsSmoothScroll());
  setTimeout(() => applyScroll(blueprint), delay);
}

export function smoothScrollToTop() {
  applyScroll(getScrollToTopBlueprint(supportsSmoothScroll()));
}

export function scrollToTopOfShell() {
  smoothScrollToTop();
}
