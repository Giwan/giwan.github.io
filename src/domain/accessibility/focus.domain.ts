export function isElementVisible(element: HTMLElement, windowObj: Window): boolean {
  if (!element || !windowObj) return false;

  const rect = element.getBoundingClientRect();
  if (rect.width <= 0 || rect.height <= 0) return false;

  const style = windowObj.getComputedStyle(element);
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

  const focusableSelectors = [
    'a[href]', 'button:not([disabled])', 'input:not([disabled])',
    'select:not([disabled])', 'textarea:not([disabled])', '[tabindex]:not([tabindex="-1"])'
  ];

  return searchForVisibleFocusable(container, focusableSelectors, windowObj);
}

function searchForVisibleFocusable(container: HTMLElement | Document, selectors: string[], windowObj: Window): HTMLElement | null {
  for (const selector of selectors) {
    const element = Array.from(container.querySelectorAll<HTMLElement>(selector))
      .find(el => isElementVisible(el, windowObj));

    if (element) return element;
  }
  return null;
}
