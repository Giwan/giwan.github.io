import { validateTool } from '../validation.domain';

describe('Tools Validation Domain', () => {
  const validTool = {
    title: 'Valid Tool',
    url: 'https://example.com',
    description: 'This is a long enough description for a valid tool.',
    price: 0,
    category: 'Design',
    labels: []
  };

  it('validates a correct tool without issues', () => {
    const issues = validateTool(validTool);
    expect(issues.filter(i => i.type === 'error')).toHaveLength(0);
  });

  it('flags missing required fields', () => {
    const issues = validateTool({});
    expect(issues.some(i => i.message.includes('Missing required field'))).toBe(true);
  });

  it('flags invalid URLs', () => {
    const issues = validateTool({ ...validTool, url: 'invalid-url' });
    expect(issues.some(i => i.message.includes('valid HTTP/HTTPS URL'))).toBe(true);
  });

  it('warns about short descriptions', () => {
    const issues = validateTool({ ...validTool, description: 'Short' });
    expect(issues.some(i => i.type === 'warning' && i.message.includes('quite short'))).toBe(true);
  });

  it('flags invalid categories', () => {
    const issues = validateTool({ ...validTool, category: 'Invalid' });
    expect(issues.some(i => i.message.includes('Invalid category'))).toBe(true);
  });
});
