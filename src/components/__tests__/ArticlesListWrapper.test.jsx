/**
 * Tests for ArticlesListWrapper
 * 
 * NOTE: This test is currently skipped due to Jest 30 ESM mocking limitations.
 * The issue is that articleStore uses ESM imports and the mock is not being applied
 * to nested imports (ArticlesList -> articleStore).
 * 
 * This will be revisited when Jest has better ESM support.
 */

import { jest } from '@jest/globals';

describe('ArticlesListWrapper', () => {
  it.skip('should render the client-side components', () => {
    // This test is skipped due to ESM mocking issues
    // TODO: Re-enable when Jest 30 ESM mocking is more stable
  });
});
