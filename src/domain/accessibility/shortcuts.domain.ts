import { isTrue } from "../common/logic.domain";

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

const isSkipIntent = (e: any) => isTrue(e.ctrlKey) && isKey(e, '/');
const isBackIntent = (e: any) => isTrue(e.altKey) && isKey(e, 'ArrowLeft');
const isForwardIntent = (e: any) => isTrue(e.altKey) && isKey(e, 'ArrowRight');
const isSearchIntent = (e: any) => (isTrue(e.ctrlKey) || isTrue(e.metaKey)) && isKey(e, 'k');

const isKey = (e: any, key: string) => e.key === key;

export function getLandmarkMap(): Record<string, string> {
  return {
    'main-content': 'main',
    'navigation': 'nav[aria-label="Main navigation"]',
    'header': 'header[role="banner"]',
    'footer': 'footer[role="contentinfo"]'
  };
}
