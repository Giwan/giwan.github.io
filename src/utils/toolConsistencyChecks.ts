import type { TTool } from "../types/tools.d";
import { subCategories } from "../data/categories";
import labels from "../data/labels";

/**
 * Consistency check result interface
 */
export interface ConsistencyResult {
  isConsistent: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}

/**
 * Duplicate detection result
 */
export interface DuplicateResult {
  hasDuplicates: boolean;
  duplicates: Array<{
    type: 'title' | 'url' | 'exact';
    tools: Array<{
      tool: TTool;
      index: number;
      fileName?: string;
    }>;
  }>;
}

/**
 * Validates that all categories in tools exist in the categories definition
 */
export function validateCategoryConsistency(
  tools: TTool[], 
  fileName?: string
): ConsistencyResult {
  const result: ConsistencyResult = {
    isConsistent: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  const prefix = fileName ? `File ${fileName}` : 'Tools';
  const validCategories = Object.values(subCategories);
  const usedCategories = new Set<string>();
  const invalidCategories = new Set<string>();

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const toolPrefix = `${prefix} - Tool ${i + 1} (${tool.title})`;

    if (!tool.category) {
      result.errors.push(`${toolPrefix}: Missing category`);
      result.isConsistent = false;
      continue;
    }

    usedCategories.add(tool.category);

    if (!validCategories.includes(tool.category)) {
      invalidCategories.add(tool.category);
      result.errors.push(
        `${toolPrefix}: Invalid category '${tool.category}'. Valid categories: ${validCategories.join(', ')}`
      );
      result.isConsistent = false;
    }
  }

  // Suggest similar categories for invalid ones
  for (const invalidCategory of invalidCategories) {
    const suggestions = findSimilarCategories(invalidCategory, validCategories);
    if (suggestions.length > 0) {
      result.suggestions.push(
        `Invalid category '${invalidCategory}' might be: ${suggestions.join(', ')}`
      );
    }
  }

  return result;
}

/**
 * Validates label consistency across tools
 */
export function validateLabelConsistency(
  tools: TTool[], 
  fileName?: string
): ConsistencyResult {
  const result: ConsistencyResult = {
    isConsistent: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  const prefix = fileName ? `File ${fileName}` : 'Tools';
  const validLabels = Object.values(labels);
  const usedLabels = new Set<string>();
  const invalidLabels = new Set<string>();
  const labelUsageCount = new Map<string, number>();

  for (let i = 0; i < tools.length; i++) {
    const tool = tools[i];
    const toolPrefix = `${prefix} - Tool ${i + 1} (${tool.title})`;

    if (!Array.isArray(tool.labels)) {
      result.errors.push(`${toolPrefix}: Labels must be an array`);
      result.isConsistent = false;
      continue;
    }

    if (tool.labels.length === 0) {
      result.warnings.push(`${toolPrefix}: No labels specified`);
    }

    for (const label of tool.labels) {
      usedLabels.add(label);
      
      // Count label usage
      labelUsageCount.set(label, (labelUsageCount.get(label) || 0) + 1);

      if (!validLabels.includes(label)) {
        invalidLabels.add(label);
        result.warnings.push(
          `${toolPrefix}: Label '${label}' is not in predefined labels list`
        );
      }
    }

    // Check for duplicate labels within the same tool
    const uniqueLabels = new Set(tool.labels);
    if (uniqueLabels.size !== tool.labels.length) {
      result.warnings.push(`${toolPrefix}: Contains duplicate labels`);
    }
  }

  // Suggest similar labels for invalid ones
  for (const invalidLabel of invalidLabels) {
    const suggestions = findSimilarLabels(invalidLabel, validLabels);
    if (suggestions.length > 0) {
      result.suggestions.push(
        `Invalid label '${invalidLabel}' might be: ${suggestions.join(', ')}`
      );
    }
  }

  // Report rarely used labels
  const rareLabels = Array.from(labelUsageCount.entries())
    .filter(([_, count]) => count === 1)
    .map(([label, _]) => label);

  if (rareLabels.length > 0) {
    result.suggestions.push(
      `Labels used only once (consider if they're necessary): ${rareLabels.join(', ')}`
    );
  }

  return result;
}

/**
 * Detects potential duplicate tools
 */
export function detectDuplicateTools(
  toolsData: Array<{ tools: TTool[]; fileName?: string }>
): DuplicateResult {
  const result: DuplicateResult = {
    hasDuplicates: false,
    duplicates: []
  };

  // Flatten all tools with their source information
  const allTools: Array<{
    tool: TTool;
    index: number;
    fileName?: string;
  }> = [];

  for (const { tools, fileName } of toolsData) {
    tools.forEach((tool, index) => {
      allTools.push({ tool, index, fileName });
    });
  }

  // Check for exact duplicates (same title and URL)
  const exactDuplicates = findExactDuplicates(allTools);
  if (exactDuplicates.length > 0) {
    result.hasDuplicates = true;
    result.duplicates.push(...exactDuplicates.map(group => ({
      type: 'exact' as const,
      tools: group
    })));
  }

  // Check for title duplicates
  const titleDuplicates = findTitleDuplicates(allTools);
  if (titleDuplicates.length > 0) {
    result.hasDuplicates = true;
    result.duplicates.push(...titleDuplicates.map(group => ({
      type: 'title' as const,
      tools: group
    })));
  }

  // Check for URL duplicates
  const urlDuplicates = findUrlDuplicates(allTools);
  if (urlDuplicates.length > 0) {
    result.hasDuplicates = true;
    result.duplicates.push(...urlDuplicates.map(group => ({
      type: 'url' as const,
      tools: group
    })));
  }

  return result;
}

/**
 * Comprehensive consistency check for all tool data
 */
export function validateAllToolConsistency(
  toolsData: Array<{ tools: TTool[]; fileName?: string }>
): {
  categoryConsistency: ConsistencyResult;
  labelConsistency: ConsistencyResult;
  duplicates: DuplicateResult;
  summary: {
    totalTools: number;
    totalFiles: number;
    hasErrors: boolean;
    hasWarnings: boolean;
  };
} {
  const categoryResults: ConsistencyResult[] = [];
  const labelResults: ConsistencyResult[] = [];
  let totalTools = 0;

  // Check each file
  for (const { tools, fileName } of toolsData) {
    totalTools += tools.length;
    categoryResults.push(validateCategoryConsistency(tools, fileName));
    labelResults.push(validateLabelConsistency(tools, fileName));
  }

  // Merge results
  const categoryConsistency = mergeConsistencyResults(categoryResults);
  const labelConsistency = mergeConsistencyResults(labelResults);
  const duplicates = detectDuplicateTools(toolsData);

  const hasErrors = !categoryConsistency.isConsistent || 
                   !labelConsistency.isConsistent ||
                   duplicates.hasDuplicates;
  
  const hasWarnings = categoryConsistency.warnings.length > 0 ||
                     labelConsistency.warnings.length > 0;

  return {
    categoryConsistency,
    labelConsistency,
    duplicates,
    summary: {
      totalTools,
      totalFiles: toolsData.length,
      hasErrors,
      hasWarnings
    }
  };
}

// Helper functions

function findSimilarCategories(target: string, validCategories: string[]): string[] {
  const targetLower = target.toLowerCase();
  return validCategories
    .filter(category => {
      const categoryLower = category.toLowerCase();
      return categoryLower.includes(targetLower) || 
             targetLower.includes(categoryLower) ||
             levenshteinDistance(targetLower, categoryLower) <= 2;
    })
    .slice(0, 3); // Limit to top 3 suggestions
}

function findSimilarLabels(target: string, validLabels: string[]): string[] {
  const targetLower = target.toLowerCase();
  return validLabels
    .filter(label => {
      const labelLower = label.toLowerCase();
      return labelLower.includes(targetLower) || 
             targetLower.includes(labelLower) ||
             levenshteinDistance(targetLower, labelLower) <= 2;
    })
    .slice(0, 3); // Limit to top 3 suggestions
}

function findExactDuplicates(allTools: Array<{
  tool: TTool;
  index: number;
  fileName?: string;
}>): Array<Array<{
  tool: TTool;
  index: number;
  fileName?: string;
}>> {
  const groups = new Map<string, Array<{
    tool: TTool;
    index: number;
    fileName?: string;
  }>>();

  for (const item of allTools) {
    const key = `${item.tool.title.toLowerCase()}|${item.tool.url.toLowerCase()}`;
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }

  return Array.from(groups.values()).filter(group => group.length > 1);
}

function findTitleDuplicates(allTools: Array<{
  tool: TTool;
  index: number;
  fileName?: string;
}>): Array<Array<{
  tool: TTool;
  index: number;
  fileName?: string;
}>> {
  const groups = new Map<string, Array<{
    tool: TTool;
    index: number;
    fileName?: string;
  }>>();

  for (const item of allTools) {
    const key = item.tool.title.toLowerCase().trim();
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }

  return Array.from(groups.values()).filter(group => group.length > 1);
}

function findUrlDuplicates(allTools: Array<{
  tool: TTool;
  index: number;
  fileName?: string;
}>): Array<Array<{
  tool: TTool;
  index: number;
  fileName?: string;
}>> {
  const groups = new Map<string, Array<{
    tool: TTool;
    index: number;
    fileName?: string;
  }>>();

  for (const item of allTools) {
    const key = item.tool.url.toLowerCase().trim();
    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key)!.push(item);
  }

  return Array.from(groups.values()).filter(group => group.length > 1);
}

function mergeConsistencyResults(results: ConsistencyResult[]): ConsistencyResult {
  const merged: ConsistencyResult = {
    isConsistent: true,
    errors: [],
    warnings: [],
    suggestions: []
  };

  for (const result of results) {
    if (!result.isConsistent) {
      merged.isConsistent = false;
    }
    merged.errors.push(...result.errors);
    merged.warnings.push(...result.warnings);
    merged.suggestions.push(...result.suggestions);
  }

  return merged;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) {
    matrix[0][i] = i;
  }

  for (let j = 0; j <= str2.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1, // deletion
        matrix[j - 1][i] + 1, // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  return matrix[str2.length][str1.length];
}