import { analyzePageRelationship, PageRelationship } from '../relationship.domain';
import { PageType } from '../navigation.domain';

describe('Page Relationship Domain', () => {
  it('identifies sibling relationships', () => {
    expect(analyzePageRelationship(PageType.BLOG_LIST, PageType.BLOG_LIST)).toBe(PageRelationship.SIBLING);
  });

  it('identifies drill-down relationships', () => {
    expect(analyzePageRelationship(PageType.HOME, PageType.BLOG_LIST)).toBe(PageRelationship.PARENT_CHILD);
    expect(analyzePageRelationship(PageType.BLOG_LIST, PageType.BLOG_POST)).toBe(PageRelationship.PARENT_CHILD);
  });

  it('identifies drill-up relationships', () => {
    expect(analyzePageRelationship(PageType.BLOG_POST, PageType.BLOG_LIST)).toBe(PageRelationship.CHILD_PARENT);
  });

  it('identifies contextual relationships', () => {
    expect(analyzePageRelationship(PageType.BLOG_LIST, PageType.SEARCH)).toBe(PageRelationship.CONTEXTUAL);
    expect(analyzePageRelationship(PageType.HOME, PageType.ABOUT)).toBe(PageRelationship.CONTEXTUAL);
  });

  it('identifies unrelated pages', () => {
    expect(analyzePageRelationship(PageType.ABOUT, PageType.BLOG_POST)).toBe(PageRelationship.UNRELATED);
  });
});
