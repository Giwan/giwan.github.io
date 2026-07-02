import {
  calculateStartIndex,
  calculateEndIndex,
  getArticleSlice,
  hasMoreArticles,
  isEligibleForNextPage,
  getNextPageNumber
} from '../article.domain';

describe('Article Domain', () => {
  describe('calculateStartIndex', () => {
    it('calculates the correct start index for page 1', () => {
      expect(calculateStartIndex(1, 10)).toBe(0);
    });
    it('calculates the correct start index for page 2', () => {
      expect(calculateStartIndex(2, 10)).toBe(10);
    });
  });

  describe('calculateEndIndex', () => {
    it('calculates the correct end index when not at the end', () => {
      expect(calculateEndIndex(0, 10, 50)).toBe(10);
    });
    it('caps the end index to the total count', () => {
      expect(calculateEndIndex(40, 10, 45)).toBe(45);
    });
  });

  describe('getArticleSlice', () => {
    const articles = Array(25).fill({}).map((_, i) => ({ url: `/p${i}`, title: `P${i}`, description: '', formattedDate: '' }));

    it('returns the first page of articles', () => {
      const slice = getArticleSlice(articles, 1, 10);
      expect(slice.length).toBe(10);
      expect(slice[0].title).toBe('P0');
    });

    it('returns the last page of articles', () => {
      const slice = getArticleSlice(articles, 3, 10);
      expect(slice.length).toBe(5);
      expect(slice[0].title).toBe('P20');
    });
  });

  describe('hasMoreArticles', () => {
    it('returns true if current count is less than total', () => {
      expect(hasMoreArticles(100, 50)).toBe(true);
    });
    it('returns false if current count equals total', () => {
      expect(hasMoreArticles(100, 100)).toBe(false);
    });
  });

  describe('isEligibleForNextPage', () => {
    it('returns true if current slice matches the limit', () => {
      expect(isEligibleForNextPage(10, 10)).toBe(true);
    });
    it('returns false if current slice is less than the limit', () => {
      expect(isEligibleForNextPage(5, 10)).toBe(false);
    });
  });

  describe('getNextPageNumber', () => {
    it('increments the page number', () => {
      expect(getNextPageNumber(1)).toBe(2);
    });
  });
});
