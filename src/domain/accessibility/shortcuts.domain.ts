export enum UserIntent {
  SKIP_TO_CONTENT = 'skip-to-content',
  GO_BACK = 'go-back',
  GO_FORWARD = 'go-forward',
  FOCUS_SEARCH = 'focus-search',
  NONE = 'none'
}

export function identifyIntent(event: { ctrlKey: boolean; metaKey: boolean; altKey: boolean; key: string }): UserIntent {
  if (isSkipIntent(event)) return UserIntent.SKIP_TO_CONTENT;
  if (isBackIntent(event)) return UserIntent.GO_BACK;
  if (isForwardIntent(event)) return UserIntent.GO_FORWARD;
  if (isSearchIntent(event)) return UserIntent.FOCUS_SEARCH;
  return UserIntent.NONE;
}

const isSkipIntent = (e: any) => e.ctrlKey && e.key === '/';
const isBackIntent = (e: any) => e.altKey && e.key === 'ArrowLeft';
const isForwardIntent = (e: any) => e.altKey && e.key === 'ArrowRight';
const isSearchIntent = (e: any) => (e.ctrlKey || e.metaKey) && e.key === 'k';

export function getLandmarkMap(): Record<string, string> {
  return {
    'main-content': 'main',
    'navigation': 'nav[aria-label="Main navigation"]',
    'header': 'header[role="banner"]',
    'footer': 'footer[role="contentinfo"]'
  };
}
