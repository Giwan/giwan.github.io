import { isNot } from './logic.domain';

export const dateOptions: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
};

export function formatDate(date: string, options: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString('en-GB', options);
}

export function formatDateWithWeekday(date: string): string {
  return formatDate(date, { ...dateOptions, weekday: 'long' });
}

export function getDateNumber(dateString: string): number {
  if (isNotString(dateString)) throw Error('Provided date argument is not of type string');
  return parseNumericDate(dateString);
}

const isNotString = (val: unknown): boolean => typeof val !== 'string';

const parseNumericDate = (date: string) => Number(date.replace(/-/g, '')) || 0;

export function reverseDate(date = ''): number {
  return parseInt(date.split('-').reverse().join(''));
}
