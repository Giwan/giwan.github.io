export interface PaginationButton {
  label: number;
  action: () => void;
}

export function calculateButtonBlueprint(
  offsets: number[],
  currentPage: number,
  totalPages: number,
  setPage: (page: number) => void
): PaginationButton[] {
  return offsets
    .filter(offset => isPageValid(currentPage + offset, currentPage, totalPages, offset))
    .map(offset => createButton(currentPage + offset, setPage));
}

function createButton(targetPage: number, setPage: (page: number) => void): PaginationButton {
  return {
    label: targetPage,
    action: () => setPage(targetPage)
  };
}

export function isPageValid(nextPage: number, currentPage: number, totalPages: number, offset: number): boolean {
  if (isOutOfBounds(nextPage, totalPages)) return false;
  if (isTooFarBack(nextPage, currentPage, totalPages, offset)) return false;
  if (isTooFarForward(nextPage, currentPage)) return false;
  if (isInvalidJump(currentPage, offset)) return false;

  return true;
}

const isOutOfBounds = (page: number, total: number) => page < 1 || page > total;

function isTooFarBack(next: number, current: number, total: number, offset: number): boolean {
  const remaining = total - current;
  if (next < current - 2 && remaining >= 2) return true;
  if ([1, 2].includes(remaining) && (remaining - 5) === offset) return true;
  return false;
}

function isTooFarForward(next: number, current: number): boolean {
  if (next > current + 2 && current > 2) return true;
  return false;
}

function isInvalidJump(current: number, offset: number): boolean {
  if (current === 2 && offset === 4) return true;
  return false;
}
