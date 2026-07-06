import { validateTool } from "../domain/tools/validation.domain";
import type { ValidationIssue } from "../domain/tools/validation.domain";
import type { TTool } from "../types/tools.d";

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export function validateToolEntry(tool: any, index?: number): ValidationResult {
  const issues = validateTool(tool);
  const prefix = index !== undefined ? `Tool ${index + 1}` : 'Tool';

  const categorize = (type: string) => issues
    .filter((i: ValidationIssue) => i.type === type)
    .map((i: ValidationIssue) => `${prefix}: ${i.message}`);

  const errors = categorize('error');
  const warnings = categorize('warning');

  return { isValid: errors.length === 0, errors, warnings };
}

export function validateToolArray(tools: any[], fileName?: string): ValidationResult {
  const result: ValidationResult = { isValid: true, errors: [], warnings: [] };
  const prefix = fileName ? `File ${fileName}` : 'Tool array';

  if (!Array.isArray(tools)) {
    return { isValid: false, errors: [`${prefix}: Must export an array of tools`], warnings: [] };
  }

  tools.forEach((tool, i) => {
    const entryResult = validateToolEntry(tool, i);
    result.errors.push(...entryResult.errors);
    result.warnings.push(...entryResult.warnings);
    if (!entryResult.isValid) result.isValid = false;
  });

  return result;
}

export function validateUrlFormat(url: string): boolean {
  return /^https?:\/\//.test(url);
}

export async function checkUrlAccessibility(url: string, timeout: number = 5000) {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await fetch(url, { method: 'HEAD', signal: controller.signal });
    clearTimeout(id);
    return { accessible: response.ok, status: response.status };
  } catch (error) {
    return { accessible: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}
