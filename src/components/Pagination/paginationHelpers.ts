import {
  calculateButtonBlueprint,
  isPageValid,
  type PaginationButton
} from '../../domain/blog/pagination.domain';

/**
 * Creates the buttons based on the current page.
 * Refactored to use Narrative Domain logic.
 */
export const createButtons = function (
    values: number[] = [],
    setPage: (page: number) => void,
    pageNumber: number,
    totalPages: number
): PaginationButton[] {
    return calculateButtonBlueprint(values, pageNumber, totalPages, setPage);
};

/**
 * Check if page transition is valid.
 * Delegated to Domain Core.
 * Note: Returns undefined for invalid for legacy test compatibility.
 */
export function isValid(val: number, pageNumber: number, totalPages: number): boolean | undefined {
    const valid = isPageValid(pageNumber + val, pageNumber, totalPages, val);
    return valid ? true : undefined;
}
