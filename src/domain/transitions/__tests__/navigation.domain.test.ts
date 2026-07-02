import { classifyPageType, PageType, detectNavigationDirection, NavigationDirection } from '../navigation.domain';

describe('Navigation Domain', () => {
  describe('classifyPageType', () => {
    it('classifies home page', () => {
      expect(classifyPageType('/')).toBe(PageType.HOME);
      expect(classifyPageType('')).toBe(PageType.HOME);
    });

    it('classifies blog list', () => {
      expect(classifyPageType('/blog')).toBe(PageType.BLOG_LIST);
      expect(classifyPageType('/blog/')).toBe(PageType.BLOG_LIST);
    });

    it('classifies blog post', () => {
      expect(classifyPageType('/blog/some-post')).toBe(PageType.BLOG_POST);
    });

    it('classifies tools', () => {
      expect(classifyPageType('/tools')).toBe(PageType.TOOLS_LIST);
      expect(classifyPageType('/tools/ai')).toBe(PageType.TOOLS_CATEGORY);
    });
  });

  describe('detectNavigationDirection', () => {
    it('detects refresh', () => {
      expect(detectNavigationDirection('/a', '/a', [])).toBe(NavigationDirection.REFRESH);
    });

    it('detects backward from history', () => {
      const history = ['/a', '/b', '/c'];
      expect(detectNavigationDirection('/c', '/b', history)).toBe(NavigationDirection.BACKWARD);
    });

    it('detects backward from pattern (drill up)', () => {
      expect(detectNavigationDirection('/blog/post', '/blog', [])).toBe(NavigationDirection.BACKWARD);
    });

    it('defaults to forward', () => {
      expect(detectNavigationDirection('/a', '/b', [])).toBe(NavigationDirection.FORWARD);
    });
  });
});
