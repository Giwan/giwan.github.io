import { describe, it, expect } from '@jest/globals';
import { getCategoryRoute } from '../router.domain';

describe('Router Domain - Category Routing', () => {
  it('returns /tools/all for the "all" category', () => {
    expect(getCategoryRoute('all')).toBe('/tools/all');
  });

  it('encodes special characters in category names', () => {
    expect(getCategoryRoute('IDE & Agents')).toBe('/tools/IDE%20%26%20Agents');
  });

  it('handles regular category names correctly', () => {
    expect(getCategoryRoute('Design')).toBe('/tools/Design');
  });
});
