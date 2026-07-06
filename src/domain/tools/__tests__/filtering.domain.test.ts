import { filterToolsByCategory } from '../filtering.domain';

describe('Filtering Domain', () => {
  const mockTools = [
    { category: 'Design', title: 'Figma' },
    { category: 'Developer', title: 'VSCode' }
  ];

  it('returns all tools when category is all', () => {
    expect(filterToolsByCategory(mockTools, 'all')).toHaveLength(2);
    expect(filterToolsByCategory(mockTools, undefined)).toHaveLength(2);
  });

  it('filters by category case-insensitively', () => {
    const filtered = filterToolsByCategory(mockTools, 'design');
    expect(filtered).toHaveLength(1);
    expect(filtered[0].title).toBe('Figma');
  });
});
