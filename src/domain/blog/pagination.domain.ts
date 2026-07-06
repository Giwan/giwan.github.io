import { isTrue, isFalse, isNot } from '../common/logic.domain';

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

const createButton = (targetPage: number, setPage: (page: number) => void): PaginationButton => ({
  label: targetPage,
  action: () => setPage(targetPage)
});

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
  if (isDistantPast(next, current) && hasRoomAhead(remaining)) return true;
  if (isAtEnd(remaining) && isBoundaryOffset(remaining, offset)) return true;
  return false;
}

const isDistantPast = (next: number, current: number) => next < current - 2;
const hasRoomAhead = (remaining: number) => remaining >= 2;
const isAtEnd = (remaining: number) => [1, 2].includes(remaining);
const isBoundaryOffset = (remaining: number, offset: number) => (remaining - 5) === offset;

function isTooFarForward(next: number, current: number): boolean {
  return isDistantFuture(next, current) && hasBufferBehind(current);
}

const isDistantFuture = (next: number, current: number) => next > current + 2;
const hasBufferBehind = (current: number) => current > 2;

function isInvalidJump(current: number, offset: number): boolean {
  return isSecondPage(current) && isLargeLeap(offset);
}

const isSecondPage = (current: number) => current === 2;
const isLargeLeap = (offset: number) => offset === 4;
