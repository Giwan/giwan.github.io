import { isFresh, isStale, isBlogPath, getScrollToTopBlueprint } from '../scroll.domain';

describe('Scroll Domain', () => {
  describe('Staleness', () => {
    const FIVE_MINS_MS = 5 * 60 * 1000;

    it('identifies fresh timestamps', () => {
      const now = Date.now();
      expect(isFresh(now - 1000, now)).toBe(true);
    });

    it('identifies stale timestamps', () => {
      const now = Date.now();
      expect(isStale(now - FIVE_MINS_MS - 1, now)).toBe(true);
    });
  });

  describe('Paths', () => {
    it('identifies blog paths', () => {
      expect(isBlogPath('/blog')).toBe(true);
      expect(isBlogPath('/blog/article')).toBe(true);
      expect(isBlogPath('/about')).toBe(false);
    });
  });

  describe('Blueprints', () => {
    it('generates scrollToTop blueprint', () => {
      const modern = getScrollToTopBlueprint(true);
      expect(modern.behavior).toBe('smooth');
      expect(modern.isLegacy).toBe(false);

      const legacy = getScrollToTopBlueprint(false);
      expect(legacy.isLegacy).toBe(true);
    });
  });
});
