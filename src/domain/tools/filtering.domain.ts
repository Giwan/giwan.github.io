import { isNot } from '../common/logic.domain';

export interface Tool {
  category: string;
  [key: string]: unknown;
}

export function filterToolsByCategory(tools: Tool[], category?: string): Tool[] {
  return isSpecificCategory(category)
    ? tools.filter(tool => matchesCategory(tool, category))
    : tools;
}

const isSpecificCategory = (category: string | undefined): category is string =>
  category !== undefined && isNot(/all/i.test(category));

function matchesCategory(tool: Tool, category: string): boolean {
  const regCategory = new RegExp(category, "i");
  return regCategory.test(tool.category);
}
