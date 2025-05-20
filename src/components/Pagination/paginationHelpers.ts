// import isValid from "@giwan/is-valid-page-number";
// export { isValid }; 
/**
 * Creates the buttons based on the current page.
 * If the currentPage is on the first page then
 * no buttons are created before it.
 *
 * The other way around if the current page is at the last page,
 * no buttons are created after it.
 *
 * It also checks whether 2 or 4 buttons should be created before
 * or after the current page button.
 *
 * if the conditions are passed then an object is returned.
 * The action property is a function which will set the new (valid) page number
 *
 * @param {Array} values
 * @param {Function} setPage
 * @param {Number} pageNumber
 * @param {Number} totalPages
 * @returns Object
 */
export const createButtons = function (
    values = [],
    setPage: (arg0: number) => void,
    pageNumber: number,
    totalPages: number
) {
    // if the `val` is a valid value then return the
    // object with it's label and action (to go to that page)
    return values.map(
        (val) =>
            isValid(val, pageNumber, totalPages) && {
                label: pageNumber + val,
                action: () => setPage(pageNumber + val),
            }
    );
};

/**
 * Check if `val` is a valid value.
 * If it violates any of the rules then `undefined` is returned.
 * That signals that `val` is not a valid number
 * @param { Number } val value of the button to create 
 * @param { Number } pageNumber The current page number the user is on
 * @param { Number } totalPages 
 * @param { Number } limit The button limit (Usage can be improved)
 * @returns Boolean
 */
export function isValid(val: number, pageNumber: number, totalPages: number, limit = 5) {

    const nextPage = pageNumber + val;
    const remainingPages = totalPages - pageNumber;

    // Boundary
    if (nextPage < 1 || nextPage > totalPages) return;

    // The previous buttons
    if (nextPage < pageNumber - 2 && totalPages - pageNumber >= 2) return;
    if ([1, 2].includes(remainingPages) && remainingPages - limit === val) return;

    // The next buttons
    if (nextPage > pageNumber + 2 && pageNumber > 2) return;
    if (pageNumber === 2 && val === 4) return;

    return true;
}
