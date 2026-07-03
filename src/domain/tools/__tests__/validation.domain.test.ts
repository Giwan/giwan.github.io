import { validateTool } from '../validation.domain';
import type { ValidationIssue } from '../validation.domain';

describe('Tools Validation Domain', () => {
  const validTool = {
    title: 'Valid Tool',
    url: 'https://example.com',
    description: 'This is a long enough description for a valid tool.',
    price: 0,
    category: 'Design',
    labels: []
  };

  const toolWith = (overrides: Partial<typeof validTool>) => ({ ...validTool, ...overrides });

  it('validates a correct tool without issues', () => {
    const issues = validateTool(validTool);
    expect(issues.filter(i => i.type === 'error')).toHaveLength(0);
  });

  it.each<[string, unknown, (i: ValidationIssue) => boolean]>([
    ['flags missing required fields', {}, i => i.message.includes('Missing required field')],
    ['flags invalid URLs', toolWith({ url: 'invalid-url' }), i => i.message.includes('valid HTTP/HTTPS URL')],
    ['warns about short descriptions', toolWith({ description: 'Short' }), i => i.type === 'warning' && i.message.includes('quite short')],
    ['flags invalid categories', toolWith({ category: 'Invalid' }), i => i.message.includes('Invalid category')],
  ])('%s', (_label, input, matches) => {
    const issues = validateTool(input);
    expect(issues.some(matches)).toBe(true);
  });
});
