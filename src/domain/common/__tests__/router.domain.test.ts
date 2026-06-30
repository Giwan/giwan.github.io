import { getActiveStyle } from '../router.domain';

describe('Router Domain', () => {
  const styles = { activeLink: 'active-class' };

  it('returns active style for exact matches', () => {
    const router = { pathname: '/blog' } as any;
    expect(getActiveStyle(router, styles, '/blog')).toBe('active-class');
  });

  it('returns active style for route matches', () => {
    const router = { pathname: '/blog/some-article' } as any;
    expect(getActiveStyle(router, styles, { path: '/blog', routes: ['/blog/'] })).toBe('active-class');
  });

  it('returns undefined for non-matches', () => {
    const router = { pathname: '/about' } as any;
    expect(getActiveStyle(router, styles, '/blog')).toBeUndefined();
  });

  it('throws error when path is missing in object target', () => {
    const router = { pathname: '/' } as any;
    expect(() => getActiveStyle(router, styles, {} as any)).toThrow();
  });
});
