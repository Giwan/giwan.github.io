export function isElementVisible(element: HTMLElement, windowObj: Window): boolean {
  if (!element || !windowObj) return false;
  return hasDimensions(element) && hasVisibleStyles(element, windowObj);
}

const hasDimensions = (el: HTMLElement) => el.getBoundingClientRect().width > 0 && el.getBoundingClientRect().height > 0;

function hasVisibleStyles(el: HTMLElement, win: Window): boolean {
  const style = win.getComputedStyle(el);
  return style.visibility !== 'hidden' && style.display !== 'none';
}

export function getSkipTargetName(href: string): string {
  const targetMap: Record<string, string> = {
    '#main-content': 'main content',
    '#navigation': 'navigation',
    '#footer': 'footer',
    '#search': 'search',
    '#sidebar': 'sidebar',
  };
  return targetMap[href] || href.replace('#', '');
}

export function findFirstFocusable(container: HTMLElement | Document, windowObj: Window): HTMLElement | null {
  if (!container || !windowObj) return null;
  return searchForVisibleFocusable(container, getFocusableSelectors(), windowObj);
}

const getFocusableSelectors = () => [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'
];

function searchForVisibleFocusable(container: HTMLElement | Document, selectors: string[], win: Window): HTMLElement | null {
  return selectors
    .map(selector => container.querySelectorAll<HTMLElement>(selector))
    .map(nodes => Array.from(nodes).find(el => isElementVisible(el, win)))
    .find(match => !!match) || null;
}
