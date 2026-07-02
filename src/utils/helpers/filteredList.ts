import type { TTool } from "../../types/tools";
import { filterToolsByCategory } from "../../domain/tools/filtering.domain";

/**
 * Filters a list of tools based on category.
 * Refactored to Narrative Domain logic.
 */
export const filteredList = (tools: TTool[], category?: string): TTool[] => {
    return filterToolsByCategory(tools, category) as TTool[];
};

export default filteredList;
