import type { ArticleData } from '../types/article';
import {
  isFresh,
  isBlogPath,
  getScrollToTopBlueprint,
  getRestoreScrollBlueprint,
  type ScrollBlueprint
} from '../domain/blog/scroll.domain';
import { isDefined, isNot } from '../domain/common/logic.domain';

export function articleDataHandler() {
  return {
    get(): ArticleData | undefined { return window.__ARTICLE_DATA__; },
    set(data: ArticleData): ArticleData { return window.__ARTICLE_DATA__ = data; }
  };
}

export const isBlogPage = () => isBlogPath(window.location.pathname);

export const isLessThanFiveMinutes = (timestamp: number) => isFresh(timestamp, Date.now());

export const windowScrollTo = (top = 0) => applyScroll(getScrollToTopBlueprint(hasSmoothScroll()), top);

export const smoothScrollToTop = () => applyScroll(getScrollToTopBlueprint(hasSmoothScroll()));

export const scrollToTopOfShell = () => smoothScrollToTop();

export const restoreToScrollPosition = (pos: number, delay = 150) =>
  setTimeout(() => applyScroll(getRestoreScrollBlueprint(pos, hasSmoothScroll())), delay);

function applyScroll(blueprint: ScrollBlueprint, overrideTop?: number) {
  const top = overrideTop ?? blueprint.top;
  return blueprint.isLegacy
    ? window.scrollTo(0, top)
    : window.scrollTo({ top, behavior: blueprint.behavior });
}

const hasSmoothScroll = () =>
  isDefined(document) && 'scrollBehavior' in document.documentElement.style;
