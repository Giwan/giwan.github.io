import { isMissing, isNot } from '../common/logic.domain';

export function isElementVisible(element: HTMLElement, win: Window): boolean {
  if (isMissing(element) || isMissing(win)) return false;
  return hasPhysicalPresence(element) && isDisplaying(element, win);
}

const hasPhysicalPresence = (el: HTMLElement) =>
  el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0;

const isDisplaying = (el: HTMLElement, win: Window) =>
  isNot(hasHiddenStyle(win.getComputedStyle(el)));

const hasHiddenStyle = (style: CSSStyleDeclaration) =>
  style.visibility === 'hidden' || style.display === 'none';

export function getSkipTargetName(href: string): string {
  const labelMap: Record<string, string> = {
    '#main-content': 'main content',
    '#navigation': 'navigation',
    '#footer': 'footer',
    '#search': 'search',
    '#sidebar': 'sidebar',
  };
  return labelMap[href] || href.replace('#', '');
}

export function findFirstFocusable(container: HTMLElement | Document, win: Window): HTMLElement | null {
  if (isMissing(container) || isMissing(win)) return null;
  return findVisibleMatch(container, getFocusableSelectors(), win);
}

const findVisibleMatch = (container: HTMLElement | Document, selectors: string[], win: Window) =>
  selectors
    .flatMap(selector => Array.from(container.querySelectorAll<HTMLElement>(selector)))
    .find(el => isElementVisible(el, win)) || null;

const getFocusableSelectors = () => [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'
];
