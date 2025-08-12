/**
 * Storage and session-related constants
 */

// SessionStorage keys
export const STORAGE_KEYS = {
  ARTICLE_STATE: 'articleState',
} as const;

// Data attributes for transitions
export const TRANSITION_ATTRIBUTES = {
  CONTEXT: 'data-transition-context',
  DIRECTION: 'data-transition-direction',
} as const;

// Transition context values
export const TRANSITION_CONTEXTS = {
  ARTICLE_LOADING: 'article-loading',
  SCROLL_RESTORE: 'scroll-restore',
} as const;

// Time constants
export const TIME_CONSTANTS = {
  FIVE_MINUTES_MS: 5 * 60 * 1000,
  TRANSITION_CLEANUP_DELAY_MS: 500,
} as const;