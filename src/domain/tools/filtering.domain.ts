export interface Tool {
  category: string;
  [key: string]: any;
}

export function filterToolsByCategory(tools: Tool[], category?: string): Tool[] {
  if (isAllCategory(category)) return tools;
  return tools.filter(tool => matchesCategory(tool, category!));
}

function isAllCategory(category?: string): boolean {
  if (!category) return true;
  return /all/i.test(category);
}

function matchesCategory(tool: Tool, category: string): boolean {
  const regCategory = new RegExp(category, "i");
  return regCategory.test(tool.category);
}
