import { subCategories } from "../../data/categories";
import labels from "../../data/labels";

export type ValidationIssue = { message: string; type: 'error' | 'warning'; };

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
  return [
    ...validateTitle(tool.title),
    ...validateUrl(tool.url),
    ...validateDescription(tool.description),
    ...validatePrice(tool.price)
  ];
}

function validateTitle(t: any): ValidationIssue[] {
  return isEmptyString(t) ? [{ message: "'title' must be a non-empty string", type: 'error' }] : [];
}

function validateUrl(u: any): ValidationIssue[] {
  return isInvalidUrl(u) ? [{ message: "'url' must be a valid HTTP/HTTPS URL", type: 'error' }] : [];
}

function validateDescription(d: any): ValidationIssue[] {
  return isTooShort(d, 20) ? [{ message: "'description' is quite short", type: 'warning' }] : [];
}

function validatePrice(p: any): ValidationIssue[] {
  return isNegative(p) ? [{ message: "'price' must be a non-negative number", type: 'error' }] : [];
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
