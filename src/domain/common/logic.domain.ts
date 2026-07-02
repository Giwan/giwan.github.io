/**
 * Narrative Logic Primitives
 * These helpers replace "machinery" (raw operators) with semantic prose.
 */

export const isDefined = <T>(value: T | undefined | null): value is T =>
  value !== undefined && value !== null;

export const isUndefined = (value: unknown): value is undefined =>
  value === undefined;

export const isMissing = (value: unknown): boolean =>
  value === undefined || value === null;

export const isPresent = (value: unknown): boolean =>
  !isMissing(value);

export const isNot = (value: boolean): boolean =>
  !value;

export const isTrue = (value: boolean): value is true =>
  value === true;

export const isFalse = (value: boolean): value is false =>
  value === false;

export const isEmptyString = (value: string): boolean =>
  value.trim().length === 0;

export const isNotEmptyString = (value: string): boolean =>
  isNot(isEmptyString(value));
