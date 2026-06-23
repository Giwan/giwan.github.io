import { subCategories } from "../../data/categories";
import labels from "../../data/labels";

export type ValidationIssue = {
  message: string;
  type: 'error' | 'warning';
};

export function validateTool(tool: any): ValidationIssue[] {
  if (isNotAnObject(tool)) return [{ message: 'Tool must be an object', type: 'error' }];

  return [
    ...validateRequiredFields(tool),
    ...validateFieldFormats(tool),
    ...validateCategoryAndLabels(tool)
  ];
}

const isNotAnObject = (val: any) => !val || typeof val !== 'object';

function validateRequiredFields(tool: any): ValidationIssue[] {
  const fields = ['title', 'url', 'description', 'price', 'category', 'labels'];
  return fields
    .filter(field => !(field in tool))
    .map(field => ({ message: `Missing required field '${field}'`, type: 'error' }));
}

function validateFieldFormats(tool: any): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (isEmptyString(tool.title)) issues.push({ message: "'title' must be a non-empty string", type: 'error' });
  if (isInvalidUrl(tool.url)) issues.push({ message: "'url' must be a valid HTTP/HTTPS URL", type: 'error' });
  if (isTooShort(tool.description, 20)) issues.push({ message: "'description' is quite short", type: 'warning' });
  if (isNegative(tool.price)) issues.push({ message: "'price' must be a non-negative number", type: 'error' });

  return issues;
}

const isEmptyString = (val: any) => typeof val !== 'string' || val.trim().length === 0;
const isInvalidUrl = (val: any) => typeof val !== 'string' || !/^https?:\/\//.test(val);
const isTooShort = (val: any, min: number) => typeof val === 'string' && val.length < min;
const isNegative = (val: any) => typeof val !== 'number' || val < 0;

function validateCategoryAndLabels(tool: any): ValidationIssue[] {
  const issues: ValidationIssue[] = [];

  if (isInvalidCategory(tool.category)) issues.push({ message: 'Invalid category', type: 'error' });
  if (!Array.isArray(tool.labels)) issues.push({ message: "'labels' must be an array", type: 'error' });
  else issues.push(...validateLabelValues(tool.labels));

  return issues;
}

const isInvalidCategory = (cat: any) => !Object.values(subCategories).includes(cat);

function validateLabelValues(labelsList: any[]): ValidationIssue[] {
  const validLabels = Object.values(labels);
  return labelsList
    .filter(label => !validLabels.includes(label))
    .map(label => ({ message: `Label '${label}' is unknown`, type: 'warning' }));
}
