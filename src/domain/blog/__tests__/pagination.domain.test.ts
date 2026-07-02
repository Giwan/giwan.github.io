import { isPageValid } from '../pagination.domain';

describe('Pagination Domain', () => {
  it('identifies out of bounds pages', () => {
    expect(isPageValid(0, 1, 10, -1)).toBe(false);
    expect(isPageValid(11, 10, 10, 1)).toBe(false);
  });

  it('identifies pages too far back', () => {
    // nextPage < currentPage - 2 AND totalPages - currentPage >= 2
    expect(isPageValid(2, 5, 10, -3)).toBe(false);
    expect(isPageValid(1, 2, 10, -1)).toBe(true);
  });

  it('identifies pages too far forward', () => {
    // nextPage > currentPage + 2 AND currentPage > 2
    expect(isPageValid(8, 5, 10, 3)).toBe(false);
    expect(isPageValid(4, 2, 10, 2)).toBe(true);
  });

  it('identifies invalid jumps (Edge cases)', () => {
    expect(isPageValid(6, 2, 10, 4)).toBe(false);
  });

  it('identifies valid pages', () => {
    expect(isPageValid(5, 5, 10, 0)).toBe(true);
    expect(isPageValid(6, 5, 10, 1)).toBe(true);
    expect(isPageValid(4, 5, 10, -1)).toBe(true);
  });
});
