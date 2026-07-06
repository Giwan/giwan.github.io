import { formatDate, formatDateWithWeekday, getDateNumber, reverseDate } from '../date.domain';

describe('Date Domain', () => {
  const mockOptions: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };

  it('formats dates correctly', () => {
    const formatted = formatDate('2026-06-29', mockOptions);
    expect(formatted).toBe('29 June 2026');
  });

  it('formats dates with weekday correctly', () => {
    const formatted = formatDateWithWeekday('2026-06-29');
    expect(formatted).toBe('Monday, 29 June 2026');
  });

  it('converts date string to number correctly', () => {
    expect(getDateNumber('2026-06-29')).toBe(20260629);
  });

  it('reverses date correctly', () => {
    expect(reverseDate('2026-06-29')).toBe(29062026);
  });

  it('throws error for non-string date in getDateNumber', () => {
    expect(() => getDateNumber(null as any)).toThrow();
  });
});
