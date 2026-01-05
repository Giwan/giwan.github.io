import type { TTool } from "../types/tools.d";
import { subCategories } from "../data/categories";
import labels from "../data/labels";

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * URL validation regex pattern
 */
const URL_PATTERN =
  /^https?:\/\/(?:[-\w.])+(?::[0-9]+)?(?:\/(?:[\w/_.-])*(?:\?(?:[-\w&=%.])*)?(?:#(?:[-\w.])*)?)?$/;

/**
 * Validates a single tool entry structure and data
 */
export function validateToolEntry(tool: any, index?: number): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  const prefix = index !== undefined ? `Tool ${index + 1}` : 'Tool';

  // Check if tool is an object
  if (!tool || typeof tool !== 'object') {
    result.errors.push(`${prefix}: Must be an object`);
    result.isValid = false;
    return result;
  }

  // Validate required fields
  const requiredFields = ['title', 'url', 'description', 'price', 'category', 'labels'];
  
  for (const field of requiredFields) {
    if (!(field in tool)) {
      result.errors.push(`${prefix}: Missing required field '${field}'`);
      result.isValid = false;
    }
  }

  // Validate field types and values
  if ('title' in tool) {
    if (typeof tool.title !== 'string' || tool.title.trim().length === 0) {
      result.errors.push(`${prefix}: 'title' must be a non-empty string`);
      result.isValid = false;
    }
  }

  if ('url' in tool) {
    if (typeof tool.url !== 'string') {
      result.errors.push(`${prefix}: 'url' must be a string`);
      result.isValid = false;
    } else if (!URL_PATTERN.test(tool.url)) {
      result.errors.push(`${prefix}: 'url' must be a valid HTTP/HTTPS URL`);
      result.isValid = false;
    }
  }

  if ('description' in tool) {
    if (typeof tool.description !== 'string' || tool.description.trim().length === 0) {
      result.errors.push(`${prefix}: 'description' must be a non-empty string`);
      result.isValid = false;
    } else if (tool.description.length < 20) {
      result.warnings.push(`${prefix}: 'description' is quite short (${tool.description.length} chars), consider adding more detail`);
    }
  }

  if ('price' in tool) {
    if (typeof tool.price !== 'number' || tool.price < 0) {
      result.errors.push(`${prefix}: 'price' must be a non-negative number`);
      result.isValid = false;
    }
  }

  if ('currency' in tool && tool.currency !== undefined) {
    if (typeof tool.currency !== 'string' || tool.currency.length !== 3) {
      result.errors.push(`${prefix}: 'currency' must be a 3-character string (e.g., 'USD')`);
      result.isValid = false;
    }
  }

  if ('category' in tool) {
    if (typeof tool.category !== 'string') {
      result.errors.push(`${prefix}: 'category' must be a string`);
      result.isValid = false;
    } else if (!Object.values(subCategories).includes(tool.category)) {
      result.errors.push(`${prefix}: 'category' must be one of: ${Object.values(subCategories).join(', ')}`);
      result.isValid = false;
    }
  }

  if ('labels' in tool) {
    if (!Array.isArray(tool.labels)) {
      result.errors.push(`${prefix}: 'labels' must be an array`);
      result.isValid = false;
    } else {
      const validLabels = Object.values(labels);
      for (const label of tool.labels) {
        if (typeof label !== 'string') {
          result.errors.push(`${prefix}: All labels must be strings`);
          result.isValid = false;
          break;
        }
        if (!validLabels.includes(label)) {
          result.warnings.push(`${prefix}: Label '${label}' is not in the predefined labels list`);
        }
      }
      
      if (tool.labels.length === 0) {
        result.warnings.push(`${prefix}: No labels specified, consider adding relevant labels`);
      }
    }
  }

  // Validate optional fields
  if ('dateAdded' in tool && tool.dateAdded !== undefined) {
    if (typeof tool.dateAdded !== 'string') {
      result.errors.push(`${prefix}: 'dateAdded' must be a string`);
      result.isValid = false;
    } else {
      const date = new Date(tool.dateAdded);
      if (isNaN(date.getTime())) {
        result.errors.push(`${prefix}: 'dateAdded' must be a valid date string`);
        result.isValid = false;
      }
    }
  }

  if ('lastVerified' in tool && tool.lastVerified !== undefined) {
    if (typeof tool.lastVerified !== 'string') {
      result.errors.push(`${prefix}: 'lastVerified' must be a string`);
      result.isValid = false;
    } else {
      const date = new Date(tool.lastVerified);
      if (isNaN(date.getTime())) {
        result.errors.push(`${prefix}: 'lastVerified' must be a valid date string`);
        result.isValid = false;
      }
    }
  }

  return result;
}

/**
 * Validates an array of tool entries
 */
export function validateToolArray(tools: any[], fileName?: string): ValidationResult {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    warnings: []
  };

  const prefix = fileName ? `File ${fileName}` : 'Tool array';

  if (!Array.isArray(tools)) {
    result.errors.push(`${prefix}: Must export an array of tools`);
    result.isValid = false;
    return result;
  }

  if (tools.length === 0) {
    result.warnings.push(`${prefix}: Array is empty`);
  }

  // Validate each tool entry
  for (let i = 0; i < tools.length; i++) {
    const toolResult = validateToolEntry(tools[i], i);
    result.errors.push(...toolResult.errors);
    result.warnings.push(...toolResult.warnings);
    
    if (!toolResult.isValid) {
      result.isValid = false;
    }
  }

  return result;
}

/**
 * Validates URL format (basic check)
 */
export function validateUrlFormat(url: string): boolean {
  return URL_PATTERN.test(url);
}

/**
 * Checks if a URL is accessible (requires network request)
 */
export async function checkUrlAccessibility(url: string, timeout: number = 5000): Promise<{
  accessible: boolean;
  status?: number;
  error?: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      method: 'HEAD',
      signal: controller.signal,
      // Add headers to avoid being blocked by some sites
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; ToolValidator/1.0)'
      }
    });

    clearTimeout(timeoutId);

    return {
      accessible: response.ok,
      status: response.status
    };
  } catch (error) {
    return {
      accessible: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Validates all URLs in a tool array for accessibility
 */
export async function validateToolUrls(tools: TTool[], concurrency: number = 5): Promise<{
  results: Array<{
    tool: TTool;
    accessible: boolean;
    status?: number;
    error?: string;
  }>;
  summary: {
    total: number;
    accessible: number;
    inaccessible: number;
  };
}> {
  const results = [];
  const summary = {
    total: tools.length,
    accessible: 0,
    inaccessible: 0
  };

  // Process URLs in batches to avoid overwhelming servers
  for (let i = 0; i < tools.length; i += concurrency) {
    const batch = tools.slice(i, i + concurrency);
    const batchPromises = batch.map(async (tool) => {
      const result = await checkUrlAccessibility(tool.url);
      return {
        tool,
        ...result
      };
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Update summary
    for (const result of batchResults) {
      if (result.accessible) {
        summary.accessible++;
      } else {
        summary.inaccessible++;
      }
    }
  }

  return { results, summary };
}
