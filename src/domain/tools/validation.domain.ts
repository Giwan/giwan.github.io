import { subCategories } from "../../data/categories";
import labels from "../../data/labels";
import { isPresent, isNot, isEmptyString } from "../common/logic.domain";

export type ValidationIssue = { message: string; type: 'error' | 'warning'; };

export function validateTool(tool: unknown): ValidationIssue[] {
  if (!isRecordObject(tool)) return [{ message: 'Tool must be an object', type: 'error' }];
  return [
    ...validateRequiredFields(tool),
    ...validateFieldFormats(tool),
    ...validateCategoryAndLabels(tool)
  ];
}

const isRecordObject = (val: unknown): val is Record<string, unknown> =>
  isPresent(val) && isTypeObject(val);

const isTypeObject = (val: unknown): boolean => typeof val === 'object';

function validateRequiredFields(tool: Record<string, unknown>): ValidationIssue[] {
  const fields = ['title', 'url', 'description', 'price', 'category', 'labels'];
  return fields
    .filter(field => isMissingIn(tool, field))
    .map(field => ({ message: `Missing required field '${field}'`, type: 'error' }));
}

const isMissingIn = (obj: Record<string, unknown>, key: string) => isNot(key in obj);

function validateFieldFormats(tool: Record<string, unknown>): ValidationIssue[] {
  return [
    ...validateTitle(tool.title),
    ...validateUrl(tool.url),
    ...validateDescription(tool.description),
    ...validatePrice(tool.price)
  ];
}

const validateTitle = (t: unknown): ValidationIssue[] =>
  isInvalidString(t) ? [issue('title', 'error')] : [];

const isInvalidString = (val: unknown): boolean => {
  if (!isTypeString(val)) return true;
  return isEmptyString(val);
};

const isTypeString = (val: unknown): val is string => typeof val === 'string';
const issue = (field: string, type: 'error' | 'warning'): ValidationIssue =>
  ({ message: `'${field}' must be a non-empty string`, type });

function validateUrl(u: unknown): ValidationIssue[] {
  return isInvalidUrl(u) ? [{ message: "'url' must be a valid HTTP/HTTPS URL", type: 'error' }] : [];
}

const isInvalidUrl = (val: unknown): boolean => {
  if (!isTypeString(val)) return true;
  return isNotValidUrl(val);
};

const isNotValidUrl = (val: string) => isNot(/^https?:\/\//.test(val));

function validateDescription(d: unknown): ValidationIssue[] {
  return isTooShort(d, 20) ? [{ message: "'description' is quite short", type: 'warning' }] : [];
}

const isTooShort = (val: unknown, min: number): boolean => {
  if (!isTypeString(val)) return false;
  return val.length < min;
};

function validatePrice(p: unknown): ValidationIssue[] {
  return isNegative(p) ? [{ message: "'price' must be a non-negative number", type: 'error' }] : [];
}

const isNegative = (val: unknown): boolean => {
  if (!isTypeNumber(val)) return true;
  return val < 0;
};

const isTypeNumber = (val: unknown): val is number => typeof val === 'number';

function validateCategoryAndLabels(tool: Record<string, unknown>): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (isInvalidCategory(tool.category)) issues.push({ message: 'Invalid category', type: 'error' });
  if (!Array.isArray(tool.labels)) issues.push({ message: "'labels' must be an array", type: 'error' });
  else issues.push(...validateLabelValues(tool.labels));
  return issues;
}

const isInvalidCategory = (cat: unknown): boolean =>
  isNot(isTypeString(cat) && Object.values(subCategories).includes(cat));

function validateLabelValues(labelsList: unknown[]): ValidationIssue[] {
  const validLabels = Object.values(labels);
  return labelsList
    .filter(label => isUnknownLabel(label, validLabels))
    .map(label => ({ message: `Label '${label}' is unknown`, type: 'warning' }));
}

const isUnknownLabel = (label: unknown, valid: unknown[]) => isNot(valid.includes(label));
