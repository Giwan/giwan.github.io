import { subCategories } from "../../data/categories";
import labels from "../../data/labels";
import { isDefined, isNot, isEmptyString, isMissing } from "../common/logic.domain";

export type ValidationIssue = { message: string; type: 'error' | 'warning'; };

export function validateTool(tool: any): ValidationIssue[] {
  if (isNotAnObject(tool)) return [{ message: 'Tool must be an object', type: 'error' }];
  return [
    ...validateRequiredFields(tool),
    ...validateFieldFormats(tool),
    ...validateCategoryAndLabels(tool)
  ];
}

const isNotAnObject = (val: any) => isMissing(val) || isNot(isTypeObject(val));
const isTypeObject = (val: any) => typeof val === 'object';

function validateRequiredFields(tool: any): ValidationIssue[] {
  const fields = ['title', 'url', 'description', 'price', 'category', 'labels'];
  return fields
    .filter(field => isMissingIn(tool, field))
    .map(field => ({ message: `Missing required field '${field}'`, type: 'error' }));
}

const isMissingIn = (obj: any, key: string) => isNot(key in obj);

function validateFieldFormats(tool: any): ValidationIssue[] {
  return [
    ...validateTitle(tool.title),
    ...validateUrl(tool.url),
    ...validateDescription(tool.description),
    ...validatePrice(tool.price)
  ];
}

const validateTitle = (t: any) => isInvalidString(t) ? [issue('title', 'error')] : [];

const isInvalidString = (val: any) => isNot(isTypeString(val)) || isEmptyString(val);
const isTypeString = (val: any) => typeof val === 'string';
const issue = (field: string, type: 'error' | 'warning') =>
  ({ message: `'${field}' must be a non-empty string`, type });

function validateUrl(u: any): ValidationIssue[] {
  return isInvalidUrl(u) ? [{ message: "'url' must be a valid HTTP/HTTPS URL", type: 'error' }] : [];
}

const isInvalidUrl = (val: any) => isNot(isTypeString(val)) || isNotValidUrl(val);
const isNotValidUrl = (val: string) => isNot(/^https?:\/\//.test(val));

function validateDescription(d: any): ValidationIssue[] {
  return isTooShort(d, 20) ? [{ message: "'description' is quite short", type: 'warning' }] : [];
}

const isTooShort = (val: any, min: number) => isTypeString(val) && val.length < min;

function validatePrice(p: any): ValidationIssue[] {
  return isNegative(p) ? [{ message: "'price' must be a non-negative number", type: 'error' }] : [];
}

const isNegative = (val: any) => isNot(isTypeNumber(val)) || val < 0;
const isTypeNumber = (val: any) => typeof val === 'number';

function validateCategoryAndLabels(tool: any): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  if (isInvalidCategory(tool.category)) issues.push({ message: 'Invalid category', type: 'error' });
  if (isNotArray(tool.labels)) issues.push({ message: "'labels' must be an array", type: 'error' });
  else issues.push(...validateLabelValues(tool.labels));
  return issues;
}

const isInvalidCategory = (cat: any) => isNot(Object.values(subCategories).includes(cat));
const isNotArray = (val: any) => isNot(Array.isArray(val));

function validateLabelValues(labelsList: any[]): ValidationIssue[] {
  const validLabels = Object.values(labels);
  return labelsList
    .filter(label => isUnknownLabel(label, validLabels))
    .map(label => ({ message: `Label '${label}' is unknown`, type: 'warning' }));
}

const isUnknownLabel = (label: any, valid: any[]) => isNot(valid.includes(label));
