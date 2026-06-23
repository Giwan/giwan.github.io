export function isElementVisible(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  const style = window.getComputedStyle(element);
  return rect.width > 0 && rect.height > 0 && style.visibility !== 'hidden' && style.display !== 'none';
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

export function findFirstFocusable(container: HTMLElement | Document = document): HTMLElement | null {
  const selectors = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])',
  ];

  for (const selector of selectors) {
    const elements = container.querySelectorAll<HTMLElement>(selector);
    for (const el of elements) {
      if (isElementVisible(el)) return el;
    }
  }

  return null;
}
