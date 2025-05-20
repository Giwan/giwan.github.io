import type { TTool } from "../../types/tools";

/**
 * Filters a list of items based on the array of filter items
 * Each tool has a list of labels.
 * The filter list is a list of labels that should match.
 */
export const filteredList = (tools: TTool[], category?: string) => {

    if (!category || /all/i.test(category)) return tools;

    const regCategory = new RegExp(category, "i");
    return tools.filter((t) => regCategory.test(t.category));
};

export default filteredList;
